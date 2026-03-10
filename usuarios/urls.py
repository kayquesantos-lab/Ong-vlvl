from django.urls import path
from .views import criar_usuario

urlpatterns = [
    path('cadastrar/', criar_usuario, name='criar_usuario'),
]