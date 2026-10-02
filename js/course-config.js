/* =============================================================================
   Lord Sai Share Market Academy — Course Landing Page Funnel
   course-config.js — THE ONLY FILE YOU NEED TO EDIT.
   -----------------------------------------------------------------------------
   Everything the page says about the course comes from here.

   The rule this file enforces: an empty value is HIDDEN on the page, never
   guessed. If the fee is blank, no fee is shown and the FAQ about fees points
   the visitor at the enquiry form instead of inventing a number.

   Fill in what you can verify from your actual course page, and delete or
   correct anything below that does not match it.
   ========================================================================== */

window.LS_COURSE = {

  /* ---------------------------------------------------------------------------
     1. REVIEW BANNER
     "auto"  → an on-page checklist of unconfirmed details appears only when you
               open the page locally (file:// or localhost). It never shows on a
               real domain, so it cannot leak to visitors.
     true    → always show.   false → never show.
  --------------------------------------------------------------------------- */
  reviewMode: "auto",

  /* ---------------------------------------------------------------------------
     2. ENQUIRY DESTINATION  — REQUIRED before the form can accept enquiries
     ---------------------------------------------------------------------------
     Your existing enquiry endpoint. Must accept POST with a JSON body and
     return HTTP 2xx on success. Example: "/api/enquiry"

     Payload sent:
       { name, countryCode, mobile, email, contactMethod, experience,
         preferredLanguage, message, consent, course, pageUrl, submittedAt }

     SECURITY: this file is public. Never put an API key or secret here.

     Left empty, the form still validates but tells the visitor plainly that
     nothing was sent. It will not show a false success message.
  --------------------------------------------------------------------------- */
  enquiryEndpoint: "",
  enquiryHeaders: {},

  /* ---------------------------------------------------------------------------
     3. WHATSAPP  (optional)
     Country code + number, digits only, no "+" and no spaces.
     Example for India: "919876543210"

     Every "WhatsApp" button on the page is hidden while this is empty, so the
     page never shows a button that goes nowhere. When the enquiry endpoint is
     also empty, the form falls back to sending the enquiry through WhatsApp.
  --------------------------------------------------------------------------- */
  whatsappNumber: "",

  /* ---------------------------------------------------------------------------
     4. PUBLIC CONTACT DETAILS  (optional — blank fields are hidden)
  --------------------------------------------------------------------------- */
  contactPhone:   "",        // e.g. "+91 98765 43210"
  contactEmail:   "",        // e.g. "info@lordsai.in"
  contactAddress: "",        // e.g. "Uran, Navi Mumbai, Maharashtra"

  privacyPolicyUrl: "",      // e.g. "/privacy-policy.html"
  termsUrl:         "",      // e.g. "/terms.html"

  /* ---------------------------------------------------------------------------
     5. COURSE FACTS
     ---------------------------------------------------------------------------
     The first six came from your brief. CHECK THEM against your live course
     page and correct anything that differs.

     duration and fee are deliberately left blank — they were not supplied and
     must not be guessed. While blank, the page omits them and the matching FAQs
     invite the visitor to enquire.
  --------------------------------------------------------------------------- */
  course: {
    name:      "Share Market Education & Training",
    academy:   "Lord Sai Share Market Academy",
    location:  "Uran, Navi Mumbai, Maharashtra",
    level:     "Beginner to Intermediate",
    languages: "Marathi and English",
    mode:      "Classroom training and live market observation",

    duration:  "",           // e.g. "8 weeks" — CONFIRM BEFORE PUBLISHING
    fee:       "",           // e.g. "₹12,000" — CONFIRM BEFORE PUBLISHING
    batchNote: ""            // e.g. "New batches start monthly"
  },

  /* ---------------------------------------------------------------------------
     6. COURSE FEATURES
     ---------------------------------------------------------------------------
     Set `included: true` ONLY for what the course genuinely provides.
     Anything left false is not rendered. Do not switch one on to fill the grid.
  --------------------------------------------------------------------------- */
  features: [
    { id: "examples",    label: "Practical market examples",        included: true  },
    { id: "charts",      label: "Chart-analysis exercises",         included: true  },
    { id: "liveMarket",  label: "Live market observation",          included: true  },
    { id: "handouts",    label: "Learning handouts and PDFs",       included: false },
    { id: "portal",      label: "Student portal access",            included: false },
    { id: "journal",     label: "Trade-journal resources",          included: false },
    { id: "whatsappQnA", label: "WhatsApp doubt support",           included: false },
    { id: "certificate", label: "Course completion certificate",    included: false }
  ],


  /* ---------------------------------------------------------------------------
     8. PROOF  (optional — the section is hidden until you fill something in)
     Use only real, verifiable details. Never invent testimonials or numbers.
       stats:        [{ value: "500+", label: "Learners trained" }]
       trainerNote:  "Taught by …, with … years of market experience."
       testimonials: [{ quote: "…", name: "Student name", detail: "Batch / city" }]
  --------------------------------------------------------------------------- */
  proof: {
    stats: [],
    trainerNote: "",
    testimonials: []
  },

  /* ---------------------------------------------------------------------------
     7. CURRICULUM
     ---------------------------------------------------------------------------
     These six are the topic areas listed in your brief, used as a starting
     point. If your live course page has a longer syllabus (nine modules, for
     example), REPLACE this list with the real module titles and descriptions.
     Add or remove entries freely — the page adapts and numbers them for you.
  --------------------------------------------------------------------------- */
  curriculum: [
    {
      title: "Basics of Share Market",
      description: "How the share market works, who takes part in it, the instruments traded, and the terminology used day to day.",
      icon: "book"
    },
    {
      title: "Technical Analysis",
      description: "Reading candlestick charts, recognising price patterns and trends, and understanding what common indicators do and do not tell you.",
      icon: "chart"
    },
    {
      title: "Fundamental Analysis",
      description: "Working through company financial information, sector context and valuation concepts.",
      icon: "building"
    },
    {
      title: "Trading Strategies",
      description: "How intraday, swing and positional approaches differ in time horizon, effort and the risks each one carries.",
      icon: "target"
    },
    {
      title: "Risk Management",
      description: "Stop-losses, position sizing, risk–reward ratios, and the trading psychology that affects how people apply them.",
      icon: "shield"
    },
    {
      title: "Live Market Practice & Observation",
      description: "Following real market sessions, reviewing analysis afterwards, and documenting decisions to build a repeatable process.",
      icon: "eye"
    }
  ]
};
