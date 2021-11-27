from .models import User
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response


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


class CurrentGameStatus(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if 'game_id' in self.request.session:
            return Response({'Message': 'In Game'}, status=status.HTTP_200_OK)
        else:
            return Response({'Message': 'Not In Game'}, status=status.HTTP_401_UNAUTHORIZED)
