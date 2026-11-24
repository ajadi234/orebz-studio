from rest_framework import serializers

from .models import PortfolioPhoto


class PortfolioPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioPhoto
        fields = [
            "id",
            "title",
            "category",
            "image",
            "thumbnail",
            "show_in_hero",
            "order",
        ]