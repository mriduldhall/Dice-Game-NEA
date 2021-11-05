# Generated by Django 3.2.7 on 2021-10-04 19:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('player_one_score', models.IntegerField(default=0)),
                ('player_two_score', models.IntegerField(default=0)),
                ('game_end', models.DateTimeField(auto_now_add=True)),
                ('player_one', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='player_two', to='api.user')),
                ('player_two', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
            ],
        ),
    ]
