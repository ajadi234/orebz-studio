
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
    """Resize and compress an image into WebP format."""
    source_file.seek(0)

    with Image.open(source_file) as original:
        img = ImageOps.exif_transpose(original)
        img = img.convert("RGB")

        # Resize before compression to reduce memory and processing time.
        img.thumbnail(
            (max_width, max_width),
            Image.Resampling.LANCZOS,
        )

        quality = 78

        while True:
            buffer = BytesIO()
            img.save(
                buffer,
                format="WEBP",
                quality=quality,
                method=3,
            )

            if buffer.tell() <= max_kb * 1024:
                break

            if quality > 55:
                quality -= 8
            elif img.width > 600:
                new_size = (
                    max(600, round(img.width * 0.85)),
                    max(600, round(img.height * 0.85)),
                )
                img.thumbnail(new_size, Image.Resampling.LANCZOS)
                quality = 70
            else:
                break

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
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="PORTRAITS",
    )
    image = models.ImageField(
        upload_to="portfolio/",
        help_text=(
            "Upload any photo. It is automatically resized and converted "
            "into a small, fast-loading file."
        ),
    )
    thumbnail = models.ImageField(
        upload_to="portfolio/thumbs/",
        blank=True,
        editable=False,
    )
    file_size_kb = models.PositiveIntegerField(
        default=0,
        editable=False,
    )
    show_in_hero = models.BooleanField(
        default=False,
        help_text="Tick to also show this photo in the big slideshow at the top.",
    )
    is_published = models.BooleanField(
        default=True,
        help_text="Untick to hide it from the website.",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Smaller numbers appear first. Leave 0 for newest first.",
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

        if uploaded and not uploaded._committed:
            base = Path(uploaded.name).stem
            source = uploaded.file

            big = make_webp(
                source,
                max_width=1600,
                max_kb=300,
                name=f"{base}.webp",
            )
            small = make_webp(
                source,
                max_width=600,
                max_kb=75,
                name=f"{base}-thumb.webp",
            )

            self.file_size_kb = round(big.size / 1024)

            self.image.save(
                f"{base}.webp",
                big,
                save=False,
            )
            self.thumbnail.save(
                f"{base}-thumb.webp",
                small,
                save=False,
            )

        super().save(*args, **kwargs)


@receiver(post_delete, sender=PortfolioPhoto)
def remove_photo_files(sender, instance, **kwargs):
    """Delete stored image files when a portfolio photo is deleted."""
    for field in (instance.image, instance.thumbnail):
        if field and field.name:
            try:
                field.delete(save=False)
            except Exception:
                logger.warning(
                    "Could not remove %s from storage",
                    field.name,
                )
