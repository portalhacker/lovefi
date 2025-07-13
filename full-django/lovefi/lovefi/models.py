from django.db import models
from django.db.models.functions import Length

class Institution(models.Model):
    name = models.CharField(max_length=255)
    country_code = models.CharField(max_length=2)

    def __str__(self):
        return self.name

class Account(models.Model):
    number = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    institution = models.ForeignKey(Institution, on_delete=models.PROTECT)
    currency_code = models.CharField(max_length=3)

    def __str__(self):
        return f"{self.name} ({self.number} - {self.institution.name})"

class Transaction(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    currency_code = models.CharField(max_length=3)
    date = models.DateField()
    description = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.amount} {self.currency_code} - {self.date} - {self.description}"
        