from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static
from usuarios.views import TokenComAprovacaoView

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # JWT — autenticação (com verificacao de aprovacao)
    path("api/token/", TokenComAprovacaoView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Apps
    path("api/", include("animais.urls")),
    path("api/saude/", include("saude.urls")),
    path("api/financeiro/", include("financeiro.urls")),
    path("api/usuarios/", include("usuarios.urls")),

    # Swagger
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
