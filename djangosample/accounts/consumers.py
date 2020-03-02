import json

from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone


class EmployeeOnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        if not hasattr(self.scope["user"], "employee"):
            # not an employee, but an admin
            if hasattr(self.scope["user"], "admin_of"):
                self.room = str(self.scope["user"].company.id)
                await self.channel_layer.group_add(
                    self.room, self.channel_name
                )
                await self.accept()
                return
            else:
                await self.close()
                return
        self.employee = self.scope["user"].employee
        self.room = str(self.employee.company.id)
        # once she connects, set her to online
        await self.alter_employee_status()
        # add her into the room
        await self.channel_layer.group_add(
            self.room, self.channel_name
        )
        # and let others know in the group that she is online
        await self.channel_layer.group_send(
            self.room, {
                "type": "group_send",
                "message": json.dumps({
                    "id": self.employee.id,
                    "online": True
                })
            }
        )
        await self.accept()

    async def disconnect(self, code):
        if getattr(self, "employee", None):
            await self.alter_employee_status(False)
            # remove her from the room
            await self.channel_layer.group_discard(
                self.room, self.channel_name
            )
            # and let others know in the group that she has gone offline
            await self.channel_layer.group_send(
                self.room, {
                    "type": "group_send",
                    "message": json.dumps({
                        "id": self.employee.id,
                        "online": False
                    })
                }
            )

    async def group_send(self, event):
        await self.send(event["message"])

    @database_sync_to_async
    def alter_employee_status(self, online=True):
        if not getattr(self, "employee", None):
            return
        if not online:
            self.employee.is_online = False
            self.employee.last_seen_online = timezone.now()
        else:
            self.employee.is_online = True
            self.employee.last_seen_online = None

        self.employee.save()
