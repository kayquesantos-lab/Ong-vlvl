from django.db import models


class Conta(models.Model):

    class Status(models.TextChoices):
        PENDENTE  = "PENDENTE",  "Pendente"
        PAGO      = "PAGO",      "Pago"
        VENCIDO   = "VENCIDO",   "Vencido"
        CANCELADO = "CANCELADO", "Cancelado"

    class Categoria(models.TextChoices):
        RACAO       = "RACAO",       "Ração"
        MEDICAMENTO = "MEDICAMENTO", "Medicamento"
        VETERINARIO = "VETERINARIO", "Veterinário"
        LIMPEZA     = "LIMPEZA",     "Limpeza"
        VACINA      = "VACINA",      "Vacina"
        OUTRO       = "OUTRO",       "Outro"

    descricao     = models.CharField(max_length=255)
    fornecedor    = models.CharField(max_length=150, blank=True, default="")
    categoria     = models.CharField(max_length=15, choices=Categoria.choices, default=Categoria.OUTRO)
    valor         = models.DecimalField(max_digits=10, decimal_places=2)
    vencimento    = models.DateField()
    status        = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDENTE)
    criado_em     = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["vencimento"]

    def __str__(self):
        return f"{self.descricao} — R$ {self.valor} ({self.status})"


class Pagamento(models.Model):
    conta          = models.ForeignKey(Conta, on_delete=models.RESTRICT, related_name="pagamentos")
    valor_pago     = models.DecimalField(max_digits=10, decimal_places=2)
    data_pagamento = models.DateField()
    observacoes    = models.TextField(blank=True, default="")
    criado_em      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-data_pagamento"]

    def __str__(self):
        return f"Pagamento de {self.conta.descricao} em {self.data_pagamento}"