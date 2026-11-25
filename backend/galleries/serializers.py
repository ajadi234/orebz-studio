
from rest_framework import serializers
from .models import Gallery, Photo


class PhotoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = [
            "id",
            "image",
            "caption",
            "uploaded_at",
        ]

    def get_image(self, obj):
        request = self.context.get("request")

        if not obj.image:
            return None

        image_url = obj.image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url


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
