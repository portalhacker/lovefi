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
]
