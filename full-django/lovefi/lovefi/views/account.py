from django.shortcuts import get_object_or_404, redirect, render
from ..models import Account, Institution


def accounts_index(request):
    '''Shows the account list'''
    accounts = Account.objects.all() # type: ignore
    context = {"accounts": accounts}
    return render(request=request, template_name="lovefi/account/index.html", context=context)

def account_create(request):
    '''Shows the account create form'''
    institutions = Institution.objects.all() # type: ignore
    context = {"institutions": institutions}
    return render(request=request, template_name="lovefi/account/create.html", context=context)

def account_store(request):
    '''Handles form submission to create an account'''
    account = Account(
        name=request.POST['name'],
        number=request.POST['number'],
        institution=get_object_or_404(Institution, pk=request.POST['institution']),
        currency_code=request.POST['currency_code']
    )
    account.save()
    return redirect('account_show', account_id=account.id) # type: ignore

def account_show(request, account_id):
    '''Shows the account details'''
    account = get_object_or_404(Account, pk=account_id)
    context = {"account": account}
    return render(request=request, template_name="lovefi/account/show.html", context=context)

def account_edit(request, account_id):
    '''Shows the account edit form'''
    account = get_object_or_404(Account, pk=account_id)
    institutions = Institution.objects.all() # type: ignore
    context = {"account": account, "institutions": institutions}
    return render(request=request, template_name="lovefi/account/edit.html", context=context)

def account_update(request, account_id):
    '''Handles form submission to update an account'''
    account = get_object_or_404(Account, pk=account_id)
    account.name = request.POST['name']
    account.number = request.POST['number']
    account.institution = get_object_or_404(Institution, pk=request.POST['institution'])
    account.currency_code = request.POST['currency_code']
    account.save()
    return redirect('account_show', account_id=account_id)

def account_delete(request, account_id):
    '''Handles form submission to delete an account'''
    account = get_object_or_404(Account, pk=account_id)
    account.delete()
    return redirect('accounts_index')
