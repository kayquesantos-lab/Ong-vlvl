from rest_framework.pagination import PageNumberPagination


class DefaultPagination(PageNumberPagination):
    """
    Paginacao padrao com page_size configuravel via querystring.
    Cliente pode pedir ate 200 itens por pagina (ex: dropdowns).
    """

    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200
