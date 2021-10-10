import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import User, Game


class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.game_name = ""

    def connect(self):
        if "username" not in self.scope["session"]:
            self.close()
        game = self.find_empty_game()
        if game:
            self.connect_to_existing_game(game)
        else:
            self.create_new_game()
        self.accept()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.game_name,
            self.channel_name
        )

    def find_empty_game(self):
        games = Game.objects.filter(player_two=None, game_end=None).exclude(player_one__username=self.scope["session"]["username"])
        if games:
            return games[0]
        return None

    def create_new_game(self):
        game = Game.objects.create(
            player_one=User.objects.get(username=self.scope["session"]["username"])
        )
        self.game_name = "game_" + str(game.id)
        async_to_sync(self.channel_layer.group_add)(
            self.game_name,
            self.channel_name
        )

    def connect_to_existing_game(self, game):
        game.player_two = User.objects.get(username=self.scope["session"]["username"])
        game.save(update_fields=["player_two"])
        self.game_name = "game_" + str(game.id)
        async_to_sync(self.channel_layer.group_add)(
            self.game_name,
            self.channel_name
        )
        async_to_sync(self.channel_layer.group_send)(
            self.game_name,
            {
                'type': 'send_signal',
                'action': '/start',
            }
        )

    def send_signal(self, event):
        action = event["action"]
        self.send(text_data=json.dumps({
            'action': action
        }))
