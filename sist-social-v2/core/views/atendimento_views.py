import base64
import re
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models import Q
from django.db import transaction
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models.atendimento import AtendimentoSocial
from core.serializers.atendimento_serializers import AtendimentoSocialSerializer
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone

class AtendimentoViewSet(viewsets.ModelViewSet):
    serializer_class = AtendimentoSocialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'descricao_sumaria_atendimento', 
        'descricao_atendimento_tecnico', 
        'pessoa__nome', 
        'tecnico_responsavel_inicial__username', 
        'tecnico_responsavel_tecnico__username'
    ]

    def get_queryset(self):
        # Filtra registros ativos e ordena por data decrescente
        queryset = AtendimentoSocial.objects.filter(ativo=True).order_by('-data_atendimento', '-id')
        
        # Filtro por modalidade (Simplificado ou Tecnico)
        modalidade = self.request.query_params.get('modalidade')
        if modalidade == 'Encaminhamento Interno':
            queryset = queryset.filter(
                Q(modalidade='Encaminhamento Interno')
                | Q(modalidade='Tecnico', origem_atendimento__isnull=False)
            )
        elif modalidade:
            queryset = queryset.filter(modalidade=modalidade)
            
        pessoa_id = self.request.query_params.get('pessoa_id')
        if pessoa_id:
            queryset = queryset.filter(pessoa_id=pessoa_id)


        return queryset

    def perform_create(self, serializer):
        # Auto-preencher o técnico inicial se estiver criando
        # Podemos recuperar a função a partir do recurso humano do usuário logado se existir
        funcao = ""
        if hasattr(self.request.user, 'recurso_humano'):
            funcao = self.request.user.recurso_humano.funcao or ""
            
        # Pega a modalidade enviada para salvar o técnico correspondente
        modalidade = self.request.data.get('modalidade', 'Simplificado')
        
        if modalidade == 'Tecnico':
            serializer.save(
                tecnico_responsavel_tecnico=self.request.user,
                funcao_tecnico_responsavel_tecnico=funcao
            )
        else:
            serializer.save(
                tecnico_responsavel_inicial=self.request.user,
                funcao_tecnico_responsavel_inicial=funcao
            )

    @action(detail=True, methods=['post'], url_path='encaminhar-interno')
    def encaminhar_interno(self, request, pk=None):
        motivo = str(request.data.get('motivo', '')).strip()
        data_encaminhamento = request.data.get('data_atendimento')
        profissional_id = request.data.get('profissional')

        erros = {}
        if len(motivo) < 21:
            erros['motivo'] = 'O motivo deve conter no mínimo 21 caracteres.'
        elif re.search(r'(.)\1{3,}', motivo):
            erros['motivo'] = 'O motivo não pode conter o mesmo caractere repetido quatro vezes ou mais.'
        if not data_encaminhamento:
            erros['data_atendimento'] = 'Informe a data do encaminhamento.'

        profissional = User.objects.filter(pk=profissional_id, is_active=True).first()
        if not profissional:
            erros['profissional'] = 'Selecione um profissional ativo.'
        if erros:
            return Response(erros, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            origem = AtendimentoSocial.objects.select_for_update().get(pk=pk, ativo=True)
            if origem.modalidade != 'Simplificado' or origem.status != 'Aberto':
                return Response(
                    {'detail': 'Somente atendimentos simplificados e abertos podem ser encaminhados.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            perfil = getattr(profissional, 'recurso_humano', None)
            unidade_destino = perfil.unidades.order_by('id').first() if perfil else None
            funcao = (perfil.funcao or '') if perfil else ''

            novo_atendimento = AtendimentoSocial.objects.create(
                origem_atendimento=origem,
                modalidade='Tecnico',
                status='Esperando para ser aberto',
                pessoa=origem.pessoa,
                familia=origem.familia,
                prontuario=origem.prontuario,
                unidade_atendimento_social=unidade_destino or origem.unidade_atendimento_social,
                data_atendimento=data_encaminhamento,
                motivo_atendimento=origem.motivo_atendimento,
                tipo_atendimento=origem.tipo_atendimento,
                tecnico_responsavel_inicial=origem.tecnico_responsavel_inicial,
                funcao_tecnico_responsavel_inicial=origem.funcao_tecnico_responsavel_inicial,
                descricao_sumaria_atendimento=origem.descricao_sumaria_atendimento,
                tecnico_responsavel_tecnico=profissional,
                funcao_tecnico_responsavel_tecnico=funcao,
                descricao_atendimento_tecnico=motivo,
                observacoes=origem.observacoes,
            )
            origem.status = 'Encaminhado'
            origem.save(update_fields=['status'])

        return Response(
            AtendimentoSocialSerializer(novo_atendimento).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['get'], url_path='impressao')
    def impressao(self, request, pk=None):
        atendimento = self.get_object()
        logo_path = settings.BASE_DIR / 'core' / 'static' / 'core' / 'img' / 'logo_relatorio.jpg'
        logo_data_uri = ''
        if logo_path.exists():
            logo_base64 = base64.b64encode(logo_path.read_bytes()).decode('ascii')
            logo_data_uri = f'data:image/jpeg;base64,{logo_base64}'

        html = render_to_string(
            'atendimentos/impressao_atendimento.html',
            {
                'atendimento': atendimento,
                'data_emissao': timezone.localtime(),
                'logo_data_uri': logo_data_uri,
            },
            request = request,
        )

        response = HttpResponse(
            html,
            content_type='text/html; charset=utf-8',
        )

        response['Content-Disposition'] = (
            f'inline; filename="atendimento_{atendimento.id}.html"'
        )

        return response

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
