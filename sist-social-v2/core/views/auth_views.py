from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response 
from rest_framework import status

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
	username = request.data.get('username')
	password = request.data.get('password')
	unidade_id = request.data.get('unidade_id')

	if not username or not password:
		return Response(
			{'error': 'Por favor, forneça usuário e senha.'},
			status=status.HTTP_400_BAD_REQUEST
		)

	user = authenticate(username=username, password=password)

	if not user:
		return Response(
			{'error': 'Usuário ou senha inválidos.'},
			status=status.HTTP_401_UNAUTHORIZED
		)

	if not user.is_active:
		return Response(
			{'error': 'Esta conta está inválida'},
			status=status.HTTP_403_FORBIDDEN)

	token, created = Token.objects.get_or_create(user=user)

	# Verifica se possui perfil profissional (Recurso Humano) cadastrado
	has_rh = hasattr(user, 'recurso_humano')

	return Response({
		'token': token.key,
		'user': {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'permissions': list(user.get_all_permissions()),
			'groups': [g.name for g in user.groups.all()],
			'tem_profissional': has_rh
		},
		'unidade_id': unidade_id
	}, status=status.HTTP_200_OK)


from django.contrib.auth.models import User
from core.models.unidade import Unidade

@api_view(['POST'])
@permission_classes([AllowAny])
def obter_unidades_usuario_login(request):
    username = request.data.get('username', '').strip()
    try:
        user = User.objects.get(username=username)
        # Se for administrador/superusuário retorna todas as unidades
        if user.is_superuser or user.groups.filter(name__in=['Administradores', 'Admin']).exists() or user.username.lower() == 'admin':
            unidades = Unidade.objects.filter(ativo=True)
        else:
            if hasattr(user, 'recurso_humano'):
                unidades = user.recurso_humano.unidades.filter(ativo=True)
            else:
                unidades = []
        
        return Response([
            {'id': u.id, 'nome': u.nome_conhecido}
            for u in unidades
        ], status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)