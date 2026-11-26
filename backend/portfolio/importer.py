from pathlib import Path

from django.core.files import File

from .models import PortfolioPhoto

# How many photos one click imports. Small on purpose: a free Render server
# is slow and gives up on requests that take too long.
BATCH_SIZE = 3

# (file name without extension, title, category, show in the big slideshow)
# The order here is the order the photos appear on the website.
EXISTING_PHOTOS = [
    ("orebz-wedding-01", "Wedding Photography", "WEDDINGS", True),
    ("portrait-01", "Portrait Photography", "PORTRAITS", True),
    ("graduation-01", "Graduation Moments", "GRADUATION", True),
    ("birthday-01", "Birthday Celebrations", "BIRTHDAYS", False),
    ("couple-01", "Couple Photography", "COUPLES", True),
    ("outdoor-01", "Outdoor Photography", "OUTDOOR", True),
    ("studio-01", "Studio Photography", "STUDIO", False),
    ("portrait-04", "Creative Portraits", "PORTRAITS", False),
    ("wedding-02", "Wedding Moments", "WEDDINGS", False),
    ("portrait-02", "Portrait Session", "PORTRAITS", True),
    ("studio-02", "Studio Session", "STUDIO", False),
]


def _find_source(folder, base):
    for extension in (".webp", ".jpg", ".jpeg", ".png"):
        candidate = folder / f"{base}{extension}"
        if candidate.exists():
            return candidate
    return None


def import_existing_photos(folder, limit=BATCH_SIZE):
    """
    Copies the photos that were already on the website into the admin.
    Safe to run again: photos that are already there are skipped.
    """
    folder = Path(folder)
    result = {"added": 0, "skipped": 0, "remaining": 0, "missing": []}

    for position, (base, title, category, hero) in enumerate(
        EXISTING_PHOTOS, start=1
    ):
        if PortfolioPhoto.objects.filter(title=title).exists():
            result["skipped"] += 1
            continue

        source = _find_source(folder, base)
        if source is None:
            result["missing"].append(base)
            continue

        if result["added"] >= limit:
            result["remaining"] += 1
            continue

        photo = PortfolioPhoto(
            title=title,
            category=category,
            show_in_hero=hero,
            order=position,
        )
        with source.open("rb") as handle:
            photo.image = File(handle, name=source.name)
            photo.save()  # compresses the photo and stores it
        result["added"] += 1

    return result