from django.db import models

# Create your models here.

from django.db import models


class Booking(models.Model):

    SERVICE_CHOICES = [
        ("Wedding", "Wedding Photography"),
        ("Portrait", "Portrait Photography"),
        ("Outdoor", "Outdoor Photography"),
        ("Birthday", "Birthday Photography"),
        ("Other", "Other Photography"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Confirmed", "Confirmed"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    service = models.CharField(
        max_length=30,
        choices=SERVICE_CHOICES
    )

    preferred_date = models.DateField()
    location = models.CharField(max_length=200)

    message = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.service}"

