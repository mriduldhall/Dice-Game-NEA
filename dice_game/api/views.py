from .models import User
from rest_framework import status
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from rest_framework.response import Response


# Create your views here.
class RegisterView(APIView):
    serializer_class = RegisterSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username').capitalize()
            password = serializer.data.get('password')
            if not User.get_user_if_exists(username):
                User(username=username, password=password).save()
                self.request.session['username'] = username
                return Response({'Message': 'Registered'}, status=status.HTTP_200_OK)
            return Response({'Not Acceptable': 'User exists'}, status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({'Bad Request': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
