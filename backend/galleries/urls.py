
from django.urls import path

from .views import (
    GalleryAccessView,
    GalleryLoginRequestView,
    GalleryVerifyLoginView,
    GalleryDownloadView,
)

urlpatterns = [
    path("access/", GalleryAccessView.as_view(), name="gallery-access"),

    path(
        "request-login/",
        GalleryLoginRequestView.as_view(),
        name="gallery-request-login"
    ),

    path(
        "verify-login/",
        GalleryVerifyLoginView.as_view(),
        name="gallery-verify-login"
    ),

    path(
        "download/<uuid:token>/",
        GalleryDownloadView.as_view(),
        name="gallery-download"
    ),
]
