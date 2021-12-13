from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('register', index),
    path('login', index),
    path('dashboard', index),
    path('game', index),
    path('leaderboard', index),
]
