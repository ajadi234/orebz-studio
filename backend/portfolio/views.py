from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import PortfolioPhoto
from .serializers import PortfolioPhotoSerializer


class PortfolioPhotoListView(generics.ListAPIView):
    """Public list of the photos shown on the main page."""

    queryset = PortfolioPhoto.objects.filter(is_published=True)
    serializer_class = PortfolioPhotoSerializer
    permission_classes = [AllowAny]
    pagination_class = None