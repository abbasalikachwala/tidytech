# Tidy Tech

Static website for **Tidy Tech — Tech Made Simple**, providing personal IT support in Christchurch and remote help across New Zealand.

## Website

[tidytech.co.nz](https://tidytech.co.nz)

## Hosting

The site is deployed from the `main` branch to GitHub Pages using the workflow in `.github/workflows/deploy-pages.yml`.

## Local preview

Run any static web server from the repository root. For example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Visitor and enquiry tracking

Tracking is disabled by default. To enable it, edit `window.TIDY_TECH_TRACKING` near the end of `index.html` and add either:

- a Google Tag Manager container ID such as `GTM-XXXXXXX`; or
- `tidytech.co.nz` as the Plausible domain after the site has been added to Plausible.

Buttons and email links include named `data-track` attributes. Google Tag Manager receives a `tidytech_cta_click` event with `cta_name`; Plausible receives a `CTA Click` custom event. Review the chosen provider's privacy and consent requirements before enabling tracking.
