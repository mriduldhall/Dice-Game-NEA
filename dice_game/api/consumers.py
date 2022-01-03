import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import User, Game
from .game import DiceGame


class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.game_name = ""
        self.action_list = {
            "/roll": self.roll_die,
            "/next": self.send_next_signal,
            "/cancel": self.cancel_game,
            "/leave": self.leave_game,
        }
        self.pending_messages = []
        self.number_of_rounds = 5
        self.dice_game = DiceGame()

    def connect(self):
        if "username" not in self.scope["session"]:
            self.close()
        self.dice_game.player = User.objects.get(username=self.scope["session"]["username"])
        game = self.find_empty_game()
        self.accept()
        if game == "in-game":
            self.rejoin_game()
        elif game:
            self.connect_to_existing_game(game)
        else:
            self.create_new_game()

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

    def find_empty_game(self):
        if "game_id" not in self.scope["session"]:
            games = self.dice_game.fetch_available_games()
            if games:
                return games[0]
            return None
        else:
            return "in-game"

    def create_new_game(self):
        self.dice_game.new_game()
        self.game_name = "game_" + str(self.dice_game.game.id)
        self.scope["session"]["player_number"] = 1
        self.scope["session"]["game_id"] = self.dice_game.game.id
        async_to_sync(self.channel_layer.group_add)(
            self.game_name,
            self.channel_name
        )
        self.scope["session"].save()

    def rejoin_game(self):
        player_leaderboard_positions = self.dice_game.rejoin_game(self.scope["session"]["game_id"])
        if self.dice_game.game.player_one.username == self.dice_game.player.username:
            self.scope["session"]["player_number"] = 1
        else:
            self.scope["session"]["player_number"] = 2
        self.game_name = "game_" + str(self.scope["session"]["game_id"])
        async_to_sync(self.channel_layer.group_add)(
            self.game_name,
            self.channel_name
        )
        if self.dice_game.game.player_two:
            winner = self.dice_game.get_winner()
            async_to_sync(self.channel_layer.group_send)(
                self.game_name,
                {
                    'type': 'send_signal',
                    'action': '/update',
                    'additional_data': {
                        'turn': self.dice_game.game.current_turn,
                        'player_one_score': self.dice_game.game.player_one_score,
                        'player_two_score': self.dice_game.game.player_two_score,
                        'winner': winner,
                        'round': self.dice_game.game.current_round,
                        'player_one': self.dice_game.game.player_one.username,
                        'player_two': self.dice_game.game.player_two.username,
                        'player_one_position': player_leaderboard_positions[0],
                        'player_two_position': player_leaderboard_positions[1],
                    }
                }
            )
        self.scope["session"].save()

    def connect_to_existing_game(self, game):
        launch_game, player_leaderboard_positions = self.dice_game.existing_game(game)
        self.game_name = "game_" + str(self.dice_game.game.id)
        self.scope["session"]["player_number"] = 2
        self.scope["session"]["game_id"] = self.dice_game.game.id
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
                    'player_one': self.dice_game.game.player_one.username,
                    'player_two': self.dice_game.game.player_two.username,
                    'player_one_position': player_leaderboard_positions[0],
                    'player_two_position': player_leaderboard_positions[1],
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
                    'round': self.dice_game.game.current_round,
                }
            }
        )
        launch_game()
        self.scope["session"].save()

    def roll_die(self, data):
        self.dice_game.game = Game.objects.get(id=self.dice_game.game.id)
        if self.dice_game.game.current_turn == data['player_number']:
            dice_one, dice_two, new_score, end_turn = self.dice_game.take_turn()
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
            if (self.dice_game.game.player_one_score == self.dice_game.game.player_two_score and
                    self.dice_game.game.current_round > self.number_of_rounds):
                self.number_of_rounds += 1
            if self.dice_game.game.current_round <= self.number_of_rounds:
                next_turn = end_turn()
                self.pending_messages.append(
                    [
                        self.game_name,
                        {
                            'type': 'send_signal',
                            'action': '/turn',
                            'additional_data': {
                                'turn': next_turn,
                                'round': self.dice_game.game.current_round,
                            }
                        }
                    ]
                )
            else:
                winner = self.dice_game.end_game()
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
                self.dice_game.update_turn(self.pending_messages[0][1]['additional_data']['turn'])
            async_to_sync(self.channel_layer.group_send)(
                self.pending_messages[0][0], self.pending_messages[0][1]
            )
            del self.pending_messages[0]

    def cancel_game(self, data):
        self.dice_game.delete_game()
        del self.scope["session"]["game_id"]
        self.scope["session"].save()

    def leave_game(self, data):
        del self.scope["session"]["game_id"]
        self.scope["session"].save()

    def send_signal(self, event):
        action = event["action"]
        additional_data = event["additional_data"]
        additional_data.update({'player_number': self.scope["session"]["player_number"]})
        self.send(text_data=json.dumps({
            'action': action,
            'additional_data': additional_data,
        }))
