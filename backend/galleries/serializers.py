
from rest_framework import serializers
from .models import Gallery, Photo


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = [
            "id",
            "image",
            "caption",
            "uploaded_at",
        ]


class GallerySerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = [
            "id",
            "client_name",
            "client_email",
            "title",
            "description",
            "access_token",
            "photos",
            "delivered_at",
        ]

        