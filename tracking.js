(() => {
  "use strict";

  window.dataLayer = window.dataLayer || [];

  const track = (eventName, data = {}) => {
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      ...data
    });
  };

  const getDestinationType = (link) => {
    const href = String(link.getAttribute("href") || "").trim();
    if (href.startsWith("mailto:")) return "email";
    if (href.startsWith("#")) return "section";
    if (/^https?:\/\//i.test(href)) return "external";
    return "other";
  };

  // Conversion/CTA clicks. Existing data-track values are stable analytics IDs.
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const cta = event.target.closest("[data-track]");
    if (cta) {
      track("tidytech_cta_click", {
        cta_name: cta.dataset.track,
        destination_type: getDestinationType(cta)
      });
    }

    const navLink = event.target.closest("[data-track-nav]");
    if (navLink) {
      track("tidytech_navigation_click", {
        destination: navLink.dataset.trackNav
      });
    }
  });

  // FAQ engagement. Count each FAQ once per page load, on first open.
  const openedFaqs = new WeakSet();
  document.querySelectorAll("details[data-track-faq]").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open || openedFaqs.has(details)) return;

      openedFaqs.add(details);
      track("tidytech_faq_open", {
        faq_name: details.dataset.trackFaq
      });
    });
  });

  if (!("IntersectionObserver" in window)) return;

  // Section views: tuned for long desktop/mobile sections. A section is counted
  // once it has genuinely entered the reading area, rather than requiring half
  // of a potentially very tall section to fit in the viewport at once.
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      track("tidytech_section_view", {
        section_name: element.dataset.trackView
      });
      observer.unobserve(element);
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -30% 0px"
  });

  document
    .querySelectorAll('[data-track-view][data-track-type="section"]')
    .forEach((element) => sectionObserver.observe(element));

  // CTA impressions: count only when at least 50% of a key CTA is visible.
  const ctaObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;

      const element = entry.target;
      track("tidytech_cta_view", {
        cta_name: element.dataset.trackView
      });
      observer.unobserve(element);
    });
  }, {
    threshold: 0.5
  });

  document
    .querySelectorAll('[data-track-view][data-track-type="cta"]')
    .forEach((element) => ctaObserver.observe(element));
})();
