from django.shortcuts import get_object_or_404, redirect, render
from ..models import Transaction, Account


def transactions_index(request):
    '''Shows the transaction list'''
    transactions = Transaction.objects.all() # type: ignore
    context = {"transactions": transactions}
    return render(request=request, template_name="lovefi/transaction/index.html", context=context)

def transaction_create(request):
    '''Shows the transaction create form'''
    accounts = Account.objects.all() # type: ignore
    context = {"accounts": accounts}
    return render(request=request, template_name="lovefi/transaction/create.html", context=context)

def transaction_store(request):
    '''Handles form submission to create a transaction'''
    transaction = Transaction(
        amount=request.POST['amount'],
        account=get_object_or_404(Account, pk=request.POST['account']),
        currency_code=request.POST['currency_code'],
        date=request.POST['date'],
        description=request.POST['description']
    )
    transaction.save()
    return redirect('transaction_show', transaction_id=transaction.id) # type: ignore

def transaction_show(request, transaction_id):
    '''Shows the transaction details'''
    transaction = get_object_or_404(Transaction, pk=transaction_id)
    context = {"transaction": transaction}
    return render(request=request, template_name="lovefi/transaction/show.html", context=context)

def transaction_edit(request, transaction_id):
    '''Shows the transaction edit form'''
    transaction = get_object_or_404(Transaction, pk=transaction_id)
    accounts = Account.objects.all() # type: ignore
    context = {"transaction": transaction, "accounts": accounts}
    return render(request=request, template_name="lovefi/transaction/edit.html", context=context)

def transaction_update(request, transaction_id):
    '''Handles form submission to update a transaction'''
    transaction = get_object_or_404(Transaction, pk=transaction_id)
    transaction.amount = request.POST['amount']
    transaction.account = get_object_or_404(Account, pk=request.POST['account'])
    transaction.currency_code = request.POST['currency_code']
    transaction.date = request.POST['date']
    transaction.description = request.POST['description']
    transaction.save()
    return redirect('transaction_show', transaction_id=transaction_id)

def transaction_delete(request, transaction_id):
    '''Handles form submission to delete a transaction'''
    transaction = get_object_or_404(Transaction, pk=transaction_id)
    transaction.delete()
    return redirect('transactions_index')
