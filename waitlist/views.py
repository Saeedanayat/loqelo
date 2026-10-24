from datetime import timedelta

from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.utils.html import strip_tags
from django.views.decorators.http import require_GET, require_POST

from .forms import SignupForm


def home(request):
    return render(request, "home.html", {
        "ga4_measurement_id": settings.GA4_MEASUREMENT_ID,
    })


@require_POST
def join_waitlist(request):
    form = SignupForm(request.POST)
    if not form.is_valid():
        errors = {
            field: [str(error) for error in field_errors]
            for field, field_errors in form.errors.items()
            if field != "website"
        }
        return JsonResponse({
            "ok": False,
            "errors": errors,
            "message": "Please check the details and try again.",
        }, status=400)

    signup = form.save(commit=False)
    signup.source = strip_tags(request.POST.get("source", ""))[:120]
    try:
        with transaction.atomic():
            signup.save()
    except IntegrityError:
        return JsonResponse({
            "ok": False,
            "errors": {"email": ["This email is already on this waitlist."]},
            "message": "This email is already on this waitlist.",
        }, status=409)

    return JsonResponse({
        "ok": True,
        "message": "You're on the list. We'll share Loqelo launch updates with you.",
        "group": signup.group,
    }, status=201)


@require_GET
def health(request):
    return JsonResponse({"status": "ok"})


@staff_member_required
@require_GET
def admin_dashboard(request):
    """Custom Loqelo overview. Uses existing Signup records; does not alter the database."""
    from .models import Signup

    today = timezone.localdate()
    start_date = today - timedelta(days=6)
    signups = Signup.objects.all()
    total = signups.count()
    customers = signups.filter(group=Signup.CUSTOMER).count()
    providers = signups.filter(group=Signup.CONTRACTOR).count()
    consented = signups.filter(marketing_consent=True).count()
    consent_rate = round((consented / total) * 100) if total else 0

    daily_rows = (
        signups.filter(created_at__date__gte=start_date, created_at__date__lte=today)
        .values("created_at__date").annotate(count=Count("id"))
    )
    daily_map = {row["created_at__date"]: row["count"] for row in daily_rows}
    daily_counts = [
        {"label": (start_date + timedelta(days=i)).strftime("%a"),
         "date": (start_date + timedelta(days=i)).strftime("%b %d"),
         "count": daily_map.get(start_date + timedelta(days=i), 0)}
        for i in range(7)
    ]
    max_daily = max([day["count"] for day in daily_counts] or [0]) or 1
    for day in daily_counts:
        day["height"] = max(8, round(day["count"] / max_daily * 100)) if day["count"] else 4

    countries = (
        signups.exclude(country="").values("country").annotate(count=Count("id"))
        .order_by("-count", "country")[:5]
    )
    recent = signups.order_by("-created_at")[:8]
    return render(request, "admin/loqelo_dashboard.html", {
        "total": total, "customers": customers, "providers": providers,
        "consent_rate": consent_rate, "daily_counts": daily_counts,
        "top_countries": countries, "recent_signups": recent,
    })
