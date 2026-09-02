(() => {
  const config = window.TIDY_TECH_TRACKING || {};
  const gtmId = String(config.gtmId || "").trim().toUpperCase();
  const plausibleDomain = String(config.plausibleDomain || "").trim().toLowerCase();

  if (/^GTM-[A-Z0-9]+$/.test(gtmId)) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  }

  if (/^[a-z0-9.-]+$/.test(plausibleDomain)) {
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("[data-track]");
    if (!link) return;

    const ctaName = link.dataset.track;
    const eventData = {
      event: "tidytech_cta_click",
      cta_name: ctaName,
      page_path: window.location.pathname
    };

    if (Array.isArray(window.dataLayer)) window.dataLayer.push(eventData);
    if (plausibleDomain && window.plausible) {
      window.plausible("CTA Click", { props: { cta_name: ctaName } });
    }
  });
})();
