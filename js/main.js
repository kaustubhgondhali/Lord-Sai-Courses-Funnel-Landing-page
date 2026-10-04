/* =============================================================================
   Lord Sai Share Market Academy — Course Landing Page Funnel
   main.js — config-driven content, FAQ accordion, sticky bar, enquiry form.

   No framework, no build step, no dependencies.

   The governing rule throughout: anything not set in course-config.js is
   HIDDEN, never invented. Success is shown only when a destination actually
   confirms it.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.LS_COURSE || {};
  var C   = CFG.course || {};

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  };

  /* ===========================================================================
     0. LANGUAGE — English, Marathi, Hindi. Page text lives in i18n.js; config
        values may be a string or { en, mr, hi }. Missing text falls back to
        English.
     ======================================================================== */
  var I18N  = window.LS_I18N || {};
  var LANGS = ["en", "mr", "hi"];
  var lang  = "en";

  function tr(v, l) {
    if (v && typeof v === "object") return v[l || lang] || v.en || "";
    return typeof v === "string" ? v : "";
  }
  var set = function (v) { return tr(v).trim() !== ""; };

  function t(key, vars) {
    var s = (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || key;
    return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return k in vars ? vars[k] : m; }) : s;
  }
  /* English config values read mid-sentence in lower case; Devanagari has no case */
  function midSentence(s) { return lang === "en" ? s.toLowerCase() : s; }

  function initialLang() {
    var q = (location.search.match(/[?&]lang=(\w+)/) || [])[1];
    if (LANGS.indexOf(q) > -1) return q;
    try { var saved = localStorage.getItem("ls-lang"); if (LANGS.indexOf(saved) > -1) return saved; } catch (e) {}
    return "en";
  }

  function applyStaticText() {
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $$("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.title = t("meta.title");
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));
  }

  function hasWhatsApp() { return /^\d{8,15}$/.test(String(CFG.whatsappNumber || "").trim()); }
  function hasEndpoint() { return set(CFG.enquiryEndpoint); }
  function waLink(text) {
    return "https://wa.me/" + String(CFG.whatsappNumber).trim() +
           (text ? "?text=" + encodeURIComponent(text) : "");
  }

  /* ===========================================================================
     1. WHATSAPP — every WhatsApp control is hidden unless a number is set,
        so the page never renders a button that goes nowhere.
     ======================================================================== */
  function applyWhatsApp() {
    var on = hasWhatsApp();
    $$(".js-wa").forEach(function (el) {
      el.hidden = !on;
      if (on && el.tagName === "A") {
        el.href = waLink(t("wa.hello", { course: tr(C.name) || "Share Market",
                                         academy: tr(C.academy) || "Lord Sai Share Market Academy" }));
        el.target = "_blank";
        el.rel = "noopener";
      }
    });
    /* The hero's second button: WhatsApp when available, otherwise an
       in-page enquiry CTA — never a dead button. */
    var alt = $(".js-wa-alt");
    if (alt) alt.hidden = on;

    var waRadio = $(".js-wa-radio");
    if (waRadio) {
      waRadio.hidden = !on;
      if (!on) { var i = $("input", waRadio); if (i) i.checked = false; }
    }
    var fcWa = $("#fcWa");
    if (fcWa) fcWa.hidden = !on;
  }

  /* ===========================================================================
     2. COURSE FACTS — one tile per confirmed value; blanks are skipped
     ======================================================================== */
  var FACT_ROWS = [
    ["fact.course",    "name"],
    ["fact.academy",   "academy"],
    ["fact.location",  "location"],
    ["fact.level",     "level"],
    ["fact.languages", "languages"],
    ["fact.mode",      "mode"],
    ["fact.duration",  "duration"],
    ["fact.fee",       "fee"],
    ["fact.batches",   "batchNote"]
  ];

  function renderFacts() {
    var wrap = $("#courseFacts");
    if (!wrap) return;
    var html = "", shown = 0;
    FACT_ROWS.forEach(function (row) {
      if (!set(C[row[1]])) return;
      shown++;
      html += '<div><dt>' + esc(t(row[0])) + '</dt><dd>' + esc(tr(C[row[1]])) + '</dd></div>';
    });
    wrap.innerHTML = html;
    wrap.hidden = shown === 0;
    /* If duration, fee or batches are unconfirmed, point people at the form
       rather than publishing a guess. */
    var note = $("#factsEnquireNote");
    if (note) note.hidden = set(C.duration) && set(C.fee) && set(C.batchNote);
  }

  /* Hero quick facts — level, languages and location, only when configured */
  var HERO_FACT_ICONS = {
    level:     '<path d="M4 20h16"/><path d="M7 16v-3M12 16V9M17 16V5"/>',
    languages: '<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
    location:  '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'
  };

  function renderHeroFacts() {
    var wrap = $("#heroFacts");
    if (!wrap) return;
    var keys = ["level", "languages", "location"].filter(function (k) { return set(C[k]); });
    wrap.innerHTML = keys.map(function (k) {
      return '<li><svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + HERO_FACT_ICONS[k] + '</svg>' + esc(tr(C[k])) + '</li>';
    }).join("");
    wrap.hidden = keys.length === 0;
  }

  /* ===========================================================================
     3. CURRICULUM
     ======================================================================== */
  var ICONS = {
    book:     '<path d="M4 19V6a2 2 0 012-2h12v15H6a2 2 0 00-2 2z"/><path d="M8 8h7M8 11.5h7"/>',
    chart:    '<path d="M3 20h18"/><path d="M6 16V9M11 16V5M16 16v-4M21 16V8"/>',
    building: '<path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16"/><path d="M14 10h5a1 1 0 011 1v10"/><path d="M7 8h4M7 12h4M7 16h4M17 14h1M17 18h1"/>',
    target:   '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    shield:   '<path d="M12 3l8 4v5c0 4.4-3.2 8.2-8 9-4.8-.8-8-4.6-8-9V7z"/><path d="M9.5 12.4l1.8 1.8 3.4-3.6"/>',
    eye:      '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>'
  };

  function renderCurriculum() {
    var wrap = $("#moduleList");
    if (!wrap) return;
    var list = Array.isArray(CFG.curriculum) ? CFG.curriculum : [];
    if (!list.length) { var s = $("#curriculum"); if (s) s.hidden = true; return; }

    /* Every module is shown as an open card — nothing to click to read it */
    wrap.innerHTML = list.map(function (m, i) {
      var n = i + 1;
      var icon = ICONS[m.icon] || ICONS.book;
      return '' +
        '<article class="module">' +
          '<div class="mod-top">' +
            '<span class="mod-n">' + (n < 10 ? "0" + n : n) + '</span>' +
            '<span class="mod-ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg></span>' +
          '</div>' +
          '<h3 class="mod-title">' + esc(tr(m.title) || ("Module " + n)) + '</h3>' +
          '<p>' + esc(tr(m.description)) + '</p>' +
        '</article>';
    }).join("");
  }

  /* ===========================================================================
     4. FEATURES — only entries explicitly marked included
     ======================================================================== */
  function renderFeatures() {
    var wrap = $("#featureList"), section = $("#features");
    if (!wrap || !section) return;
    var items = (CFG.features || []).filter(function (f) { return f && f.included === true; });
    if (!items.length) { section.hidden = true; return; }
    section.hidden = false;
    wrap.innerHTML = items.map(function (f) {
      return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(tr(f.label)) + '</span></li>';
    }).join("");
  }

  /* ===========================================================================
     4b. PROOF — rendered only from real details supplied in course-config.js
     ======================================================================== */
  function renderProof() {
    var section = $("#proof");
    if (!section) return;
    var P = CFG.proof || {};
    var stats = (P.stats || []).filter(function (x) { return x && set(x.value) && set(x.label); });
    var quotes = (P.testimonials || []).filter(function (x) { return x && set(x.quote) && set(x.name); });
    var trainer = tr(P.trainerNote);
    if (!stats.length && !quotes.length && !trainer) { section.hidden = true; return; }
    section.hidden = false;
    $("#proofStats").innerHTML = stats.map(function (x) {
      return '<li><b>' + esc(tr(x.value)) + '</b><span>' + esc(tr(x.label)) + '</span></li>';
    }).join("");
    var trainerEl = $("#proofTrainer");
    if (trainerEl) { trainerEl.textContent = trainer; trainerEl.hidden = !trainer; }
    $("#proofQuotes").innerHTML = quotes.map(function (x) {
      return '<figure class="proof-quote"><blockquote>' + esc(tr(x.quote)) + '</blockquote><figcaption>' +
        esc(tr(x.name)) + (set(x.detail) ? ' — ' + esc(tr(x.detail)) : '') + '</figcaption></figure>';
    }).join("");
  }

  /* ===========================================================================
     5. FAQs — answers follow config; unconfirmed facts defer to the form
     ======================================================================== */
  function faqData() {
    var ask     = { enquire: t("faq.enquire") };
    var has     = function (id) { return (CFG.features || []).some(function (f) { return f.id === id && f.included; }); };
    var topics  = (CFG.curriculum || []).map(function (m) { return midSentence(esc(tr(m.title))); }).join(", ");

    return [
      [t("faq.whoQ"), t("faq.whoA") + (set(C.level) ? t("faq.whoLevel", { level: midSentence(esc(tr(C.level))) }) : "")],
      [t("faq.beginnersQ"), t("faq.beginnersA")],
      [t("faq.topicsQ"), t("faq.topicsA", { topics: topics || t("faq.topicsFallback") })],
      [t("faq.taQ"), t("faq.taA")],
      [t("faq.faQ"), t("faq.faA")],
      [t("faq.riskQ"), t("faq.riskA")],
      [t("faq.practicalQ"), has("liveMarket") ? t("faq.practicalYes") : t("faq.practicalAsk", ask)],
      [t("faq.durationQ"), set(C.duration) ? t("faq.durationSet", { duration: esc(tr(C.duration)) }) : t("faq.durationAsk", ask)],
      [t("faq.feeQ"), set(C.fee) ? t("faq.feeSet", { fee: esc(tr(C.fee)) }) : t("faq.feeAsk", ask)],
      [t("faq.langsQ"), set(C.languages) ? t("faq.langsSet", { langs: esc(tr(C.languages)) }) : t("faq.langsAsk", ask)],
      [t("faq.materialsQ"), has("handouts") || has("portal") ? t("faq.materialsYes") : t("faq.materialsAsk", ask)],
      [t("faq.certQ"), has("certificate") ? t("faq.certYes") : t("faq.certAsk", ask)],
      [t("faq.nextQ"), t("faq.nextA", {
        wa:   hasWhatsApp() ? t("faq.nextWa") : "",
        mode: set(C.mode) ? t("faq.nextMode", { mode: midSentence(esc(tr(C.mode))) }) : ""
      })]
    ];
  }

  function renderFaqs() {
    var wrap = $("#faqList");
    if (!wrap) return;
    wrap.innerHTML = faqData().map(function (qa, i) {
      var id = "faq" + (i + 1);
      return '' +
        '<div class="faq-item">' +
          '<h3><button type="button" class="faq-q" aria-expanded="false" aria-controls="' + id + '" id="q' + id + '">' +
            '<span>' + esc(qa[0]) + '</span>' +
            '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
          '</button></h3>' +
          '<div class="faq-a" id="' + id + '" role="region" aria-labelledby="q' + id + '" hidden><p>' + qa[1] + '</p></div>' +
        '</div>';
    }).join("");
    bindAccordion($$(".faq-q", wrap));
  }

  /* ===========================================================================
     6. ACCORDION (FAQs) — keyboard friendly
     ======================================================================== */
  function bindAccordion(buttons) {
    buttons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        buttons.forEach(function (b) {
          b.setAttribute("aria-expanded", "false");
          var p = document.getElementById(b.getAttribute("aria-controls"));
          if (p) p.hidden = true;
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          var panel = document.getElementById(btn.getAttribute("aria-controls"));
          if (panel) panel.hidden = false;
        }
      });
      btn.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown") next = buttons[(idx + 1) % buttons.length];
        else if (e.key === "ArrowUp") next = buttons[(idx - 1 + buttons.length) % buttons.length];
        else if (e.key === "Home") next = buttons[0];
        else if (e.key === "End") next = buttons[buttons.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  }

  /* ===========================================================================
     7. CONTACT, POLICY LINKS, COPYRIGHT
     ======================================================================== */
  function renderContact() {
    var any = false;

    function row(wrapId, linkId, href, label) {
      var wrap = document.getElementById(wrapId), link = document.getElementById(linkId);
      if (!wrap || !link) return;
      if (set(label)) { link.href = href; link.textContent = label; wrap.hidden = false; any = true; }
      else wrap.hidden = true;
    }
    row("fcPhone", "fcPhoneLink", "tel:" + String(CFG.contactPhone || "").replace(/\s/g, ""), CFG.contactPhone);
    row("fcEmail", "fcEmailLink", "mailto:" + (CFG.contactEmail || ""), CFG.contactEmail);

    var aw = $("#fcAddress"), at = $("#fcAddressText");
    if (aw && at) {
      if (set(CFG.contactAddress)) { at.textContent = CFG.contactAddress; aw.hidden = false; any = true; }
      else aw.hidden = true;
    }
    if (hasWhatsApp()) any = true;
    var none = $("#fcNone");
    if (none) none.hidden = any;

    var hasP = set(CFG.privacyPolicyUrl), hasT = set(CFG.termsUrl);
    [["formPrivacy", CFG.privacyPolicyUrl, hasP], ["footPrivacy", CFG.privacyPolicyUrl, hasP],
     ["formTerms", CFG.termsUrl, hasT], ["footTerms", CFG.termsUrl, hasT]].forEach(function (r) {
      var el = document.getElementById(r[0]);
      if (!el) return;
      if (r[2]) { el.href = r[1]; el.hidden = false; } else el.hidden = true;
    });
    ["formPolicyLinks", "footPolicy"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.hidden = !(hasP || hasT);
    });

    var cr = $("#copyright");
    if (cr) cr.textContent = t("foot.copy", { year: new Date().getFullYear(),
      academy: tr(C.academy) || "Lord Sai Investment & Share Market Academy" });
  }

  /* ===========================================================================
     8. REVIEW BANNER — owner-only checklist of unconfirmed details
     ======================================================================== */
  function renderReviewBanner() {
    var banner = $("#reviewBanner"), list = $("#reviewList");
    if (!banner || !list) return;

    var mode = CFG.reviewMode;
    var local = location.protocol === "file:" ||
                /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
                location.hostname === "";
    var show = mode === true || (mode === "auto" && local);
    if (!show) { banner.hidden = true; return; }

    var missing = [];
    if (!hasEndpoint() && !hasWhatsApp()) missing.push("No enquiry destination — the form cannot send anything yet. Set enquiryEndpoint or whatsappNumber.");
    else if (!hasEndpoint()) missing.push("No enquiryEndpoint — enquiries currently go out through WhatsApp only.");
    if (!hasWhatsApp()) missing.push("No whatsappNumber — every WhatsApp button is hidden.");
    if (!set(C.duration)) missing.push("Course duration not set — omitted from the page, and the FAQ defers to the enquiry form.");
    if (!set(C.fee)) missing.push("Course fee not set — omitted, and the FAQ defers to the enquiry form.");
    if (!set(C.batchNote)) missing.push("Batch note not set — omitted.");
    if (!set(CFG.contactPhone) && !set(CFG.contactEmail) && !set(CFG.contactAddress)) missing.push("No contact details — the footer says so rather than inventing any.");
    if (!set(CFG.privacyPolicyUrl)) missing.push("No privacyPolicyUrl — policy links hidden.");
    if (!(CFG.features || []).some(function (f) { return f.included; })) missing.push("No features marked included — the 'What's Included' section is hidden.");
    missing.push("Confirm the curriculum matches your live course page. If it has more modules than the " + (CFG.curriculum || []).length + " listed, replace the list in course-config.js.");
    missing.push("Verify course name, location, level, languages and mode against your own records.");

    list.innerHTML = missing.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");
    banner.hidden = false;
  }

  /* ===========================================================================
     9. SCROLL — header shadow and the sticky enquiry bar
     ======================================================================== */
  function bindScroll() {
    var header = $("#siteHeader"), sticky = $("#stickyCta"), enq = $("#enquiry");
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (sticky) {
        /* Shown once past the hero, hidden while the form itself is on screen */
        var er = enq ? enq.getBoundingClientRect() : null;
        var inForm = er && er.top < window.innerHeight && er.bottom > 0;
        sticky.classList.toggle("is-visible", y > 600 && !inForm);
      }
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ===========================================================================
     10. ENQUIRY FORM
     ---------------------------------------------------------------------------
     • Success only after a genuine 2xx from a configured endpoint.
     • No endpoint → says plainly that nothing was sent.
     • WhatsApp path says WhatsApp was opened; it never claims a submission.
     • On any failure the typed values stay in the form.
     ======================================================================== */
  var form = $("#enquiryForm"), submitBtn = $("#submitBtn"), statusBox = $("#formStatus"), busy = false;
  var lastStatus = null;

  /* Status and error text are stored as keys, so a language switch re-translates them */
  function showStatus(kind, key, vars) {
    if (!statusBox) return;
    lastStatus = { kind: kind, key: key, vars: vars };
    statusBox.hidden = false;
    statusBox.className = "form-status is-" + kind;
    statusBox.textContent = t(key, vars);
  }
  function refreshStatus() {
    if (lastStatus && statusBox && !statusBox.hidden) showStatus(lastStatus.kind, lastStatus.key, lastStatus.vars);
  }
  function fieldErr(input, errId, key) {
    var e = document.getElementById(errId);
    if (input) input.setAttribute("aria-invalid", "true");
    if (e) { e.setAttribute("data-i18n", key); e.textContent = t(key); e.hidden = false; }
  }
  function clearErr(input, errId) {
    var e = document.getElementById(errId);
    if (input) input.removeAttribute("aria-invalid");
    if (e) e.hidden = true;
  }

  function validate() {
    var ok = true, first = null;
    var name = $("#fName"), mobile = $("#fMobile"), email = $("#fEmail"),
        consent = $("#fConsent"), code = $("#fCode");
    var method = $("input[name='contactMethod']:checked");

    [[name,"eName"],[mobile,"eMobile"],[email,"eEmail"],[consent,"eConsent"]].forEach(function (p) { clearErr(p[0], p[1]); });
    clearErr(null, "eMethod");

    if (!name.value.trim() || name.value.trim().length < 2) {
      fieldErr(name, "eName", "err.name"); ok = false; first = first || name;
    }
    var digits = mobile.value.replace(/\D/g, "");
    var mobileOk = code.value === "+91" ? /^[6-9]\d{9}$/.test(digits) : /^\d{6,14}$/.test(digits);
    if (!mobileOk) { fieldErr(mobile, "eMobile", "err.mobile"); ok = false; first = first || mobile; }

    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      fieldErr(email, "eEmail", "err.email"); ok = false; first = first || email;
    }
    if (!method) {
      fieldErr(null, "eMethod", "err.method"); ok = false;
    } else if (method.value === "email" && !email.value.trim()) {
      fieldErr(email, "eEmail", "err.emailNeeded"); ok = false; first = first || email;
    }
    if (!consent.checked) {
      fieldErr(consent, "eConsent", "err.consent"); ok = false; first = first || consent;
    }
    if (first) { try { first.focus(); } catch (e) {} }
    return ok;
  }

  function collect() {
    var m = $("input[name='contactMethod']:checked");
    var exp = $("#fExperience"), langSel = $("#fLanguage");
    return {
      name: $("#fName").value.trim(),
      countryCode: $("#fCode").value,
      mobile: $("#fMobile").value.replace(/\D/g, ""),
      email: $("#fEmail").value.trim(),
      contactMethod: m ? m.value : "",
      contactMethodLabel: m ? $("span", m.parentElement).textContent : "",
      experience: exp.value,
      experienceLabel: exp.value ? exp.options[exp.selectedIndex].text : "",
      preferredLanguage: langSel.value,
      preferredLanguageLabel: langSel.value ? langSel.options[langSel.selectedIndex].text : "",
      message: $("#fMessage").value.trim(),
      consent: $("#fConsent").checked,
      course: tr(C.name, "en"),
      pageLanguage: lang,
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString()
    };
  }

  function waText(d) {
    var L = [t("wa.title"), "", t("wa.name") + ": " + d.name, t("wa.mobile") + ": " + d.countryCode + " " + d.mobile];
    if (d.email) L.push(t("wa.email") + ": " + d.email);
    if (d.experienceLabel) L.push(t("wa.exp") + ": " + d.experienceLabel);
    if (d.preferredLanguageLabel) L.push(t("wa.lang") + ": " + d.preferredLanguageLabel);
    L.push(t("wa.contact") + ": " + d.contactMethodLabel);
    if (d.message) L.push("", t("wa.message") + ": " + d.message);
    return L.join("\n");
  }

  function setBusy(on) {
    busy = on;
    if (!submitBtn) return;
    submitBtn.classList.toggle("is-busy", on);
    submitBtn.disabled = on;
  }

  /* Label the button for what it will actually do */
  function labelSubmit() {
    var label = $(".btn-label", submitBtn), hint = $("#waHint");
    var waOnly = !hasEndpoint() && hasWhatsApp();
    if (label) label.textContent = t(waOnly ? "form.submitWa" : "form.submit");
    if (hint) hint.hidden = !waOnly;
  }

  function bindForm() {
    if (!form) return;

    [["fName","eName"],["fMobile","eMobile"],["fEmail","eEmail"],["fConsent","eConsent"]].forEach(function (p) {
      var el = document.getElementById(p[0]);
      if (!el) return;
      el.addEventListener(el.type === "checkbox" ? "change" : "input", function () { clearErr(el, p[1]); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;                        /* blocks accidental double submit */
      if (statusBox) statusBox.hidden = true;

      if (!validate()) { showStatus("error", "status.fix"); return; }
      var data = collect();

      /* Path A — a real backend is configured */
      if (hasEndpoint()) {
        setBusy(true);
        showStatus("pending", "status.sending");
        var headers = { "Content-Type": "application/json" };
        Object.keys(CFG.enquiryHeaders || {}).forEach(function (k) { headers[k] = CFG.enquiryHeaders[k]; });

        fetch(CFG.enquiryEndpoint, { method: "POST", headers: headers, body: JSON.stringify(data) })
          .then(function (res) {
            setBusy(false);
            if (res.ok) {
              showStatus("success", "status.success", { academy: tr(C.academy) || "Lord Sai Share Market Academy" });
              form.reset();
              $$("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
              applyWhatsApp();
            } else {
              showStatus("error", "status.httpError");
            }
          })
          .catch(function () {
            setBusy(false);
            showStatus("error", "status.network");
          });
        return;
      }

      /* Path B — no backend, WhatsApp available */
      if (hasWhatsApp()) {
        var win = window.open(waLink(waText(data)), "_blank", "noopener");
        if (win) showStatus("info", "status.waOpened");
        else showStatus("error", "status.waBlocked");
        return;
      }

      /* Path C — nothing configured */
      showStatus("info", "status.notConnected");
      if (window.console && console.warn) {
        console.warn("[Lord Sai Course] No enquiry destination configured. Set LS_COURSE.enquiryEndpoint " +
                     "and/or LS_COURSE.whatsappNumber in js/course-config.js. Nothing was sent or stored.");
      }
    });
  }

  /* ===========================================================================
     11. LANGUAGE SWITCH + BOOT
     ======================================================================== */
  function setLang(next, remember) {
    lang = LANGS.indexOf(next) > -1 ? next : "en";
    document.documentElement.lang = lang;
    if (remember) { try { localStorage.setItem("ls-lang", lang); } catch (e) {} }
    var sel = $("#langSelect");
    if (sel) sel.value = lang;

    applyStaticText();
    applyWhatsApp();
    renderFacts();
    renderHeroFacts();
    renderCurriculum();
    renderFeatures();
    renderProof();
    renderFaqs();
    renderContact();
    labelSubmit();
    refreshStatus();
  }

  function init() {
    setLang(initialLang(), false);
    renderReviewBanner();
    var sel = $("#langSelect");
    if (sel) sel.addEventListener("change", function () { setLang(sel.value, true); });
    bindScroll();
    bindForm();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
