from django.contrib import admin

from .models import Account, Institution, Transaction

admin.site.register(Account)
admin.site.register(Institution)
admin.site.register(Transaction)
