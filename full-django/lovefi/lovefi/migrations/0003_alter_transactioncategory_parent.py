# Generated by Django 5.2.4 on 2025-07-28 04:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lovefi', '0002_alter_transactioncategory_parent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transactioncategory',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='lovefi.transactioncategory'),
        ),
    ]
