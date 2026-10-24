from django import forms
from .models import Signup


class SignupForm(forms.ModelForm):
    """Validated waitlist form with a simple honeypot spam field."""

    website = forms.CharField(required=False, widget=forms.TextInput(attrs={
        "tabindex": "-1",
        "autocomplete": "off",
        "aria-hidden": "true",
    }))

    class Meta:
        model = Signup
        fields = ("email", "country", "group", "account_type", "marketing_consent")
        widgets = {
            "email": forms.EmailInput(attrs={"autocomplete": "email"}),
            "country": forms.TextInput(attrs={"autocomplete": "country-name", "maxlength": 100}),
            "group": forms.HiddenInput(),
            "account_type": forms.Select(),
            "marketing_consent": forms.CheckboxInput(),
        }

    def clean_website(self):
        if self.cleaned_data.get("website"):
            raise forms.ValidationError("Invalid submission.")
        return ""

    def clean_group(self):
        group = self.cleaned_data["group"]
        if group not in {Signup.CUSTOMER, Signup.CONTRACTOR}:
            raise forms.ValidationError("Choose a valid waitlist.")
        return group

    def clean_marketing_consent(self):
        consent = self.cleaned_data.get("marketing_consent", False)
        if not consent:
            raise forms.ValidationError("Please consent to receive launch updates to join the waitlist.")
        return consent
