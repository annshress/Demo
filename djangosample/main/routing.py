from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from accounts.routing import websocket_urlpatterns as accounts_ws_urlpatterns
from emails.consumers import EmailConsumer
from esign.consumers import EnvelopeWatcherConsumer

from chat.consumers import ChatConsumer, RoomConsumer
from main.middlewares import JWTTokenAuthMiddlewareStack

application = ProtocolTypeRouter({
    # Websocket chat handler
    'websocket': AllowedHostsOriginValidator(
        JWTTokenAuthMiddlewareStack(
            URLRouter(
                accounts_ws_urlpatterns + [
                    #url(r"chat/", ChatConsumer, name='chat')
                    path('messages/<username>', ChatConsumer, name='chat'),
                    path('ws/email/', EmailConsumer, name='email'),
                    path('messages/chatroom/ui/<slug>', RoomConsumer, name='chatroom'),
                    # E-SIGN consumers
                    path('watch/<slug:envelope>/', EnvelopeWatcherConsumer, name='watch-envelope')
                ]
            )
        ),
    ),
})
