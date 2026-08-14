from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from core.serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Traz apenas usuários ativos no sistema (exclusão lógica)
        return User.objects.filter(is_active=True).order_by('-id')

    def perform_destroy(self, instance):
        # Soft delete: desativa o usuário em vez de deletar fisicamente
        instance.is_active = False
        instance.save()