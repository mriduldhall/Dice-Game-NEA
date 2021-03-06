from .models import User
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserSerializer, UsernameSerializer, LeaderboardSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from collections import namedtuple


# Create your views here.
class RegisterView(APIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        request.data["username"] = request.data["username"].lower()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username').capitalize()
            password = serializer.data.get('password')
            if not User.get_user_if_exists(username):
                User(username=username, password=password).save()
                self.request.session['username'] = username
                return Response({'Message': 'Registered'}, status=status.HTTP_201_CREATED)
            return Response({'Unauthorised': 'User exists'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        request.data["username"] = request.data["username"].lower()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username').capitalize()
            password = serializer.data.get('password')
            user = User.get_user_if_exists(username)
            if user:
                user = User(username=user.username, password=user.password)
                if user.validate_password(password):
                    self.request.session['username'] = username
                    return Response({'Message': 'Logged in'}, status=status.HTTP_200_OK)
            return Response({'Unauthorised': 'Incorrect Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if 'username' in self.request.session:
            del self.request.session['username']
        return Response({'Message': 'Logged out'}, status=status.HTTP_200_OK)


class ValidateAccess(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if 'username' in self.request.session:
            return Response({'Message': 'Access'}, status=status.HTTP_200_OK)
        else:
            return Response({'Unauthorised': 'No Access'}, status=status.HTTP_401_UNAUTHORIZED)


class GetUsername(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if 'username' in self.request.session:
            return Response(UsernameSerializer({'username': self.request.session["username"]}).data, status=status.HTTP_200_OK)
        else:
            return Response({'Unauthorised': 'Not logged in'}, status=status.HTTP_401_UNAUTHORIZED)


class CurrentGameStatus(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if 'game_id' in self.request.session:
            return Response({'Message': 'In Game'}, status=status.HTTP_200_OK)
        else:
            return Response({'Message': 'Not In Game'}, status=status.HTTP_401_UNAUTHORIZED)


class LeaderboardView(APIView):
    def get(self, request, format=None):
        Leaderboard = namedtuple('Leaderboard', ('leaderboard', 'personal'))
        users = User.objects.order_by("-high_score")
        current_user = User.objects.filter(username=self.request.session["username"])[0]
        position = User.objects.filter(high_score__gt=current_user.high_score).count() + 1
        current_user.position = position
        leaderboard = Leaderboard(
            leaderboard=users[:10],
            personal=current_user,
        )
        serializer = LeaderboardSerializer(leaderboard)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK, safe=False)
