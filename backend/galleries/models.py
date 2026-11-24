
import uuid
from datetime import timedelta

from django.db import models
from django.utils import timezone


# ==========================================
# TOKEN EXPIRY FUNCTIONS
# ==========================================

def login_token_expiry():
    return timezone.now() + timedelta(minutes=30)


def gallery_download_expiry():
    return timezone.now() + timedelta(hours=24)


# ==========================================
# CLIENT GALLERY
# ==========================================

class Gallery(models.Model):
    client_name = models.CharField(max_length=150)
    client_email = models.EmailField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    access_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.client_name}"


# ==========================================
# GALLERY PHOTOS
# ==========================================

class Photo(models.Model):
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name="photos"
    )

    image = models.ImageField(upload_to="gallery_photos/")
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"Photo for {self.gallery.client_name}"


# ==========================================
# PRIVATE GALLERY LOGIN TOKEN
# ==========================================

class GalleryLoginToken(models.Model):
    email = models.EmailField()

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    created_at = models.DateTimeField(auto_now_add=True)

    expires_at = models.DateTimeField(
        default=login_token_expiry
    )

    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Gallery login for {self.email}"


# ==========================================
# PRIVATE GALLERY DOWNLOAD TOKEN
# ==========================================

class GalleryDownloadToken(models.Model):
    email = models.EmailField()

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    created_at = models.DateTimeField(auto_now_add=True)

    expires_at = models.DateTimeField(
        default=gallery_download_expiry
    )

    def is_valid(self):
        return timezone.now() < self.expires_at

    def __str__(self):
        return f"Gallery download for {self.email}"
