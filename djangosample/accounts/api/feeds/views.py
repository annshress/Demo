from actstream.models import Action
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from accounts.api.feeds.serializers import FeedCommentModelSerializer, FeedSerializer
from accounts.api.permissions import IsOwnerOrReadOnly
from accounts.api.serializers import UserPublicSerializer
from accounts.models import Company
from crm.models.feeds import CustomFeed, FeedComment
from company.api.permissions import CompanyUserPermission
from libs.feeds import CustomAbstractActivityStream
from libs.mixins import CompanyViewSetQuerysetMixin, CompanyPermissionCheckMixin, SetCompanySerializerMixin


class FeedAPIViewSet(mixins.UpdateModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated, CompanyUserPermission]
    serializer_class = FeedSerializer

    def get_queryset(self):
        return Action.objects.filter(target_object_id=self.request.parser_context["kwargs"]["company"],
                                     actor_object_id=self.request.user.id)

    def get_company(self):
        return Company.objects.get(id=self.request.parser_context["kwargs"]["company"])

    @action(methods=["POST"], detail=True)
    def love(self, request, company, pk, *args, **kwargs):
        try:
            feed = Action.objects.get(pk=pk)
            feed = feed.extra
        except Action.DoesNotExist:
            return Response("Feed does not exist.", status=400)
        except CustomFeed.DoesNotExist:
        #############
        # TRUNCATED #
        #############
        
    def create(self, request, *args, **kwargs):
        verb = request.data["verb"]
        category = request.data["category"]
        company = Company.objects.get(id=kwargs["company"])
        created = CustomFeed.create_feed(actor=request.user, verb=verb, category=category, company=company)
        if created:
            return Response(CustomAbstractActivityStream().format(created, request), status=201)
        else:
            return Response("Error! Please report the issue.", status=400)

    def update(self, request, *args, **kwargs):
        action = self.get_object()
        action.verb = request.data["verb"]
        action.save(update_fields=["verb"])
        return Response(self.get_serializer(action, context=dict(request=request)).data, status=200)


class FeedCommentAPIViewSet(CompanyPermissionCheckMixin,
                            SetCompanySerializerMixin,
                            CompanyViewSetQuerysetMixin,
                            ModelViewSet):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = FeedCommentModelSerializer
    queryset = FeedComment.objects.all()
        
        #############
        # TRUNCATED #
        #############

    @action(methods=["GET"], detail=True)
    def lovers(self, request, company, pk, *args, **kwargs):
        try:
            feed_comment = FeedComment.objects.get(company=company, pk=pk)
        except FeedComment.DoesNotExist:
            return Response("Comment does not exist.", status=400)
        return Response(UserPublicSerializer(feed_comment.loved_by,
                                             many=True,
                                             context=dict(request=request)).data, status=200)

    def get_queryset(self):
        action_id = self.request.query_params.get("action", 0)
        if action_id:
            return super(FeedCommentAPIViewSet, self).get_queryset().filter(
                action_id=action_id
            ).order_by("-created_on")
        return super(FeedCommentAPIViewSet, self).get_queryset().order_by("-created_on")
