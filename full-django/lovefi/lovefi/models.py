from django.db import models


class Country(models.Model):
    code = models.CharField(max_length=2)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.code

class Currency(models.Model):
    code = models.CharField(max_length=3)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.code

class Institution(models.Model):
    name = models.CharField(max_length=255)
    country = models.ForeignKey(Country, on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class Account(models.Model):
    number = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    institution = models.ForeignKey(Institution, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.name} ({self.number} - {self.institution.name})"

class Vendor(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class TransactionCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        if self.parent:
            return f"{self.parent} - {self.name}"
        return self.name

class Transaction(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, null=True, blank=True)
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT)
    category = models.ForeignKey(TransactionCategory, on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.date}: {self.amount}'
