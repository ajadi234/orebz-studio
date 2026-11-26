
from django.conf import settings
from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.urls import path
from django.utils.html import format_html

from .importer import BATCH_SIZE, import_existing_photos
from .models import PortfolioPhoto


@admin.register(PortfolioPhoto)
class PortfolioPhotoAdmin(admin.ModelAdmin):
    change_list_template = "admin/portfolio/portfoliophoto/change_list.html"

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

        if not source or not source.name:
            return "-"

        try:
            image_url = source.url
        except Exception:
            return "Image unavailable"

        return format_html(
            '<img src="{}" style="width:80px;height:60px;'
            'object-fit:cover;border-radius:8px;" alt="">',
            image_url,
        )

    @admin.display(description="Size")
    def size_kb(self, obj):
        if obj.file_size_kb:
            return f"{obj.file_size_kb} KB"
        return "-"

    def get_urls(self):
        custom_urls = [
            path(
                "import-existing/",
                self.admin_site.admin_view(self.import_existing_view),
                name="portfolio_portfoliophoto_import_existing",
            ),
        ]
        return custom_urls + super().get_urls()

    def import_existing_view(self, request):
        if not self.has_add_permission(request):
            raise PermissionDenied

        folder = settings.BASE_DIR / "seed_photos"
        result = import_existing_photos(folder, limit=BATCH_SIZE)

        if result["added"]:
            messages.success(
                request,
                f"Imported {result['added']} photo(s).",
            )

        if result["remaining"]:
            messages.info(
                request,
                f"{result['remaining']} more to go. "
                'Click "Import original website photos" again.',
            )
        elif not result["missing"] and (
            result["added"] or result["skipped"]
        ):
            messages.success(
                request,
                "All the original website photos are in the admin.",
            )

        if result["missing"]:
            messages.warning(
                request,
                "These files were not found in the backend/seed_photos "
                "folder: " + ", ".join(result["missing"]),
            )

        return redirect("admin:portfolio_portfoliophoto_changelist")
