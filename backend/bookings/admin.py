from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "full_name",
        "email",
        "phone",
        "service",
        "preferred_date",
        "status",
        "created_at",
    )

    list_filter = (
        "service",
        "status",
        "preferred_date",
    )

    search_fields = (
        "full_name",
        "email",
        "phone",
    )

    ordering = ("-created_at",)

