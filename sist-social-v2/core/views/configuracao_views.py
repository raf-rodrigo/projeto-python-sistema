from rest_framework import viewsets
from core.models.configuracao import Configuracao
from core.serializers.configuracao_serializers import ConfiguracaoSerializer

class ConfiguracaoViewSet(viewsets.ModelViewSet):
    queryset = Configuracao.objects.all()
    serializer_class = ConfiguracaoSerializer
