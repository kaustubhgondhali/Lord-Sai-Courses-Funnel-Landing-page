# Lord Sai — Share Market Course Landing Page Funnel

Plain **HTML, CSS and JavaScript**. No framework, no build step, no install.
Unzip, open `index.html`.

## Quick start

1. Open `js/course-config.js` — **the only file you need to edit.**
2. Set `enquiryEndpoint` and/or `whatsappNumber` (see below).
3. Confirm the course details and curriculum against your live course page.
4. Upload the folder to your host.

Opening the page locally (file:// or localhost) shows a yellow **pre-publication
checklist** at the top listing everything still unconfirmed. It never appears on
a real domain, so visitors cannot see it. (`reviewMode` in the config controls this.)

## Files

```
index.html               the page — all 3 phases
css/styles.css           styling; palette tokens at the top
js/course-config.js      ← edit this
js/main.js               navigation, accordions, form
assets/                  lord-sai-logo.png (original) + 420/300 px resizes
tests/integration.test.js
```

## The rule behind the whole page

**Anything not set in `course-config.js` is hidden, never invented.**

| If this is blank…            | …the page does this                                        |
|------------------------------|------------------------------------------------------------|
| `fee`, `duration`, `batchNote` | tile omitted; FAQ says "enquire" instead of a number     |
| `whatsappNumber`             | every WhatsApp button and the WhatsApp radio are hidden    |
| contact phone/email/address  | footer says details aren't published yet                   |
| privacy / terms URLs         | links hidden                                               |
| a feature `included: false`  | not listed; if none are included the section disappears    |

No testimonials, student counts, success rates, awards or faculty credentials appear
anywhere — none were supplied. Add them only if you can substantiate them.

## ⚠️ Please confirm before publishing

1. **The curriculum.** The six modules are the *topic areas from your brief*, with
   descriptions I wrote from those topics. If your live course page has a longer
   syllabus (e.g. nine modules), **replace the list in `course-config.js` with the
   real module names and descriptions.** I had no access to that page.
2. **Course facts** — name, location, level, languages, mode — came from your brief.
   Check them against your records.
3. **Features.** Only three are switched on (practical examples, chart exercises,
   live observation), because those are the ones the brief's own outcomes describe.
   Handouts, portal, journal, WhatsApp support and certificate are **off** until you
   confirm them. Set `included: true` for each one that is genuinely provided.
4. **Duration and fee** are blank on purpose.

## Connecting the enquiry form

Set one of these in `js/course-config.js`:

- **`enquiryEndpoint`** — your backend. Must accept `POST` with a JSON body and return
  HTTP 2xx on success. Success is shown **only** on a genuine 2xx. On any other
  response or a network failure the visitor sees an error and **keeps what they typed**.
- **`whatsappNumber`** — digits only, with country code (e.g. `919876543210`).
  Without a backend, the form hands the enquiry to WhatsApp and says so; it never
  claims it was "submitted".

With neither set, the form validates and then tells the visitor plainly that nothing
was sent. That is intentional, not a bug.

Payload: `name, countryCode, mobile, email, contactMethod, experience,
preferredLanguage, message, consent, course, pageUrl, submittedAt` (plus readable
`…Label` fields). Please **validate again on the server** — browser validation is a
convenience, not a security control. Never put an API key in `course-config.js`;
it is a public file.

## Brand colours

Logo ink was sampled with alpha compositing (the PNG is transparent):

| Token | Hex | Source |
|---|---|---|
| `--blue` | `#0173AC` | bull and LORD SAI wordmark (sampled) |
| subtitle bar | `#010066` | sampled |
| `--green` | `#6DC695` | growth arrow (sampled) |
| `--navy-900` | `#061748` | your brief |
| `--navy-800` | `#071F4B` | your brief |
| `--cyan` | `#08B8DC` | your brief |

**Cyan is only 2.36:1 on white**, which fails accessibility contrast for text. So it
is used as a highlight *on navy* (7.3:1) and as a button fill with navy text — never
as text on a light background.

The logo's wordmark is blue and navy, so on the navy footer it sits on a white plate
to stay legible. The header uses it directly on white. The file itself is untouched,
only proportionally resized.

## Compliance wording

The risk disclosure appears in the hero, the footer and where relevant, in the exact
form you specified. Nothing promises profit, price prediction or income. Phase 1's
"consequences" are framed as patterns that *tend* to persist, not as certain losses,
and there is no countdown, false urgency or fabricated loss figure. Practice is
described as educational and as not removing market risk.

## Tests

```bash
npm install jsdom
node tests/integration.test.js
```

80 checks covering the funnel, config-driven hiding, both accordions, nav links, form
validation, and every submission path (unconfigured, WhatsApp, endpoint 500, network
failure, endpoint 200, fully configured).
