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
        user = self.objects.filter(username=self.username)
        if (not user) or (user[0].password != password):
            return False
        else:
            return True
