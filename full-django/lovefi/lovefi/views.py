from django.http import HttpResponse, Http404
from django.shortcuts import get_list_or_404, get_object_or_404, render
from .models import Account


def index(request):
    return render(request=request, template_name="lovefi/index.html")

def accounts_index(request):
    '''List of all accounts.'''
    accounts = Account.objects.all() # type: ignore
    context = {"accounts": accounts}
    return render(request=request, template_name="lovefi/accounts/index.html", context=context)


def accounts_create(request):
    '''Account creation form.'''
    return HttpResponse(b"Hello. You're on the accounts create page.")

def account_show(request, account_id):
    '''Show an account.'''
    account = get_object_or_404(Account, pk=account_id)
    context = {"account": account}
    return render(request=request, template_name="lovefi/accounts/show.html", context=context)

