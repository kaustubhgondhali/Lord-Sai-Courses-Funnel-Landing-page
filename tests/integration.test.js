/* Integration test — loads index.html with its real scripts in a DOM and checks
   the funnel, the accordions, the config-driven hiding, and every form path.
   Run:  npm install jsdom && node tests/integration.test.js                  */

const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
let pass = 0, fail = 0, consoleErrors = [];

function check(label, cond, extra) {
  if (cond) { pass++; console.log("  PASS  " + label); }
  else { fail++; console.log("  FAIL  " + label + (extra !== undefined ? "   got: " + JSON.stringify(extra) : "")); }
}

async function boot(patch) {
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => consoleErrors.push("jsdomError: " + e.message));
  vc.on("error", (...a) => consoleErrors.push("console.error: " + a.join(" ")));

  const dom = await JSDOM.fromFile(path.join(ROOT, "index.html"), {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(win) {
      win.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
      win.scrollTo = () => {};
      win.matchMedia = () => ({ matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} });
      if (patch) {
        let real;
        Object.defineProperty(win, "LS_COURSE", {
          configurable: true,
          get() { return real; },
          set(v) {
            real = v;
            Object.keys(patch).forEach(k => {
              if (k === "course") Object.assign(real.course, patch.course);
              else real[k] = patch[k];
            });
          }
        });
      }
    }
  });
  await new Promise(r => dom.window.document.readyState === "complete" ? r() : dom.window.addEventListener("load", r));
  await new Promise(r => setTimeout(r, 120));
  return dom;
}

