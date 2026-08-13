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

	return Response({
		'token': token.key,
		'user': {
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'permissions': list(user.get_all_permissions())
		},
		'unidade_id': unidade_id
    }, status=status.HTTP_200_OK)