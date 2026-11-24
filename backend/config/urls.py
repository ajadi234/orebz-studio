from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Orebz Studio Admin Branding
admin.site.site_header = "OREBZ STUDIO"
admin.site.site_title = "Orebz Studio Management"
admin.site.index_title = "Welcome to Orebz Studio"
admin.site.site_url = "http://localhost:5173/"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/bookings/', include('bookings.urls')),
    path('api/galleries/', include('galleries.urls')),
    path('api/portfolio/', include('portfolio.urls')),
]

# Serve uploaded photos (media folder) while developing
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )