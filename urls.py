from django.contrib import admin
from django.urls import path, re_path
from waitlist import views

urlpatterns = [
    # Exact admin root opens the custom overview; all built-in admin URLs remain available.
    re_path(r"^admin/$", views.admin_dashboard, name="admin_dashboard"),
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("join/", views.join_waitlist, name="join_waitlist"),
    path("health/", views.health, name="health"),
]
