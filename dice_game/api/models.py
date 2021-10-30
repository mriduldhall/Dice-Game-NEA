from django.db import models


# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.TextField(unique=True)
    password = models.TextField()

    def __str__(self):
        return self.username

    @classmethod
    def get_user_if_exists(cls, username):
        user = cls.objects.filter(username=username)
        if user:
            return user[0]
        else:
            return False

    def validate_password(self, password):
        user = User.objects.filter(username=self.username)
        if (not user) or (user[0].password != password):
            return False
        else:
            return True


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    current_turn = models.IntegerField(default=None, null=True)
    player_one = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="player_two")
    player_one_score = models.IntegerField(default=0)
    player_two = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    player_two_score = models.IntegerField(default=0)
    game_end = models.DateTimeField(default=None, null=True)
