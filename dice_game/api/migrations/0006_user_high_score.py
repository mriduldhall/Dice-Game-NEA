# Generated by Django 3.1.5 on 2021-11-26 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_game_current_round'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='high_score',
            field=models.IntegerField(default=0),
        ),
    ]
