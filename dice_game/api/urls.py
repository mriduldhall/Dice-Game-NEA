from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ValidateAccess, CurrentGameStatus, LeaderboardView, GetUsername

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('validate-access', ValidateAccess.as_view()),
    path('current-game-status', CurrentGameStatus.as_view()),
    path('leaderboard', LeaderboardView.as_view()),
    path('get-username', GetUsername.as_view()),
]
