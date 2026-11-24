
from django.contrib import admin
from .models import Gallery, Photo


class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):

    list_display = (
        "client_name",
        "client_email",
        "title",
        "is_published",
        "created_at",
    )

    list_filter = (
        "is_published",
        "created_at",
    )

    search_fields = (
        "client_name",
        "client_email",
        "title",
    )

    readonly_fields = (
        "access_token",
        "created_at",
    )

    inlines = [PhotoInline]



