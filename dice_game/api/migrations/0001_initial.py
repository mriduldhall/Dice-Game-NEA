# Generated by Django 3.2.7 on 2021-09-14 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.TextField(unique=True)),
                ('password', models.TextField()),
            ],
        ),
    ]
