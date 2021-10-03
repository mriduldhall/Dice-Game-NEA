from channels.generic.websocket import WebsocketConsumer


class GameConsumer(WebsocketConsumer):
    def connect(self):
        print("Connected")
        self.accept()

    def disconnect(self, code):
        pass
