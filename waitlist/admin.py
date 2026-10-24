import csv
from django.contrib import admin
from django.http import HttpResponse
from .models import Signup

@admin.register(Signup)
class SignupAdmin(admin.ModelAdmin):
    list_display = ("email", "group", "country", "account_type", "marketing_consent", "created_at")
    list_filter = ("group", "country", "marketing_consent", "created_at")
    search_fields = ("email", "country")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    actions = ("export_selected_csv",)

    class Media:
        css = {"all": ("css/django-admin-theme.css",)}

    @admin.action(description="Export selected signups to CSV")
    def export_selected_csv(self, request, queryset):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="loqelo-signups.csv"'
        writer = csv.writer(response)
        writer.writerow(["Email", "Country", "Group", "Account type", "Marketing consent", "Created at"])
        for signup in queryset:
            writer.writerow([
                signup.email, signup.country, signup.get_group_display(),
                signup.get_account_type_display(), signup.marketing_consent, signup.created_at.isoformat()
            ])
        return response


admin.site.site_header = "Loqelo Control Center"
admin.site.site_title = "Loqelo Admin"
admin.site.index_title = "Waitlist management"
