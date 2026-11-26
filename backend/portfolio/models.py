import logging
from io import BytesIO
from pathlib import Path

from django.core.files.base import ContentFile
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)


def make_webp(source_file, max_width, max_kb, name):
    """
    Resize a photo and save it as WebP.
    The quality (and if needed the size) is lowered step by step
    until the file is smaller than max_kb kilobytes.
    """
    source_file.seek(0)
    img = Image.open(source_file)
    img = ImageOps.exif_transpose(img)  # keeps phone photos the right way up
    img = img.convert("RGB")

    if img.width > max_width:
        new_height = round(img.height * max_width / img.width)
        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

    limit = max_kb * 1024
    buffer = BytesIO()

    while True:
        for quality in range(85, 49, -5):
            buffer = BytesIO()
            img.save(buffer, format="WEBP", quality=quality, method=6)
            if buffer.tell() <= limit:
                return ContentFile(buffer.getvalue(), name=name)

        # Still too big at the lowest quality: make the photo a bit smaller
        if img.width <= 700:
            break

        img = img.resize(
            (round(img.width * 0.9), round(img.height * 0.9)),
            Image.Resampling.LANCZOS,
        )

    return ContentFile(buffer.getvalue(), name=name)


class PortfolioPhoto(models.Model):
    CATEGORY_CHOICES = [
        ("WEDDINGS", "Weddings"),
        ("PORTRAITS", "Portraits"),
        ("GRADUATION", "Graduation"),
        ("BIRTHDAYS", "Birthdays"),
        ("COUPLES", "Couples"),
        ("OUTDOOR", "Outdoor"),
        ("STUDIO", "Studio"),
    ]

    title = models.CharField(max_length=120)
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default="PORTRAITS"
    )
    image = models.ImageField(
        upload_to="portfolio/",
        help_text=(
            "Upload any photo. It is automatically resized and converted "
            "into a small, fast-loading file."
        ),
    )
    thumbnail = models.ImageField(
        upload_to="portfolio/thumbs/", blank=True, editable=False
    )
    # Size of the compressed photo, saved at upload time so the admin list
    # does not have to ask the storage service for it on every page load.
    file_size_kb = models.PositiveIntegerField(default=0, editable=False)
    show_in_hero = models.BooleanField(
        default=False,
        help_text="Tick to also show this photo in the big slideshow at the top.",
    )
    is_published = models.BooleanField(
        default=True, help_text="Untick to hide it from the website."
    )
    order = models.PositiveIntegerField(
        default=0, help_text="Smaller numbers appear first. Leave 0 for newest first."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = "Portfolio photo"
        verbose_name_plural = "Portfolio photos"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        uploaded = self.image

        # Only compress when a NEW picture has just been uploaded
        if uploaded and not uploaded._committed:
            base = Path(uploaded.name).stem
            source = uploaded.file

            big = make_webp(source, 1920, 350, f"{base}.webp")
            small = make_webp(source, 800, 90, f"{base}-thumb.webp")

            self.file_size_kb = round(big.size / 1024)
            self.image.save(f"{base}.webp", big, save=False)
            self.thumbnail.save(f"{base}-thumb.webp", small, save=False)

        super().save(*args, **kwargs)


@receiver(post_delete, sender=PortfolioPhoto)
def remove_photo_files(sender, instance, **kwargs):
    """When a photo is deleted in the admin, delete its files from storage too."""
    for field in (instance.image, instance.thumbnail):
        if field and field.name:
            try:
                field.delete(save=False)
            except Exception:  # never block a delete because storage is unreachable
                logger.warning("Could not remove %s from storage", field.name)