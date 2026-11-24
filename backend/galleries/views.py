
import io
import zipfile
from pathlib import Path

from django.conf import settings
from django.core.mail import send_mail
from django.http import FileResponse
from django.urls import reverse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import Gallery, GalleryLoginToken, GalleryDownloadToken
from .serializers import GallerySerializer


class GalleryAccessView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        access_token = request.data.get("access_token", "").strip()

        if not email or not access_token:
            return Response(
                {"error": "Email and gallery access code are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        gallery = Gallery.objects.filter(
            client_email__iexact=email,
            access_token=access_token,
            is_published=True
        ).prefetch_related("photos").first()

        if not gallery:
            return Response(
                {"error": "Gallery not found or access details are incorrect."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GallerySerializer(
            gallery,
            context={"request": request}
        )

        return Response(serializer.data)


class GalleryLoginRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {"message": "Please enter your email address."},
                status=status.HTTP_400_BAD_REQUEST
            )

        galleries = Gallery.objects.filter(
            client_email__iexact=email
        )

        if not galleries.exists():
            return Response(
                {
                    "found": False,
                    "message": "No gallery was found for this email address."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        published_galleries = galleries.filter(is_published=True)

        if not published_galleries.exists():
            return Response(
                {
                    "found": True,
                    "ready": False,
                    "message": "Your photographs are not ready yet."
                },
                status=status.HTTP_200_OK
            )

        # Remove previous download links for this email.
        GalleryDownloadToken.objects.filter(
            email__iexact=email
        ).delete()

        # Create a new download token. It expires after 24 hours.
        download_token = GalleryDownloadToken.objects.create(
            email=email
        )

        download_path = reverse(
            "gallery-download",
            kwargs={"token": download_token.token}
        )

        download_link = request.build_absolute_uri(download_path)

        subject = "Your Orebz Studio photographs are ready!"

        message = f"""
Hello,

Your photographs from Orebz Studio are ready!

Click the link below to download all your photographs together
as one ZIP file:

{download_link}

This download link expires in 24 hours.

Thank you for choosing Orebz Studio.

Best regards,
Orebz Studio
"""

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

        except Exception:
            download_token.delete()

            return Response(
                {
                    "message": "We could not send your download email. Please try again."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {
                "found": True,
                "ready": True,
                "message": "Your download link has been sent to your email address. Please check your inbox."
            },
            status=status.HTTP_200_OK
        )


class GalleryVerifyLoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token", "")

        if not token:
            return Response(
                {"message": "Login token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        login_token = GalleryLoginToken.objects.filter(
            token=token,
            is_used=False
        ).first()

        if not login_token or not login_token.is_valid():
            return Response(
                {"message": "Your login link is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        galleries = Gallery.objects.filter(
            client_email__iexact=login_token.email,
            is_published=True
        ).prefetch_related("photos")

        if not galleries.exists():
            return Response(
                {"message": "No published galleries were found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GallerySerializer(
            galleries,
            many=True,
            context={"request": request}
        )

        login_token.is_used = True
        login_token.save(update_fields=["is_used"])

        return Response(
            {
                "email": login_token.email,
                "galleries": serializer.data
            },
            status=status.HTTP_200_OK
        )


class GalleryDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        download_token = GalleryDownloadToken.objects.filter(
            token=token
        ).first()

        if not download_token or not download_token.is_valid():
            return Response(
                {
                    "message": "This download link is invalid or has expired. Please request a new one."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        galleries = Gallery.objects.filter(
            client_email__iexact=download_token.email,
            is_published=True
        ).prefetch_related("photos")

        if not galleries.exists():
            return Response(
                {"message": "No published photographs were found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create the ZIP file in memory.
        zip_buffer = io.BytesIO()
        photo_count = 0

        with zipfile.ZipFile(
            zip_buffer,
            mode="w",
            compression=zipfile.ZIP_DEFLATED
        ) as zip_file:

            for gallery in galleries:
                for photo in gallery.photos.all():

                    if not photo.image:
                        continue

                    try:
                        photo.image.open("rb")
                        image_data = photo.image.read()
                        photo.image.close()

                        original_name = Path(photo.image.name).name

                        # Keep photographs organized by gallery.
                        folder_name = (
                            f"{gallery.pk}_{gallery.title}"
                        )

                        zip_filename = (
                            f"{folder_name}/{photo.pk}_{original_name}"
                        )

                        zip_file.writestr(
                            zip_filename,
                            image_data
                        )

                        photo_count += 1

                    except (OSError, ValueError):
                        continue

        if photo_count == 0:
            return Response(
                {"message": "There are no downloadable photographs in your gallery."},
                status=status.HTTP_404_NOT_FOUND
            )

        zip_buffer.seek(0)

        response = FileResponse(
            zip_buffer,
            as_attachment=True,
            filename="Orebz_Studio_Photos.zip",
            content_type="application/zip"
        )

        return response
