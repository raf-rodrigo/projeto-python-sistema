from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from core.models import Menu
from core.serializers import MenuSerializer

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