from django.db import models
from dateutil.relativedelta import relativedelta
from animais.models import Animal


class Vacina(models.Model):

    class Tipo(models.TextChoices):
        ANTIRABICA = "ANTIRABICA", "Antirrábica"
        V10        = "V10",        "V8/V10"
        GRIPE      = "GRIPE",      "Gripe"
        OUTRA      = "OUTRA",      "Outra"

    class Dose(models.TextChoices):
        DOSE_1  = "1_DOSE",  "1ª Dose"
        DOSE_2  = "2_DOSE",  "2ª Dose"
        DOSE_3  = "3_DOSE",  "3ª Dose"
        REFORCO = "REFORCO", "Reforço"

    INTERVALO_MESES = {
        "ANTIRABICA": 12,
        "V10":        12,
        "GRIPE":      12,
        "OUTRA":      None,
    }

    animal         = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="vacinas")
    tipo           = models.CharField(max_length=15, choices=Tipo.choices)
    dose           = models.CharField(max_length=10, choices=Dose.choices, null=True, blank=True)
    data_aplicacao = models.DateField()
    proxima_data   = models.DateField(null=True, blank=True)
    observacoes    = models.TextField(blank=True, default="")
    criado_em      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-data_aplicacao"]

    def save(self, *args, **kwargs):
        if not self.proxima_data:
            meses = self.INTERVALO_MESES.get(self.tipo)
            if meses:
                self.proxima_data = self.data_aplicacao + relativedelta(months=meses)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_tipo_display()} — {self.animal.nome} ({self.data_aplicacao})"


class Tratamento(models.Model):

    class Tipo(models.TextChoices):
        VERMIFUGO     = "VERMIFUGO",     "Vermífugo"
        CARRAPATICIDA = "CARRAPATICIDA", "Carrapaticida"

    INTERVALO_MESES = {
        "VERMIFUGO":     4,
        "CARRAPATICIDA": 3,
    }

    animal         = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="tratamentos")
    tipo           = models.CharField(max_length=15, choices=Tipo.choices)
    produto        = models.CharField(max_length=150, blank=True, default="")
    data_aplicacao = models.DateField()
    proxima_data   = models.DateField(null=True, blank=True)
    observacoes    = models.TextField(blank=True, default="")
    criado_em      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-data_aplicacao"]

    def save(self, *args, **kwargs):
        if not self.proxima_data:
            meses = self.INTERVALO_MESES.get(self.tipo)
            if meses:
                self.proxima_data = self.data_aplicacao + relativedelta(months=meses)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_tipo_display()} — {self.animal.nome} ({self.data_aplicacao})"


class Banho(models.Model):
    animal      = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="banhos")
    data_banho  = models.DateField()
    tipo        = models.CharField(max_length=100, blank=True, default="")
    observacoes = models.TextField(blank=True, default="")
    criado_em   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-data_banho"]

    def __str__(self):
        return f"Banho — {self.animal.nome} ({self.data_banho})"