(async function run() {

  console.log("\n[1] Default load — nothing invented, everything unset is hidden");
  let dom = await boot();
  let w = dom.window, d = w.document, $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];

  check("hero headline present", /Extra Income From the Share Market\? Learn the Skill/.test($("h1").textContent), $("h1").textContent.slice(0,60));
  check("cyan highlight wraps the key phrase", $("h1 .hl").textContent === "Extra Income", $("h1 .hl") && $("h1 .hl").textContent);
  check("brand badge shown", /Lord Sai Share Market Academy/.test($(".brand-badge").textContent));
  check("hero quick facts come from config", !$("#heroFacts").hidden && /Beginner to Intermediate/.test($("#heroFacts").textContent) && /Marathi and English/.test($("#heroFacts").textContent));
  check("6 problem cards", $$("#problems .card").length === 6, $$("#problems .card").length);
  check("6 consequences listed", $$(".consequence-list li").length === 6, $$(".consequence-list li").length);
  check("transition quote present", /not a shortcut to profits/.test($(".transition-quote").textContent));
  check("6 outcome cards", $$("#outcomes .card").length === 6, $$("#outcomes .card").length);
  check("6-step journey timeline", $$(".timeline li").length === 6, $$(".timeline li").length);
  check("3-step progression visual", $$(".progression > li:not(.pg-arrow)").length === 3);

  console.log("\n[2] Course facts — supplied values shown, unverified ones omitted");
  const factText = $("#courseFacts").textContent;
  check("course name shown", /Share Market Education & Training/.test(factText));
  check("location shown", /Uran, Navi Mumbai/.test(factText));
  check("languages shown", /Marathi and English/.test(factText));
  check("NO fee invented", !/Fee/.test(factText), factText.slice(0,120));
  check("NO duration invented", !/Duration/.test(factText));
  check("enquire-instead note visible while fee/duration unset", !$("#factsEnquireNote").hidden);

  console.log("\n[3] Curriculum and features");
  check("6 modules rendered from config", $$(".module").length === 6, $$(".module").length);
  check("module numbering starts at 01", $(".mod-n").textContent === "01", $(".mod-n").textContent);
  check("first module titled from config", /Basics of Share Market/.test($(".mod-title").textContent));
  check("module descriptions shown without clicking", $$(".module p").length === 6 && $$(".module p").every(p => p.textContent.trim() !== ""));
  check("only included features render", $$("#featureList li").length === 3, $$("#featureList li").length);
  check("un-included feature absent", !/certificate/i.test($("#featureList").textContent));
  check("features section visible (3 are included)", !$("#features").hidden);

  console.log("\n[4] FAQs defer instead of inventing");
  check("13 FAQs rendered", $$(".faq-item").length === 13, $$(".faq-item").length);
  const faqText = $("#faqList").textContent;
  check("fee FAQ points at the enquiry form", /Fees are confirmed at the time of admission/.test(faqText));
  check("duration FAQ avoids a made-up figure", /Duration can vary between batches/.test(faqText));
  check("languages FAQ uses the configured value", /Teaching is conducted in Marathi and English/.test(faqText));
  check("certificate FAQ defers while unconfirmed", /current position on certification/.test(faqText));
  check("topics FAQ lists real module titles", /technical analysis/.test(faqText));

  console.log("\n[5] WhatsApp controls hidden when no number is set");
  check("no WhatsApp buttons visible", $$(".js-wa").every(e => e.hidden), $$(".js-wa").filter(e => !e.hidden).length);
  check("hero's main CTA goes to the enquiry form", $(".hero .btn-primary").getAttribute("href") === "#enquiry");
  check("WhatsApp contact-method radio hidden", $(".js-wa-radio").hidden);
  check("footer says contact details not published", !$("#fcNone").hidden);
  check("policy links hidden", $("#footPolicy").hidden);
  check("no review banner on the page", !$("#reviewBanner"));

  console.log("\n[6] FAQ accordion");
  const q1 = $$(".faq-q")[0], q2 = $$(".faq-q")[1];
  q1.click();
  check("FAQ opens on click", q1.getAttribute("aria-expanded") === "true" && !$("#faq1").hidden);
  q2.click();
  check("opening another closes the first", $("#faq1").hidden && !$("#faq2").hidden);
  q2.click();
  check("clicking again collapses", q2.getAttribute("aria-expanded") === "false");

  console.log("\n[7] Funnel links all resolve");
  const ids = new Set($$("[id]").map(e => e.id));
  const dead = $$('a[href^="#"]').map(a => a.getAttribute("href").slice(1)).filter(h => h && !ids.has(h));
  check("no dead in-page links", dead.length === 0, dead);
  check("no site navigation menu", !$("#primaryNav") && !$("#navToggle"));
  check("header CTA goes to the enquiry form", $(".header-cta").getAttribute("href") === "#enquiry");
  check("sticky bar CTA goes to the enquiry form", $("#stickyCta a").getAttribute("href") === "#enquiry");

  console.log("\n[8] Form validation");
  const form = $("#enquiryForm"), status = $("#formStatus");
  const submit = () => form.dispatchEvent(new w.Event("submit", { bubbles:true, cancelable:true }));

  submit();
  check("empty form blocked", !$("#eName").hidden && !$("#eConsent").hidden);
  check("status asks for corrections", /correct the highlighted/.test(status.textContent), status.textContent);
  $("#fName").value = "Rohit Patil";
  $("#fMobile").value = "12345"; submit();
  check("short Indian mobile rejected", !$("#eMobile").hidden);
  $("#fMobile").value = "5999999999"; submit();
  check("Indian mobile not starting 6-9 rejected", !$("#eMobile").hidden);
  $("#fMobile").value = "9876543210"; submit();
  check("valid Indian mobile accepted", $("#eMobile").hidden);
  $("#fEmail").value = "bad@"; submit();
  check("malformed email rejected", !$("#eEmail").hidden);
  $("#fEmail").value = ""; submit();
  check("blank email allowed", $("#eEmail").hidden);
  d.querySelector('input[name="contactMethod"][value="email"]').checked = true;
  d.querySelector('input[name="contactMethod"][value="phone"]').checked = false;
  submit();
  check("email method without an email caught", !$("#eEmail").hidden);
  d.querySelector('input[name="contactMethod"][value="phone"]').checked = true;
  d.querySelector('input[name="contactMethod"][value="email"]').checked = false;
  submit();
  check("consent still required", !$("#eConsent").hidden);
  check("no success claimed while invalid", !/successfully/.test(status.textContent));

  console.log("\n[9] Submission paths are honest");
  $("#fConsent").checked = true; submit();
  check("unconfigured → says nothing was sent", /not connected|were not sent/.test(status.textContent), status.textContent);
  check("…never claims success", !/successfully/i.test(status.textContent));
  check("…keeps the typed values", $("#fName").value === "Rohit Patil" && $("#fMobile").value === "9876543210");

  /* WhatsApp configured */
  dom.window.close();
  dom = await boot({ whatsappNumber: "919876543210" });
  w = dom.window; d = w.document; $ = s => d.querySelector(s); $$ = s => [...d.querySelectorAll(s)];
  let opened = null;
  w.open = u => { opened = u; return { focus(){} }; };
  check("WhatsApp buttons appear", $$(".js-wa").filter(e => !e.hidden).length >= 3, $$(".js-wa").filter(e => !e.hidden).length);
  check("hero WhatsApp button appears", !$(".hero .js-wa").hidden);
  check("WhatsApp radio appears", !$(".js-wa-radio").hidden);
  check("header WhatsApp link points at wa.me", $(".header-wa").href.startsWith("https://wa.me/919876543210"), $(".header-wa").href.slice(0,40));
  check("submit button relabelled for WhatsApp", /WhatsApp/.test($("#submitBtn .btn-label").textContent), $("#submitBtn .btn-label").textContent);
  $("#fName").value = "Rohit Patil"; $("#fMobile").value = "9876543210"; $("#fConsent").checked = true;
  $("#fExperience").value = "beginner"; $("#fLanguage").value = "marathi";
  $("#enquiryForm").dispatchEvent(new w.Event("submit", { bubbles:true, cancelable:true }));
  check("opens a prefilled wa.me link", !!opened && opened.startsWith("https://wa.me/919876543210?text="));
  check("prefill carries name and language", /Rohit Patil/.test(decodeURIComponent(opened||"")) && /Marathi/.test(decodeURIComponent(opened||"")));
  check("status says opened, not submitted", /WhatsApp has been opened/.test($("#formStatus").textContent) && !/successfully/.test($("#formStatus").textContent));

  /* Endpoint configured */
  dom.window.close();
  dom = await boot({ enquiryEndpoint: "https://api.example.test/enquiry" });
  w = dom.window; d = w.document; $ = s => d.querySelector(s);
  const fill = () => { $("#fName").value="Rohit Patil"; $("#fMobile").value="9876543210"; $("#fConsent").checked=true; };
  let captured = null;
  w.fetch = (url, opts) => { captured = { url, opts }; return Promise.resolve({ ok:false, status:500 }); };
  fill(); $("#enquiryForm").dispatchEvent(new w.Event("submit", { bubbles:true, cancelable:true }));
  await new Promise(r => setTimeout(r, 60));
  check("POSTs JSON to the endpoint", captured && captured.opts.method === "POST" && JSON.parse(captured.opts.body).name === "Rohit Patil");
  check("payload carries the course name", JSON.parse(captured.opts.body).course === "Share Market Education & Training");
  check("HTTP 500 → error, not success", /could not be submitted/.test($("#formStatus").textContent) && !/successfully/.test($("#formStatus").textContent));
  check("values preserved after failure", $("#fName").value === "Rohit Patil");
  w.fetch = () => Promise.reject(new Error("offline"));
  $("#enquiryForm").dispatchEvent(new w.Event("submit", { bubbles:true, cancelable:true }));
  await new Promise(r => setTimeout(r, 60));
  check("network failure → connection message", /could not reach the server/.test($("#formStatus").textContent));
  w.fetch = () => Promise.resolve({ ok:true, status:200 });
  fill(); $("#enquiryForm").dispatchEvent(new w.Event("submit", { bubbles:true, cancelable:true }));
  await new Promise(r => setTimeout(r, 60));
  check("HTTP 200 → success shown", /submitted successfully/.test($("#formStatus").textContent));
  check("form cleared after genuine success", $("#fName").value === "");

  console.log("\n[10] Fully configured — facts appear, FAQs stop deferring");
  dom.window.close();
  dom = await boot({
    enquiryEndpoint: "/api/enquiry", whatsappNumber: "919876543210",
    contactPhone: "+91 98765 43210", contactEmail: "info@example.test",
    contactAddress: "Uran, Navi Mumbai", privacyPolicyUrl: "/privacy.html",
    course: { duration: "8 weeks", fee: "₹12,000", batchNote: "New batches monthly" }
  });
  w = dom.window; d = w.document; $ = s => d.querySelector(s);
  const ft = $("#courseFacts").textContent;
  check("duration now shown", /8 weeks/.test(ft));
  check("fee now shown", /₹12,000/.test(ft));
  check("enquire-instead note now hidden", $("#factsEnquireNote").hidden);
  check("fee FAQ now states the fee", /The course fee is ₹12,000/.test($("#faqList").textContent));
  check("duration FAQ now states it", /runs for 8 weeks/.test($("#faqList").textContent));
  check("contact details render", !$("#fcPhone").hidden && !$("#fcEmail").hidden && $("#fcNone").hidden);
  check("policy links render", !$("#footPolicy").hidden && !$("#footPrivacy").hidden);

  console.log("\n[11] Language switch — Marathi and Hindi");
  const sel = $("#langSelect");
  sel.value = "mr"; sel.dispatchEvent(new w.Event("change"));
  check("html lang becomes mr", d.documentElement.lang === "mr");
  check("headline in Marathi", /अतिरिक्त उत्पन्न/.test($("h1").textContent), $("h1").textContent.slice(0,40));
  check("curriculum from config in Marathi", /शेअर मार्केटची मूलतत्त्वे/.test(d.querySelector(".mod-title").textContent));
  check("fee now stated in Marathi FAQ", /कोर्सची फी ₹12,000 आहे/.test($("#faqList").textContent));
  sel.value = "hi"; sel.dispatchEvent(new w.Event("change"));
  check("headline in Hindi", /अतिरिक्त आमदनी/.test($("h1").textContent));
  check("placeholders translated", $("#fName").getAttribute("placeholder") === "आपका पूरा नाम");
  sel.value = "en"; sel.dispatchEvent(new w.Event("change"));
  check("back to English", /Extra Income/.test($("h1").textContent) && d.documentElement.lang === "en");

  console.log("\n[12] Console cleanliness");
  const real = consoleErrors.filter(e => !/Could not parse CSS|Not implemented|fonts\.googleapis|css/i.test(e));
  check("no page errors raised", real.length === 0, real.slice(0,4));

  console.log("\n  " + pass + " passed, " + fail + " failed\n");
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error("HARNESS ERROR:", e); process.exit(1); });
