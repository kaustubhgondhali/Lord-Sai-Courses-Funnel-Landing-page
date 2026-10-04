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
         preferredLanguage, message, consent, course, pageLanguage, pageUrl,
         submittedAt }   (course is always the English name; pageLanguage is
         the language the visitor was reading in: "en", "mr" or "hi")

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

     LANGUAGES: any text here can be a plain string (shown in every language)
     or { en: "…", mr: "…", hi: "…" } for English, Marathi and Hindi. A
     missing translation falls back to English.
  --------------------------------------------------------------------------- */
  course: {
    name:      { en: "Share Market Education & Training",
                 mr: "शेअर मार्केट शिक्षण व प्रशिक्षण",
                 hi: "शेयर मार्केट शिक्षा और प्रशिक्षण" },
    academy:   { en: "Lord Sai Share Market Academy",
                 mr: "लॉर्ड साई शेअर मार्केट अकॅडमी",
                 hi: "लॉर्ड साई शेयर मार्केट एकेडमी" },
    location:  { en: "Uran, Navi Mumbai, Maharashtra",
                 mr: "उरण, नवी मुंबई, महाराष्ट्र",
                 hi: "उरण, नवी मुंबई, महाराष्ट्र" },
    level:     { en: "Beginner to Intermediate",
                 mr: "नवशिका ते मध्यम",
                 hi: "शुरुआती से मध्यम" },
    languages: { en: "Marathi and English",
                 mr: "मराठी आणि इंग्रजी",
                 hi: "मराठी और अंग्रेज़ी" },
    mode:      { en: "Classroom training and live market observation",
                 mr: "वर्गातील प्रशिक्षण आणि लाइव्ह मार्केट निरीक्षण",
                 hi: "क्लासरूम ट्रेनिंग और लाइव मार्केट ऑब्ज़र्वेशन" },

    duration:  "",           // e.g. { en: "8 weeks", mr: "8 आठवडे", hi: "8 हफ़्ते" } — CONFIRM BEFORE PUBLISHING
    fee:       "",           // e.g. "₹12,000" — CONFIRM BEFORE PUBLISHING
    batchNote: ""            // e.g. { en: "New batches start monthly", mr: "…", hi: "…" }
  },

  /* ---------------------------------------------------------------------------
     6. COURSE FEATURES
     ---------------------------------------------------------------------------
     Set `included: true` ONLY for what the course genuinely provides.
     Anything left false is not rendered. Do not switch one on to fill the grid.
  --------------------------------------------------------------------------- */
  features: [
    { id: "examples",    included: true,
      label: { en: "Practical market examples", mr: "मार्केटची प्रत्यक्ष उदाहरणे", hi: "बाज़ार के व्यावहारिक उदाहरण" } },
    { id: "charts",      included: true,
      label: { en: "Chart-analysis exercises", mr: "चार्ट ॲनालिसिसचे सराव", hi: "चार्ट एनालिसिस अभ्यास" } },
    { id: "liveMarket",  included: true,
      label: { en: "Live market observation", mr: "लाइव्ह मार्केट निरीक्षण", hi: "लाइव मार्केट ऑब्ज़र्वेशन" } },
    { id: "handouts",    included: false,
      label: { en: "Learning handouts and PDFs", mr: "शिकण्याचे हँडआउट आणि PDF", hi: "पढ़ाई के हैंडआउट और PDF" } },
    { id: "portal",      included: false,
      label: { en: "Student portal access", mr: "स्टुडंट पोर्टलचा ॲक्सेस", hi: "स्टूडेंट पोर्टल एक्सेस" } },
    { id: "journal",     included: false,
      label: { en: "Trade-journal resources", mr: "ट्रेड-जर्नलसाठी साहित्य", hi: "ट्रेड-जर्नल संसाधन" } },
    { id: "whatsappQnA", included: false,
      label: { en: "WhatsApp doubt support", mr: "WhatsApp वर शंका निरसन", hi: "WhatsApp पर डाउट सपोर्ट" } },
    { id: "certificate", included: false,
      label: { en: "Course completion certificate", mr: "कोर्स पूर्णत्वाचे प्रमाणपत्र", hi: "कोर्स पूरा होने का सर्टिफ़िकेट" } }
  ],


  /* ---------------------------------------------------------------------------
     8. PROOF  (optional — the section is hidden until you fill something in)
     Use only real, verifiable details. Never invent testimonials or numbers.
       stats:        [{ value: "500+", label: "Learners trained" }]
       trainerNote:  "Taught by …, with … years of market experience."
       testimonials: [{ quote: "…", name: "Student name", detail: "Batch / city" }]
     Text can also be { en: "…", mr: "…", hi: "…" }, as in the course facts.
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
      title: { en: "Basics of Share Market", mr: "शेअर मार्केटची मूलतत्त्वे", hi: "शेयर बाज़ार की बुनियादी बातें" },
      description: {
        en: "How the share market works, who takes part in it, the instruments traded, and the terminology used day to day.",
        mr: "शेअर मार्केट कसे चालते, त्यात कोण सहभागी होतात, कोणते इन्स्ट्रुमेंट्स ट्रेड होतात आणि रोजच्या वापरातील संज्ञा.",
        hi: "शेयर बाज़ार कैसे काम करता है, उसमें कौन हिस्सा लेता है, कौन-से इंस्ट्रूमेंट्स ट्रेड होते हैं और रोज़ इस्तेमाल होने वाली शब्दावली।"
      },
      icon: "book"
    },
    {
      title: { en: "Technical Analysis", mr: "टेक्निकल ॲनालिसिस", hi: "टेक्निकल एनालिसिस" },
      description: {
        en: "Reading candlestick charts, recognising price patterns and trends, and understanding what common indicators do and do not tell you.",
        mr: "कँडलस्टिक चार्ट वाचणे, प्राइस पॅटर्न आणि ट्रेंड ओळखणे, आणि सामान्य इंडिकेटर काय सांगतात व काय सांगत नाहीत हे समजून घेणे.",
        hi: "कैंडलस्टिक चार्ट पढ़ना, प्राइस पैटर्न और ट्रेंड पहचानना, और यह समझना कि आम इंडिकेटर क्या बताते हैं और क्या नहीं।"
      },
      icon: "chart"
    },
    {
      title: { en: "Fundamental Analysis", mr: "फंडामेंटल ॲनालिसिस", hi: "फंडामेंटल एनालिसिस" },
      description: {
        en: "Working through company financial information, sector context and valuation concepts.",
        mr: "कंपनीची आर्थिक माहिती, सेक्टरचा संदर्भ आणि व्हॅल्युएशनच्या संकल्पनांचा अभ्यास.",
        hi: "कंपनी की वित्तीय जानकारी, सेक्टर के संदर्भ और वैल्यूएशन की अवधारणाओं पर काम करना।"
      },
      icon: "building"
    },
    {
      title: { en: "Trading Strategies", mr: "ट्रेडिंग स्ट्रॅटेजी", hi: "ट्रेडिंग स्ट्रैटेजी" },
      description: {
        en: "How intraday, swing and positional approaches differ in time horizon, effort and the risks each one carries.",
        mr: "इंट्राडे, स्विंग आणि पोझिशनल पद्धती कालावधी, मेहनत आणि प्रत्येकातील जोखमीच्या बाबतीत कशा वेगळ्या आहेत.",
        hi: "इंट्राडे, स्विंग और पोज़िशनल तरीके समय-सीमा, मेहनत और हर एक के जोखिम में कैसे अलग हैं।"
      },
      icon: "target"
    },
    {
      title: { en: "Risk Management", mr: "रिस्क मॅनेजमेंट", hi: "रिस्क मैनेजमेंट" },
      description: {
        en: "Stop-losses, position sizing, risk–reward ratios, and the trading psychology that affects how people apply them.",
        mr: "स्टॉप-लॉस, पोझिशन साइझिंग, रिस्क–रिवॉर्ड रेशो आणि ते प्रत्यक्षात कसे वापरले जातात यावर परिणाम करणारी ट्रेडिंग सायकॉलॉजी.",
        hi: "स्टॉप-लॉस, पोज़िशन साइज़िंग, रिस्क–रिवॉर्ड रेशियो और वह ट्रेडिंग साइकोलॉजी जो इन्हें लागू करने के तरीके पर असर डालती है।"
      },
      icon: "shield"
    },
    {
      title: { en: "Live Market Practice & Observation", mr: "लाइव्ह मार्केट सराव आणि निरीक्षण", hi: "लाइव मार्केट अभ्यास और ऑब्ज़र्वेशन" },
      description: {
        en: "Following real market sessions, reviewing analysis afterwards, and documenting decisions to build a repeatable process.",
        mr: "प्रत्यक्ष मार्केट सत्रांचे निरीक्षण करणे, नंतर ॲनालिसिसचा आढावा घेणे आणि पुन्हा वापरता येईल अशी प्रक्रिया तयार करण्यासाठी निर्णयांची नोंद ठेवणे.",
        hi: "असली मार्केट सेशन को फ़ॉलो करना, बाद में एनालिसिस की समीक्षा करना, और दोहराई जा सकने वाली प्रक्रिया बनाने के लिए फ़ैसलों को दर्ज करना।"
      },
      icon: "eye"
    }
  ]
};
