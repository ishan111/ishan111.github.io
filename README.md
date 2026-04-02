# CleverTap Web Push Demo

This package is a ready-to-publish website demo for showing web event tracking + browser push via CleverTap.

## Best hosting option for this demo

Use a GitHub Pages repository named exactly:

`yourusername.github.io`

That makes the site root match the domain root, which is the safest setup for `clevertap_sw.js`.

---

## Files included

- `index.html` – stakeholder-friendly demo UI
- `styles.css` – polished presentation layer
- `app.js` – CleverTap init + identify user + event tracking + push opt-in flow
- `config.js` – edit this with your CleverTap account details
- `clevertap_sw.js` – service worker entry file
- `manifest.json` – basic PWA manifest for completeness
- `.nojekyll` – prevents GitHub Pages from treating underscore/dot files oddly

---

## Before publishing

### 1) Edit `config.js`

Replace:

`REPLACE_WITH_CLEVERTAP_ACCOUNT_ID`

with your actual CleverTap account ID.

If your account is in India, keep:

`region: "in1"`

Other common values:
- `us1`
- `sg1`
- `aps3`
- default EU can usually omit region

### 2) Configure CleverTap dashboard

In CleverTap:

`Settings > Engage > Channels > Web Push`

Do these:
- generate VAPID keys
- upload public/private keys
- enable the browser channels you want
- optionally enable Soft Prompt

### 3) Publish from the domain root

Recommended repo structure on GitHub:

- repo name: `yourusername.github.io`
- files placed in the repo root, not inside a subfolder

---

## Demo script to use in the room

1. Open the website.
2. Enter your email and click **Identify User**.
3. Click **Track Home Page Viewed**.
4. Click **Track Offer Viewed** or **Application Started**.
5. Click **Enable Web Push** and allow notifications.
6. In CleverTap, show:
   - profile created
   - events visible
   - browser subscription available
7. Send a test or live push campaign from CleverTap.
8. Show the browser receiving the push.

---

## Important note about `clevertap_sw.js`

For this demo, the included `clevertap_sw.js` imports CleverTap's hosted parent worker.

If you already use your own service worker in production, CleverTap recommends importing their worker at the top of your existing service worker instead of keeping a separate root file.

---

## If push permission does not show

Check these first:
- site is on HTTPS
- you are using Chrome desktop
- `config.js` has the right account ID
- VAPID keys are uploaded in CleverTap
- notification permission was not previously denied for this domain
- `clevertap_sw.js` is reachable at `/clevertap_sw.js`

---

## Suggested stakeholder framing

Do not present this as “just a push notification.”

Present it as:

**Known user identification + behavioral tracking + retargetable browser subscription + campaign re-engagement**

That sounds materially stronger to senior stakeholders.
