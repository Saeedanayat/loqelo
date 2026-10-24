from django.db import models

class Signup(models.Model):
    CUSTOMER = "customer"
    CONTRACTOR = "contractor"
    GROUP_CHOICES = [
        (CUSTOMER, "Customer"),
        (CONTRACTOR, "Service provider"),
    ]
    INDIVIDUAL = "individual"
    BUSINESS = "business"
    TYPE_CHOICES = [
        ("", "Not specified"),
        (INDIVIDUAL, "Individual"),
        (BUSINESS, "Business"),
    ]

    email = models.EmailField(max_length=254)
    country = models.CharField(max_length=100)
    group = models.CharField(max_length=20, choices=GROUP_CHOICES)
    account_type = models.CharField(max_length=20, choices=TYPE_CHOICES, blank=True)
    marketing_consent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["email", "group"], name="unique_email_per_signup_group")
        ]

    def __str__(self):
        return f"{self.email} — {self.get_group_display()}"
