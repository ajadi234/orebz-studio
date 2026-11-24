from django.contrib import admin
from django.utils.html import format_html

from .models import PortfolioPhoto


@admin.register(PortfolioPhoto)
class PortfolioPhotoAdmin(admin.ModelAdmin):
    list_display = (
        "preview",
        "title",
        "category",
        "show_in_hero",
        "is_published",
        "order",
        "size_kb",
    )
    list_display_links = ("preview", "title")
    list_editable = ("category", "show_in_hero", "is_published", "order")
    list_filter = ("category", "show_in_hero", "is_published")
    search_fields = ("title",)
    ordering = ("order", "-created_at")
    list_per_page = 20

    fields = (
        "title",
        "category",
        "image",
        "show_in_hero",
        "is_published",
        "order",
        "preview",
        "size_kb",
    )
    readonly_fields = ("preview", "size_kb")

    @admin.display(description="Preview")
    def preview(self, obj):
        source = obj.thumbnail or obj.image
        if source:
            return format_html(
                '<img src="{}" style="width:80px;height:60px;'
                'object-fit:cover;border-radius:8px;" alt="">',
                source.url,
            )
        return "-"

    @admin.display(description="Size")
    def size_kb(self, obj):
        if obj.image:
            try:
                return f"{obj.image.size / 1024:.0f} KB"
            except (FileNotFoundError, ValueError):
                return "-"
        return "-"