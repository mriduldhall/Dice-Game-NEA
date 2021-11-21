import json
from random import randint
from datetime import datetime
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import User, Game


class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.game_name = ""
        self.action_list = {
            "/roll": self.roll_die,
            "/next": self.send_next_signal,
            "/cancel": self.cancel_game,
        }
        self.pending_messages = []
        self.number_of_rounds = 5

    def connect(self):
        if "username" not in self.scope["session"]:
            self.close()
        game = self.find_empty_game()
        if game:
            self.connect_to_existing_game(game)
        else:
            self.create_new_game()
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']
        data = text_data_json['data']
        self.action_list[action](data)

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.game_name,
            self.channel_name
        )
        del self.scope["session"]["game_id"]
        self.scope["session"].save()

    def find_empty_game(self):
        games = Game.objects.filter(player_two=None, game_end=None).exclude(player_one__username=self.scope["session"]["username"])
        if games:
            return games[0]
        return None

    def create_new_game(self):
        game = Game.objects.create(
            player_one=User.objects.get(username=self.scope["session"]["username"])
        )
        self.scope["session"]["player_number"] = 1
        self.game_name = "game_" + str(game.id)
        self.scope["session"]["game_id"] = game.id
        self.scope["session"].save()
        async_to_sync(self.channel_layer.group_add)(
            self.game_name,
            self.channel_name
        )
        self.scope["session"].save()

    def connect_to_existing_game(self, game):
        game.player_two = User.objects.get(username=self.scope["session"]["username"])
        game.save(update_fields=["player_two"])
        self.scope["session"]["player_number"] = 2
        self.game_name = "game_" + str(game.id)
        self.scope["session"]["game_id"] = game.id
        async_to_sync(self.channel_layer.group_add)(
            self.game_name,
            self.channel_name
        )
        async_to_sync(self.channel_layer.group_send)(
            self.game_name,
            {
                'type': 'send_signal',
                'action': '/start',
                'additional_data': {

                }
            }
        )
        async_to_sync(self.channel_layer.group_send)(
            self.game_name,
            {
                'type': 'send_signal',
                'action': '/turn',
                'additional_data': {
                    'turn': 1,
                }
            }
        )
        game.current_turn = 1
        game.save(update_fields=["current_turn"])
        self.scope["session"].save()

    @staticmethod
    def calculate_score(current_score, dice_one, dice_two):
        total = dice_one + dice_two
        if total % 2 == 0:
            total += 10
            if dice_one == dice_two:
                bonus_die = randint(1, 6)
                total += bonus_die
        else:
            total -= 5
        current_score += total
        if current_score < 0:
            current_score = 0
        return current_score

    def roll_die(self, data):
        game = Game.objects.filter(id=self.scope["session"]["game_id"])[0]
        if game.current_turn == data['player_number']:
            if game.current_turn == 1:
                current_score = game.player_one_score
                next_turn = 2
            else:
                current_score = game.player_two_score
                next_turn = 1
                game.current_round += 1
            dice_one = randint(1, 6)
            dice_two = randint(1, 6)
            new_score = self.calculate_score(current_score, dice_one, dice_two)
            if game.current_turn == 1:
                game.player_one_score = new_score
            else:
                game.player_two_score = new_score
            async_to_sync(self.channel_layer.group_send)(
                self.game_name,
                {
                    'type': 'send_signal',
                    'action': '/rolled',
                    'additional_data': {
                        'dice_values': [dice_one, dice_two],
                        'dice_roller': data['player_number'],
                        'score': new_score,
                    }
                }
            )
            game.current_turn = None
            if game.player_one_score == game.player_two_score and game.current_round > self.number_of_rounds:
                self.number_of_rounds += 1
            if game.current_round <= self.number_of_rounds:
                game.save(update_fields=["current_turn", "player_one_score", "player_two_score", "current_round"])
                self.pending_messages.append(
                    [
                        self.game_name,
                        {
                            'type': 'send_signal',
                            'action': '/turn',
                            'additional_data': {
                                'turn': next_turn,
                            }
                        }
                    ]
                )
            else:
                game.game_end = datetime.now()
                if game.player_one_score > game.player_two_score:
                    winner = 1
                else:
                    winner = 2
                game.save(update_fields=["current_turn", "player_one_score", "player_two_score", "game_end"])
                self.pending_messages.append(
                    [
                        self.game_name,
                        {
                            'type': 'send_signal',
                            'action': '/end',
                            'additional_data': {
                                'winner': winner,
                            }
                        }
                    ]
                )
            self.scope["session"].save()

    def send_next_signal(self, data):
        if self.pending_messages:
            if self.pending_messages[0][1]['action'] == "/turn":
                game = Game.objects.filter(id=self.scope["session"]["game_id"])[0]
                game.current_turn = self.pending_messages[0][1]['additional_data']['turn']
                game.save(update_fields=["current_turn"])
            async_to_sync(self.channel_layer.group_send)(
                self.pending_messages[0][0], self.pending_messages[0][1]
            )
            del self.pending_messages[0]

    def cancel_game(self, data):
        Game.objects.filter(id=self.scope["session"]["game_id"])[0].delete()

    def send_signal(self, event):
        action = event["action"]
        additional_data = event["additional_data"]
        additional_data.update({'player_number': self.scope["session"]["player_number"]})
        self.send(text_data=json.dumps({
            'action': action,
            'additional_data': additional_data,
        }))
