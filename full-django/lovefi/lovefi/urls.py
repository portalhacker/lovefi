"""
URL configuration for lovefi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path(route='admin/', view=admin.site.urls),
    path(route='', view=views.generic.index, name='index'),
    path(route='accounts/', view=views.account.accounts_index, name='accounts_index'),
    path(route='accounts/create/', view=views.account.account_create, name='account_create'),
    path(route='accounts/store/', view=views.account.account_store, name='account_store'),
    path(route='accounts/<int:account_id>/', view=views.account.account_show, name='account_show'),
    path(route='accounts/<int:account_id>/edit/', view=views.account.account_edit, name='account_edit'),
    path(route='accounts/<int:account_id>/update/', view=views.account.account_update, name='account_update'),
    path(route='accounts/<int:account_id>/delete/', view=views.account.account_delete, name='account_delete'),
    path(route='transactions/', view=views.transaction.transactions_index, name='transactions_index'),
    path(route='transactions/create/', view=views.transaction.transaction_create, name='transaction_create'),
    path(route='transactions/store/', view=views.transaction.transaction_store, name='transaction_store'),
    path(route='transactions/<int:transaction_id>/', view=views.transaction.transaction_show, name='transaction_show'),
    path(route='transactions/<int:transaction_id>/edit/', view=views.transaction.transaction_edit, name='transaction_edit'),
    path(route='transactions/<int:transaction_id>/update/', view=views.transaction.transaction_update, name='transaction_update'),
    path(route='transactions/<int:transaction_id>/delete/', view=views.transaction.transaction_delete, name='transaction_delete'),
    path(route='vendors/', view=views.vendor.vendors_index, name='vendors_index'),
    path(route='vendors/create/', view=views.vendor.vendor_create, name='vendor_create'),
    path(route='vendors/store/', view=views.vendor.vendor_store, name='vendor_store'),
    path(route='vendors/<int:vendor_id>/', view=views.vendor.vendor_show, name='vendor_show'),
    path(route='vendors/<int:vendor_id>/edit/', view=views.vendor.vendor_edit, name='vendor_edit'),
    path(route='vendors/<int:vendor_id>/update/', view=views.vendor.vendor_update, name='vendor_update'),
    path(route='vendors/<int:vendor_id>/delete/', view=views.vendor.vendor_delete, name='vendor_delete'),
]
