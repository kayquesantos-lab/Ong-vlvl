from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):

    class Role(models.TextChoices):
        ADMIN      = "ADMIN",      "Administrador"
        VOLUNTARIO = "VOLUNTARIO", "Voluntário"

    role = models.CharField(max_length=15, choices=Role.choices, default=Role.VOLUNTARIO)

    def __str__(self):
        return self.email