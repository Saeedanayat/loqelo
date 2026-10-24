# Loqelo — Pre-launch Waitlist Website

A responsive pre-launch landing page built from the supplied Loqelo brief, logo and UI assets. The project uses separate, maintainable files rather than placing the entire application in one file.

## Technology

- Python 3.11+
- Django 5.x
- SQLite for local development (can be changed for production)
- HTML templates, CSS and vanilla JavaScript
- Django Admin for searching, filtering and exporting waitlist records to CSV
- Optional Google Analytics 4, loaded only after a visitor accepts analytics cookies

## Included features

- Landing page with Loqelo branding, workflow, supplied product screenshots, customer/provider sections, FAQs and embedded promotional video\n- Scroll-triggered reveal transitions, subtle hero motion and hover interactions with reduced-motion support
- Separate customer and service-provider waitlists
- Required email, country and explicit launch-update consent; optional individual/business selection
- Server-side validation, CSRF protection, honeypot field and duplicate-email handling per waitlist type
- Custom dark charcoal + teal Django overview dashboard with signup metrics, seven-day activity, top countries and recent signups\n- Django Admin with filters, search and CSV export action
- Responsive navigation, language selector starter (English, Polish and Spanish navigation labels), and analytics consent banner
- Health-check endpoint at `/health/`

## Run on Windows

1. Extract this ZIP file.
2. Open CMD/PowerShell in the extracted `loqelo_website` folder.
3. Create a virtual environment:
   ```bat
   py -m venv .venv
   .venv\Scripts\activate
   ```
4. Install dependencies:
   ```bat
   pip install -r requirements.txt
   ```
5. Copy `.env.example` to `.env` and set a long, private `DJANGO_SECRET_KEY`. For local testing, `DJANGO_DEBUG=True` is fine.
6. Create database tables:
   ```bat
   python manage.py migrate
   ```
7. Create the admin login:
   ```bat
   python manage.py createsuperuser
   ```
8. Start the local server:
   ```bat
   python manage.py runserver
   ```
9. Open `http://127.0.0.1:8000/`. Manage signups at `http://127.0.0.1:8000/admin/`.

## Manage signups

In Django Admin, open **Signups**. Use the filters to separate customers and service providers. Select records and choose **Export selected signups to CSV** from the actions menu.

## Before production launch

- Deploy to the client's hosting and configure the provided domain and HTTPS.
- Set a secure production `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, and the correct `DJANGO_ALLOWED_HOSTS`.
- Configure production-grade database backups and server logging. SQLite is suitable for a small demo; consider PostgreSQL for production.
- Configure a real privacy policy and consent wording reviewed for the countries being targeted.
- Confirm the supplied promotional video placement and test playback on desktop and mobile. The video is bundled at `static/videos/loqelo-promo.mp4`.
- If analytics is required, add the client's GA4 ID as `GA4_MEASUREMENT_ID` in `.env` and test consent behaviour. Do not put email addresses or form contents into analytics events.
- The honeypot is a basic spam deterrent, not a substitute for rate limiting or a CAPTCHA service. Add production spam controls and test the forms before public launch.
- The language selector is a starter: it changes navigation labels only, not the entire page. Full translations should be supplied/approved before launch.
- Configure email marketing/confirmation integration if the client expects automatic email delivery; this build stores registrations in Django, but does not send emails automatically.

## Project structure

```text
loqelo_website/
├── loqelo/                 # Django project configuration and URLs
├── waitlist/               # Signup model, form, views and admin
├── templates/              # HTML templates
├── static/
│   ├── css/                # Stylesheets
│   ├── js/                 # Frontend interactions
│   ├── fonts/              # Client-supplied fonts
│   └── images/             # Client-supplied logos, photos and screenshots
├── manage.py
├── requirements.txt
└── .env.example
```
