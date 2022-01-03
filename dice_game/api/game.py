from random import randint
from .models import Game, User
from datetime import datetime


class DiceGame:
    def __init__(self):
        self.game = None
        self.player = None

    def fetch_available_games(self):
        return Game.objects.filter(
            player_two=None,
            game_end=None
        ).exclude(
            player_one__username=self.player.username
        )

    def new_game(self):
        self.game = Game.objects.create(
            player_one=self.player,
        )

    def existing_game(self, game):
        def start_game():
            self.game.current_turn = 1
            self.game.save(update_fields=["current_turn"])

        self.game = game
        self.game.player_two = self.player
        self.game.save(update_fields=["player_two"])
        return start_game, self.find_players_leaderboard_position()

    def rejoin_game(self, game_id):
        self.game = Game.objects.get(id=game_id)
        return self.find_players_leaderboard_position()

    def find_players_leaderboard_position(self):
        player_one_position = User.objects.filter(high_score__gt=self.game.player_one.high_score).count() + 1
        player_two_position = User.objects.filter(high_score__gt=self.game.player_two.high_score).count() + 1
        return player_one_position, player_two_position

    @staticmethod
    def roll_die():
        dice_one = randint(1, 6)
        dice_two = randint(1, 6)
        return dice_one, dice_two

    @staticmethod
    def calculate_new_score(current_score, roll_one, roll_two):
        total = roll_one + roll_two
        if total % 2 == 0:
            total += 10
            if roll_two == roll_two:
                bonus_die = randint(1, 6)
                total += bonus_die
        else:
            total -= 5
        new_score = current_score + total
        if new_score < 0:
            new_score = 0
        return new_score

    def take_turn(self):
        def end_turn():
            self.game.save(update_fields=["current_turn", "player_one_score", "player_two_score", "current_round"])
            return next_turn

        if self.game.current_turn == 1:
            current_score = self.game.player_one_score
            next_turn = 2
        else:
            current_score = self.game.player_two_score
            next_turn = 1
            self.game.current_round += 1
        roll_one, roll_two = self.roll_die()
        new_score = self.calculate_new_score(current_score, roll_one, roll_two)
        if self.game.current_turn == 1:
            self.game.player_one_score = new_score
        else:
            self.game.player_two_score = new_score
        self.game.current_turn = None
        return roll_one, roll_two, new_score, end_turn

    def update_turn(self, next_turn):
        self.game.current_turn = next_turn
        self.game.save(update_fields=["current_turn"])

    def update_highscores(self):
        user = User.objects.get(username=self.game.player_one.username)
        if self.game.player_one_score > user.high_score:
            user.high_score = self.game.player_one_score
            user.save(update_fields=["high_score"])
        user = User.objects.get(username=self.game.player_two.username)
        if self.game.player_two_score > user.high_score:
            user.high_score = self.game.player_two_score
            user.save(update_fields=["high_score"])

    def get_winner(self):
        if self.game.game_end:
            if self.game.player_one_score > self.game.player_two_score:
                return 1
            return 2
        return None

    def end_game(self):
        self.game.game_end = datetime.now()
        winner = self.get_winner()
        self.update_highscores()
        return winner

    def delete_game(self):
        self.game.delete()
