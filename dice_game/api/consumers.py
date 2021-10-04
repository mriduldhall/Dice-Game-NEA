from channels.generic.websocket import WebsocketConsumer


class GameConsumer(WebsocketConsumer):
    def connect(self):
        if "username" not in self.scope["session"]:
            self.close()
        self.accept()

    def disconnect(self, code):
        pass

    def create_new_game(self):
        pass
