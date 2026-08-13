from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.db.models import Q
from django.contrib.auth.models import Group
from core.models import Menu
from core.serializers import MenuSerializer, MenuGerenciamentoSerializer, GroupSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def menu_list_view(request):
    user_groups = request.user.groups.all()

    menus = Menu.objects.filter(
        Q(grupos__in=user_groups) | Q(grupos__isnull=True),
        pai__isnull=True,
        ativo=True
    ).distinct().order_by('ordem', 'nome')

    serializer = MenuSerializer(menus, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ViewSet para Gerenciamento de Menus
class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all().order_by('pai__nome', 'ordem', 'nome')
    serializer_class = MenuGerenciamentoSerializer
    permission_classes = [IsAuthenticated]

# ViewSet para Perfis/Grupos de Acesso (Apenas Leitura)
class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]