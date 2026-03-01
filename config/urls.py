from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # JWT — autenticação
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Apps
    path("api/animais/", include("animais.urls")),
    path("api/saude/", include("saude.urls")),
    path("api/financeiro/", include("financeiro.urls")),
    path("api/usuarios/", include("usuarios.urls")),

    # Swagger
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]