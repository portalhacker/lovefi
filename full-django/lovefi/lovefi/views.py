from django.http import HttpResponse
from django.shortcuts import render
from .models import Account


def index(request):
    return HttpResponse(b"Hello, world. You're at the LoveFI index.")

def accounts_index(request):
    '''List of all accounts.'''
    accounts = Account.objects.all()  # type: ignore
    formatted_accounts = "\n".join([str(account) for account in accounts])
    return HttpResponse(f"Accounts: {formatted_accounts}")

def accounts_create(request):
    '''Account creation form.'''
    return HttpResponse(b"Hello. You're on the accounts create page.")

def accounts_show(request, account_id):
    '''Show an account.'''
    return HttpResponse(b"Hello. You're on the account show page.")

