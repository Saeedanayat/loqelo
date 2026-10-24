(() => {
  
  "use strict";

  const config = window.LOQELO_CONFIG || {};
  const form = document.querySelector("#waitlist-form");
  const formMessage = document.querySelector("#form-message");
  const submitButton = document.querySelector(".submit-button");
  const successState = document.querySelector("#success-state");
  const signupGroup = document.querySelector("#signup-group");
  const formTitle = document.querySelector("#form-title");
  const formDescription = document.querySelector("#form-description");
  const submitLabel = document.querySelector(".submit-label");
  const tabs = [...document.querySelectorAll(".form-tab")];
  const menuToggle = document.querySelector(".menu-toggle");
  const mobilePanel = document.querySelector(".mobile-panel");
  const languageToggle = document.querySelector(".language-toggle");
  const languageMenu = document.querySelector(".language-menu");
  const cookieBanner = document.querySelector("#cookie-banner");
  const acceptCookies = document.querySelector("#accept-cookies");
  const rejectCookies = document.querySelector("#reject-cookies");
  const analyticsId = config.ga4MeasurementId;

  // Reveal elements as they enter the viewport; keep everything visible if unsupported.
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }


  const groupCopy = {
    customer: {
      title: "Get on the customer list",
      description: "Be first to know when Loqelo launches.",
      button: "Join the waitlist"
    },
    contractor: {
      title: "Get on the provider list",
      description: "Be ready when new opportunities arrive.",
      button: "Join as a provider"
    }
  };

  const translations = {
    en: { how: "How it works", platform: "The platform", faq: "FAQs", join: "Join the waitlist", early: "Get early access" },
    pl: { how: "Jak to działa", platform: "Platforma", faq: "Pytania", join: "Dołącz do listy", early: "Uzyskaj wcześniejszy dostęp" },
    es: { how: "Cómo funciona", platform: "La plataforma", faq: "Preguntas", join: "Únete a la lista", early: "Acceso anticipado" }
  };

  function setGroup(group) {
    if (!groupCopy[group]) return;
    signupGroup.value = group;
    tabs.forEach((tab) => {
      const active = tab.dataset.group === group;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    formTitle.textContent = groupCopy[group].title;
    formDescription.textContent = groupCopy[group].description;
    submitLabel.textContent = groupCopy[group].button;
    formMessage.textContent = "";
  }

  tabs.forEach((tab) => tab.addEventListener("click", () => setGroup(tab.dataset.group)));
  document.querySelectorAll("[data-open-group]").forEach((link) => {
    link.addEventListener("click", () => setGroup(link.dataset.openGroup));
  });

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobilePanel.hidden = !open;
    });
    mobilePanel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      mobilePanel.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }));
  }

  function setLanguage(language) {
    const dictionary = translations[language] || translations.en;
    document.documentElement.lang = language;
    document.querySelector(".language-label").textContent = language.toUpperCase();
    document.querySelectorAll(".desktop-nav a, .mobile-panel a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === "#how-it-works") link.textContent = dictionary.how;
      if (href === "#platform") link.textContent = dictionary.platform;
      if (href === "#faq") link.textContent = dictionary.faq;
      if (href === "#waitlist") link.textContent = dictionary.join + " ↗";
    });
    document.querySelectorAll(".nav-cta").forEach((link) => link.innerHTML = `${dictionary.join} <span aria-hidden="true">↗</span>`);
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
    try { localStorage.setItem("loqelo-language", language); } catch (_) {}
  }

  languageToggle.addEventListener("click", () => {
    const open = languageToggle.getAttribute("aria-expanded") !== "true";
    languageToggle.setAttribute("aria-expanded", String(open));
    languageMenu.hidden = !open;
  });
  languageMenu.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  document.addEventListener("click", (event) => {
    if (!languageMenu.contains(event.target) && !languageToggle.contains(event.target)) {
      languageMenu.hidden = true;
      languageToggle.setAttribute("aria-expanded", "false");
    }
  });

  function getCookie(name) {
    const prefix = `${name}=`;
    return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length) || "";
  }

  function loadAnalytics() {
    if (!analyticsId || !/^G-[A-Z0-9]+$/i.test(analyticsId)) return;
    if (window.gtag) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { anonymize_ip: true });
  }

  function trackEvent(name, parameters = {}) {
    if (window.gtag) window.gtag("event", name, parameters);
  }

  let consent = "";
  try { consent = localStorage.getItem("loqelo-analytics-consent") || ""; } catch (_) {}
  if (consent === "accepted") loadAnalytics();
  if (!consent) cookieBanner.hidden = false;

  acceptCookies.addEventListener("click", () => {
    try { localStorage.setItem("loqelo-analytics-consent", "accepted"); } catch (_) {}
    cookieBanner.hidden = true;
    loadAnalytics();
  });
  rejectCookies.addEventListener("click", () => {
    try { localStorage.setItem("loqelo-analytics-consent", "rejected"); } catch (_) {}
    cookieBanner.hidden = true;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formMessage.textContent = "";
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => field.removeAttribute("aria-invalid"));

    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (!data.get("marketing_consent")) {
      formMessage.textContent = "Please agree to receive launch updates to join the waitlist.";
      document.querySelector("#consent").focus();
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Joining…";

    try {
      const response = await fetch(config.joinUrl || "/join/", {
        method: "POST",
        body: data,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "same-origin"
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (result.errors) {
          const firstField = Object.keys(result.errors).find((key) => key !== "__all__");
          if (firstField && form.elements[firstField]) {
            form.elements[firstField].setAttribute("aria-invalid", "true");
            form.elements[firstField].focus();
          }
          const allErrors = Object.values(result.errors).flat();
          formMessage.textContent = allErrors.some((error) => error.toLowerCase().includes("already")) ?
            "This email may already be registered for this list. Please check your inbox or try another address." :
            (allErrors[0] || result.message || "Please check your details and try again.");
        } else {
          formMessage.textContent = result.message || "Something went wrong. Please try again.";
        }
        trackEvent("waitlist_form_error", { signup_group: signupGroup.value });
        return;
      }

      form.hidden = true;
      document.querySelector(".form-tabs").hidden = true;
      document.querySelector(".form-intro").hidden = true;
      successState.hidden = false;
      trackEvent("waitlist_signup", { signup_group: result.group });
    } catch (_) {
      formMessage.textContent = "We couldn't connect just now. Please check your connection and try again.";
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = groupCopy[signupGroup.value].button;
    }
  });

  document.querySelector("#another-signup").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    successState.hidden = true;
    document.querySelector(".form-tabs").hidden = false;
    document.querySelector(".form-intro").hidden = false;
    setGroup("customer");
    document.querySelector("#email").focus();
  });

  document.querySelectorAll("a[href='#waitlist']").forEach((link) => {
    link.addEventListener("click", () => trackEvent("waitlist_cta_click", { cta_text: link.textContent.trim().slice(0, 40) }));
  });

  try {
    const savedLanguage = localStorage.getItem("loqelo-language");
    if (savedLanguage && translations[savedLanguage]) setLanguage(savedLanguage);
    else {
      const browserLanguage = (navigator.language || "en").slice(0, 2).toLowerCase();
      if (translations[browserLanguage]) setLanguage(browserLanguage);
    }
  } catch (_) {}
})();
document.querySelectorAll(".promo-video-wrap").forEach((wrap) => {
    const video = wrap.querySelector(".promo-video");
    const button = wrap.querySelector(".video-play-overlay");

    if (!video || !button) return;

    button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
console.log("LOQELO VIDEO SCRIPT LOADED");

        try {
            await video.play();
        } catch (error) {
            console.error("Video play error:", error);
        }
    });

    video.addEventListener("playing", () => {
        wrap.classList.add("has-played");
    });
});