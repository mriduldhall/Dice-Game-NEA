from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')


class UserScoreSerializer(serializers.ModelSerializer):
    position = serializers.IntegerField(required=False, default=None, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'high_score', 'position')


class LeaderboardSerializer(serializers.Serializer):
    leaderboard = UserScoreSerializer(many=True)
    personal = UserScoreSerializer()
