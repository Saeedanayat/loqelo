# Generated for the Loqelo pre-launch waitlist.
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Signup",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("email", models.EmailField(max_length=254)),
                ("country", models.CharField(max_length=100)),
                ("group", models.CharField(choices=[("customer", "Customer"), ("contractor", "Service provider")], max_length=20)),
                ("account_type", models.CharField(blank=True, choices=[("", "Not specified"), ("individual", "Individual"), ("business", "Business")], max_length=20)),
                ("marketing_consent", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("source", models.CharField(blank=True, max_length=120)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.AddConstraint(
            model_name="signup",
            constraint=models.UniqueConstraint(fields=("email", "group"), name="unique_email_per_signup_group"),
        ),
    ]
