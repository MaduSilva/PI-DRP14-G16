# Generated by Django 4.2.4 on 2024-05-22 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, null=True)),
                ('cpf', models.CharField(max_length=14, null=True)),
                ('birthDate', models.DateField(null=True)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('phone', models.CharField(max_length=15, null=True)),
                ('documents', models.TextField(null=True)),
                ('status', models.CharField(max_length=110, null=True)),
            ],
        ),
    ]
