from rest_framework import pagination


class APIPagination(pagination.LimitOffsetPagination): #PageNumberPagination):
    default_limit   = 10
    max_limit       = 20


class APIPageNumberPagination(pagination.PageNumberPagination):
    page_size_query_param = 'page_size'
