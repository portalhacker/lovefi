from django.contrib import admin

from .models import (
    Account,
    Country,
    Currency,
    Institution,
    Transaction,
    TransactionCategory,
    Vendor,
)

admin.site.register(Account)
admin.site.register(Institution)
admin.site.register(Transaction)
admin.site.register(Vendor)
admin.site.register(TransactionCategory)
admin.site.register(Country)
admin.site.register(Currency)