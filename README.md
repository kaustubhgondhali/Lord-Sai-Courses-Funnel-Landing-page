# Lord Sai — Share Market Course Landing Page Funnel

Plain **HTML, CSS and JavaScript**. No framework, no build step, no install.

Unzip, open `index.html`.

## Quick start

1. Open `js/course-config.js` — the only file you need to edit.
2. Set `enquiryEndpoint` and/or `whatsappNumber` (see below).
3. Confirm the course details and curriculum against your live course page.
4. Upload the folder to your host.

Opening the page locally (`file://` or localhost) shows a yellow pre-publication checklist at the top listing everything still unconfirmed. It never appears on a real domain, so visitors cannot see it. (`reviewMode` in the config controls this.)

## Files

* `index.html` — the page, all 3 phases
* `css/styles.css` — styling; palette tokens at the top
* `js/course-config.js` — configuration
* `js/main.js` — navigation, accordions, form
* `assets/` — Lord Sai logo and resized versions
* `tests/integration.test.js` — integration tests

## The rule behind the whole page

**Anything not set in `course-config.js` is hidden, never invented.**

| If this is blank                 | Page behavior                                                       |
| -------------------------------- | ------------------------------------------------------------------- |
| `fee`, `duration`, `batchNote`   | Tile omitted; FAQ says "enquire" instead of a number                |
| `whatsappNumber`                 | WhatsApp buttons and WhatsApp radio are hidden                      |
| Contact phone/email/address      | Footer says details aren't published yet                            |
| Privacy/terms URLs               | Links are hidden                                                    |
| A feature with `included: false` | Feature is not listed; if none are included, the section disappears |

No testimonials, student counts, success rates, awards, or faculty credentials appear unless substantiated.

## Please confirm before publishing

1. **Curriculum:** Confirm the module names and descriptions against the actual course syllabus.
2. **Course facts:** Verify the course name, location, level, languages, and mode.
3. **Features:** Enable only features that are genuinely provided.
4. **Duration and fee:** These are blank until confirmed.

## Connecting the enquiry form

Configure one or both options in `js/course-config.js`:

* **`enquiryEndpoint`** — Your backend must accept a `POST` request with a JSON body and return HTTP 2xx on success. Other responses and network failures should display an error without clearing the visitor's input.
* **`whatsappNumber`** — Use digits only, including the country code (for example, `919876543210`). Without a backend, the form can hand the enquiry to WhatsApp; it must not claim the enquiry was submitted to a server.

If neither is configured, the form validates and explains that nothing was sent.

The payload includes `name`, `countryCode`, `mobile`, `email`, `contactMethod`, `experience`, `preferredLanguage`, `message`, `consent`, `course`, `pageUrl`, and `submittedAt`, plus readable label fields.

Validate input again on the server. Never put API keys in `course-config.js`, because it is a public file.

## Brand colours

| Token        | Hex       |
| ------------ | --------- |
| `--blue`     | `#0173AC` |
| Subtitle bar | `#010066` |
| `--green`    | `#6DC695` |
| `--navy-900` | `#061748` |
| `--navy-800` | `#071F4B` |
| `--cyan`     | `#08B8DC` |

Cyan is used with care because it does not provide sufficient contrast for text on white. The logo remains unchanged and is proportionally resized.

## Compliance wording

The risk disclosure appears in the hero, footer, and other relevant locations. The page should not promise profits, price predictions, or income. Educational practice does not remove market risk.

## Tests

Install the test dependency and run the integration tests:

```bash
npm install jsdom
node tests/integration.test.js
```

The project documentation describes 80 checks covering the funnel, configuration-driven hiding, accordions, navigation, form validation, and submission paths. Run the tests to verify the current code.
