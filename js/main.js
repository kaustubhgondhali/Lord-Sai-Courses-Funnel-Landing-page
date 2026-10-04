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
  var set = function (v) { return typeof v === "string" && v.trim() !== ""; };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  };

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
        el.href = waLink("Hello, I would like to know more about the " +
                         (C.name || "Share Market") + " course at " +
                         (C.academy || "Lord Sai Share Market Academy") + ".");
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
    ["Course",    "name"],
    ["Academy",   "academy"],
    ["Location",  "location"],
    ["Level",     "level"],
    ["Languages", "languages"],
    ["Mode",      "mode"],
    ["Duration",  "duration"],
    ["Fee",       "fee"],
    ["Batches",   "batchNote"]
  ];

  function renderFacts() {
    var wrap = $("#courseFacts");
    if (!wrap) return;
    var html = "", shown = 0;
    FACT_ROWS.forEach(function (row) {
      if (!set(C[row[1]])) return;
      shown++;
      html += '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(C[row[1]]) + '</dd></div>';
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
      return '<li><svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + HERO_FACT_ICONS[k] + '</svg>' + esc(C[k]) + '</li>';
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
          '<h3 class="mod-title">' + esc(m.title || ("Module " + n)) + '</h3>' +
          '<p>' + esc(m.description || "") + '</p>' +
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
      return '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(f.label) + '</span></li>';
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
    var trainer = set(P.trainerNote) ? P.trainerNote : "";
    if (!stats.length && !quotes.length && !trainer) { section.hidden = true; return; }
    section.hidden = false;
    $("#proofStats").innerHTML = stats.map(function (x) {
      return '<li><b>' + esc(x.value) + '</b><span>' + esc(x.label) + '</span></li>';
    }).join("");
    var t = $("#proofTrainer");
    if (t) { t.textContent = trainer; t.hidden = !trainer; }
    $("#proofQuotes").innerHTML = quotes.map(function (x) {
      return '<figure class="proof-quote"><blockquote>' + esc(x.quote) + '</blockquote><figcaption>' +
        esc(x.name) + (set(x.detail) ? ' — ' + esc(x.detail) : '') + '</figcaption></figure>';
    }).join("");
  }

  /* ===========================================================================
     5. FAQs — answers follow config; unconfirmed facts defer to the form
     ======================================================================== */
  function faqData() {
    var enquire = 'Please <a href="#enquiry">send an enquiry</a> and we will confirm the current position directly.';
    var langs   = set(C.languages) ? esc(C.languages) : null;
    var mode    = set(C.mode) ? esc(C.mode).toLowerCase() : null;
    var hasCert = (CFG.features || []).some(function (f) { return f.id === "certificate" && f.included; });
    var hasMats = (CFG.features || []).some(function (f) { return (f.id === "handouts" || f.id === "portal") && f.included; });

    return [
      ["Who can join the Share Market Course?",
       "The course is open to anyone who wants to understand how the share market works — whether you have never placed a trade or have some experience and want a more structured foundation." +
       (set(C.level) ? " It is pitched at " + esc(C.level).toLowerCase() + " learners." : "")],

      ["Is the course suitable for beginners?",
       "Yes. It starts with market fundamentals and terminology before moving on to charts, analysis and risk management, so no prior background is assumed."],

      ["What topics are covered in the course?",
       "The curriculum covers " + ((CFG.curriculum || []).map(function (m) { return esc(m.title).toLowerCase(); }).join(", ") || "market fundamentals, analysis and risk management") + ". Each module is listed in full in the curriculum section above."],

      ["Will I learn technical analysis?",
       "Yes. Technical analysis covers candlestick charts, price patterns, trends and commonly used indicators — including what each indicator does and does not tell you."],

      ["Does the course cover fundamental analysis?",
       "Yes. Fundamental analysis covers company financial information, sector context and valuation concepts, so you can compare it against the technical approach rather than treating either as the whole picture."],

      ["Will risk management be included?",
       "Yes, and it is treated as core rather than optional. The module covers stop-losses, position sizing, risk–reward ratios and the trading psychology that affects whether people actually stick to their own rules."],

      ["Does the course include practical market observation?",
       (CFG.features || []).some(function (f) { return f.id === "liveMarket" && f.included; })
         ? "Yes. Live market observation is part of the programme, alongside reviewing analysis afterwards so decisions can be examined rather than just made. Practical work is educational — it does not remove market risk."
         : "Practical market work is part of the learning approach. For exactly what is included in the current batch, " + enquire],

      ["What is the course duration?",
       set(C.duration) ? "The course runs for " + esc(C.duration) + "." : "Duration can vary between batches, so rather than publish a figure that may be out of date — " + enquire],

      ["What is the course fee?",
       set(C.fee) ? "The course fee is " + esc(C.fee) + "." : "Fees are confirmed at the time of admission. " + enquire],

      ["Which languages are used for teaching?",
       langs ? "Teaching is conducted in " + langs + "." : "For current teaching languages, " + enquire],

      ["Are learning materials provided?",
       hasMats ? "Yes — see the included list above for exactly what comes with the course." : "Materials can vary by batch. " + enquire],

      ["Is a certificate provided?",
       hasCert ? "Yes, a course completion certificate is issued, subject to the completion requirements explained during the course." : "For the current position on certification, " + enquire],

      ["How can I enquire about the next batch?",
       "Use the <a href=\"#enquiry\">enquiry form</a> on this page" + (hasWhatsApp() ? ", or message us on WhatsApp" : "") + ". Share your name, number and preferred contact method, and we will get back to you with batch details." +
       (set(C.mode) && mode ? " Training is delivered through " + mode + "." : "")]
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
    if (cr) cr.textContent = "© " + new Date().getFullYear() + " " +
      (C.academy || "Lord Sai Investment & Share Market Academy") + ". All rights reserved.";
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

  function showStatus(kind, msg) {
    if (!statusBox) return;
    statusBox.hidden = false;
    statusBox.className = "form-status is-" + kind;
    statusBox.textContent = msg;
  }
  function fieldErr(input, errId, msg) {
    var e = document.getElementById(errId);
    if (input) input.setAttribute("aria-invalid", "true");
    if (e) { if (msg) e.textContent = msg; e.hidden = false; }
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
      fieldErr(name, "eName", "Please enter your full name."); ok = false; first = first || name;
    }
    var digits = mobile.value.replace(/\D/g, "");
    var mobileOk = code.value === "+91" ? /^[6-9]\d{9}$/.test(digits) : /^\d{6,14}$/.test(digits);
    if (!mobileOk) { fieldErr(mobile, "eMobile", "Please enter a valid mobile number."); ok = false; first = first || mobile; }

    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      fieldErr(email, "eEmail", "Please enter a valid email address, or leave this blank."); ok = false; first = first || email;
    }
    if (!method) {
      fieldErr(null, "eMethod", "Please choose how you would like to be contacted."); ok = false;
    } else if (method.value === "email" && !email.value.trim()) {
      fieldErr(email, "eEmail", "Please enter your email address to be contacted by email."); ok = false; first = first || email;
    }
    if (!consent.checked) {
      fieldErr(consent, "eConsent", "Please tick the consent box so we are permitted to contact you."); ok = false; first = first || consent;
    }
    if (first) { try { first.focus(); } catch (e) {} }
    return ok;
  }

  function collect() {
    var m = $("input[name='contactMethod']:checked");
    var exp = $("#fExperience"), lang = $("#fLanguage");
    return {
      name: $("#fName").value.trim(),
      countryCode: $("#fCode").value,
      mobile: $("#fMobile").value.replace(/\D/g, ""),
      email: $("#fEmail").value.trim(),
      contactMethod: m ? m.value : "",
      contactMethodLabel: m ? $("span", m.parentElement).textContent : "",
      experience: exp.value,
      experienceLabel: exp.value ? exp.options[exp.selectedIndex].text : "",
      preferredLanguage: lang.value,
      preferredLanguageLabel: lang.value ? lang.options[lang.selectedIndex].text : "",
      message: $("#fMessage").value.trim(),
      consent: $("#fConsent").checked,
      course: C.name || "",
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString()
    };
  }

  function waText(d) {
    var L = ["Share Market Course Enquiry", "", "Name: " + d.name, "Mobile: " + d.countryCode + " " + d.mobile];
    if (d.email) L.push("Email: " + d.email);
    if (d.experienceLabel) L.push("Experience: " + d.experienceLabel);
    if (d.preferredLanguageLabel) L.push("Preferred language: " + d.preferredLanguageLabel);
    L.push("Preferred contact: " + d.contactMethodLabel);
    if (d.message) L.push("", "Message: " + d.message);
    return L.join("\n");
  }

  function setBusy(on) {
    busy = on;
    if (!submitBtn) return;
    submitBtn.classList.toggle("is-busy", on);
    submitBtn.disabled = on;
  }

  function bindForm() {
    if (!form) return;

    /* Label the button for what it will actually do */
    var label = $(".btn-label", submitBtn), hint = $("#waHint");
    if (!hasEndpoint() && hasWhatsApp()) {
      if (label) label.textContent = "Send Enquiry on WhatsApp";
      if (hint) hint.hidden = false;
    }

    [["fName","eName"],["fMobile","eMobile"],["fEmail","eEmail"],["fConsent","eConsent"]].forEach(function (p) {
      var el = document.getElementById(p[0]);
      if (!el) return;
      el.addEventListener(el.type === "checkbox" ? "change" : "input", function () { clearErr(el, p[1]); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;                        /* blocks accidental double submit */
      if (statusBox) statusBox.hidden = true;

      if (!validate()) { showStatus("error", "Please correct the highlighted fields."); return; }
      var data = collect();

      /* Path A — a real backend is configured */
      if (hasEndpoint()) {
        setBusy(true);
        showStatus("pending", "Sending your enquiry…");
        var headers = { "Content-Type": "application/json" };
        Object.keys(CFG.enquiryHeaders || {}).forEach(function (k) { headers[k] = CFG.enquiryHeaders[k]; });

        fetch(CFG.enquiryEndpoint, { method: "POST", headers: headers, body: JSON.stringify(data) })
          .then(function (res) {
            setBusy(false);
            if (res.ok) {
              showStatus("success", "Thank you for your interest in " + (C.academy || "Lord Sai Share Market Academy") +
                ". Your enquiry has been submitted successfully. Our team will contact you using your selected contact method.");
              form.reset();
              $$("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
              applyWhatsApp();
            } else {
              showStatus("error", "Your enquiry could not be submitted. Your details have been kept in the form — please try again.");
            }
          })
          .catch(function () {
            setBusy(false);
            showStatus("error", "We could not reach the server. Please check your connection and try again. Your details have been kept in the form.");
          });
        return;
      }

      /* Path B — no backend, WhatsApp available */
      if (hasWhatsApp()) {
        var win = window.open(waLink(waText(data)), "_blank", "noopener");
        if (win) showStatus("info", "WhatsApp has been opened with your details. Your enquiry reaches us once you press send inside WhatsApp.");
        else showStatus("error", "WhatsApp could not be opened — your browser may have blocked it. Please allow pop-ups and try again.");
        return;
      }

      /* Path C — nothing configured */
      showStatus("info", "This form is not connected to an enquiry destination yet, so your details were not sent anywhere. Nothing has been submitted or stored.");
      if (window.console && console.warn) {
        console.warn("[Lord Sai Course] No enquiry destination configured. Set LS_COURSE.enquiryEndpoint " +
                     "and/or LS_COURSE.whatsappNumber in js/course-config.js. Nothing was sent or stored.");
      }
    });
  }

  /* ===========================================================================
     11. BOOT
     ======================================================================== */
  function init() {
    applyWhatsApp();
    renderFacts();
    renderHeroFacts();
    renderCurriculum();
    renderFeatures();
    renderProof();
    renderFaqs();
    renderContact();
    renderReviewBanner();
    bindScroll();
    bindForm();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
