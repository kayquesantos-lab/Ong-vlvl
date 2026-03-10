from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import Usuario

@api_view(['POST'])
@permission_classes([AllowAny])
def criar_usuario(request):
    dados = request.data

    if not dados.get('username'):
        return Response({'erro': 'Usuário obrigatório'}, status=400)
    if not dados.get('password'):
        return Response({'erro': 'Senha obrigatória'}, status=400)
    if Usuario.objects.filter(username=dados.get('username')).exists():
        return Response({'erro': 'Usuário já existe'}, status=400)

    usuario = Usuario.objects.create(
        username=dados.get('username'),
        email=dados.get('email', ''),
        password=make_password(dados.get('password')),
        first_name=dados.get('first_name', ''),
        last_name=dados.get('last_name', ''),
    )
    return Response({'mensagem': f'Usuário {usuario.username} criado com sucesso'}, status=201)