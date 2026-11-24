from django.urls import path

from .views import PortfolioPhotoListView

urlpatterns = [
    path("", PortfolioPhotoListView.as_view(), name="portfolio-list"),
]