(function () {
  "use strict";

  var S = window.SITE;
  var P = window.PROJECTS || [];
  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EASE = "cubic-bezier(.2,.8,.2,1)";

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // ---------- State ----------
  var lang = root.lang === "en" ? "en" : "ar";
  var hashFor = (location.hash.match(/for=([a-z]+)/) || [])[1];
  var sectorParam = (params.get("for") || hashFor || "").toLowerCase();
  var sector = S.sectors.indexOf(sectorParam) > -1 ? sectorParam : null;
  var filter = sector || "all";
  var gatePlayed = false;

  // ---------- Helpers ----------
  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }
  function t(key) { var v = S.i18n[lang][key]; return v === undefined ? S.i18n.ar[key] : v; }
  function L(obj) { return obj ? (obj[lang] !== undefined ? obj[lang] : obj.ar) : ""; }
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var ICON = {
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>',
    doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    redo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4"/></svg>',
    play: '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>'
  };

  // ---------- Reveal on scroll ----------
  var revealIO = null;
  var onReveal = {};
  function reveal(el) {
    el.classList.add("in");
    el.classList.remove("enter");
    if (el.id && onReveal[el.id]) onReveal[el.id](el);
  }
  if ("IntersectionObserver" in window && !reduceMotion) {
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { reveal(en.target); revealIO.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  }
  function watch(el) { if (!el) return; if (revealIO) revealIO.observe(el); else reveal(el); }

  // ---------- i18n ----------
  function applyI18n() {
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    $$("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    $$("[data-i18n-alt]").forEach(function (el) { el.setAttribute("alt", t(el.getAttribute("data-i18n-alt"))); });
    $$(".js-lang").forEach(function (b) { b.setAttribute("aria-label", t("lang_other")); b.setAttribute("lang", lang === "ar" ? "en" : "ar"); });
    document.title = t("brand") + " | " + t("hero_role");

    var hs = $("#hero-sector");
    if (sector) { hs.textContent = t("sector_" + sector); hs.hidden = false; } else { hs.hidden = true; }

    var c = S.contact;
    $$(".js-phone").forEach(function (a) { a.href = c.phoneHref; a.textContent = c.phoneDisplay; });
    $$(".js-email").forEach(function (a) { a.href = "mailto:" + c.email; a.textContent = c.email; });
    $$(".js-email-icon").forEach(function (a) { a.href = "mailto:" + c.email; });
    $$(".js-linkedin").forEach(function (a) { a.href = c.linkedin; });
    $$(".js-wa").forEach(function (a) { a.href = "https://wa.me/" + c.whatsapp; });
    $$(".js-cv-ar").forEach(function (a) { a.href = c.cvAr; });
    $$(".js-cv-en").forEach(function (a) { a.href = c.cvEn; });
    splitHeadline();
  }

  function splitHeadline() {
    var h = $("#hero-title");
    var words = t("hero_title").split(/\s+/);
    h.setAttribute("aria-label", t("hero_title"));
    h.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--wd:' + (120 + i * 60) + 'ms">' + esc(w) + "</span></span>";
    }).join(" ");
  }

  function introHero() {
    $$(".hero .intro").forEach(function (el, i) { el.style.setProperty("--d", (520 + i * 90) + "ms"); });
    requestAnimationFrame(function () { setTimeout(function () { $("#hero").classList.add("ready"); }, 60); });
  }

  // ---------- Signature: stage-gate ----------
  var gateTimers = [];
  function buildGate() {
    var loops = [4, 5, 8, 9, 12];
    var before = "";
    for (var i = 1; i <= 14; i++) {
      before += loops.indexOf(i) > -1 ? '<span class="g-cell loop">' + ICON.redo + "</span>" : '<span class="g-cell"></span>';
    }
    $("#g-before").innerHTML = before;
    var after = "";
    for (var j = 0; j < 4; j++) after += '<span class="g-stage">' + ICON.check + "</span>";
    after += '<span class="g-saved">' + esc(t("gate_saved")) + "</span>";
    $("#g-after").innerHTML = after;
    $("#g-stages").innerHTML = t("stages").map(function (s, k) {
      return '<li><span class="n">' + (k + 1) + "</span>" + esc(s) + "</li>";
    }).join("");
    if (gatePlayed) setGate(4, true);
  }
  function setGate(n, saved) {
    $$("#g-after .g-stage").forEach(function (el, k) { el.classList.toggle("on", k < n); });
    $$("#g-stages li").forEach(function (el, k) { el.classList.toggle("on", k < n); });
    $("#g-after .g-saved").classList.toggle("on", !!saved);
    $$("#g-before .loop").forEach(function (el) { el.classList.toggle("spin", !saved && gateTimers.length > 0); });
  }
  function playGate() {
    gateTimers.forEach(clearTimeout);
    gateTimers = [];
    gatePlayed = true;
    if (reduceMotion) { setGate(4, true); return; }
    gateTimers.push(0);
    setGate(0, false);
    for (var k = 1; k <= 4; k++) {
      (function (n) { gateTimers.push(setTimeout(function () { setGate(n, false); }, 500 + n * 620)); })(k);
    }
    gateTimers.push(setTimeout(function () { gateTimers = []; setGate(4, true); }, 500 + 5 * 620));
  }

  // ---------- Dhimma ----------
  function dhimmaMock() {
    var groups = [
      [lang === "ar" ? "الرئيسية" : "Home", lang === "ar" ? ["لوحة التحكم", "يومي", "المهام"] : ["Dashboard", "My day", "Tasks"]],
      [L(S.dhimma.modules[1].title), L(S.dhimma.modules[1].items)],
      [L(S.dhimma.modules[2].title), L(S.dhimma.modules[2].items)],
      [L(S.dhimma.modules[3].title), L(S.dhimma.modules[3].items)]
    ];
    var side = '<div class="app-side"><span class="app-brand">' + esc(t("dh_name")) + "</span>";
    groups.forEach(function (g, gi) {
      side += '<span class="app-g">' + esc(g[0]) + "</span>";
      g[1].forEach(function (it, ii) { side += '<span class="app-i' + (gi === 0 && ii === 0 ? " cur" : "") + '">' + esc(it) + "</span>"; });
    });
    side += "</div>";
    var kpis = '<div class="app-kpis">' + t("dh_kpis").map(function (k) {
      return '<div class="app-kpi"><small>' + esc(k) + "</small><i></i></div>";
    }).join("") + "</div>";
    var hs = [82, 56, 36, 22];
    var bars = '<div class="app-card"><small>' + esc(t("dh_aging_title")) + '</small><div class="app-bars">' + t("dh_aging").map(function (a, i) {
      return '<div class="app-bar"><b style="--h:' + hs[i] + "%;--bd:" + (200 + i * 120) + 'ms"></b><span>' + esc(a) + "</span></div>";
    }).join("") + "</div></div>";
    var tasks = '<div class="app-card"><small>' + esc(t("dh_day_title")) + '</small><div class="app-tasks">' + t("dh_day").map(function (d, i) {
      return '<div class="app-task" style="--td:' + (500 + i * 140) + 'ms"><i style="width:' + [78, 64, 70][i] + '%"></i><span class="app-pill ' + d[1] + '">' + esc(d[0]) + "</span></div>";
    }).join("") + "</div></div>";
    var latest = '<div class="app-card app-latest"><small>' + esc(t("dh_latest")) + "</small>" + [0, 1, 2].map(function (i) {
      return '<div class="app-lrow" style="--td:' + (700 + i * 120) + 'ms"><span class="app-av"></span><i style="width:' + [46, 58, 38][i] + '%"></i><em></em></div>';
    }).join("") + "</div>";
    var main = '<div class="app-main"><div class="app-head"><b>' + esc(t("dh_head")) + "</b><small>" + esc(t("dh_sub")) + "</small></div>" +
      kpis + '<div class="app-row">' + bars + tasks + "</div>" + latest + "</div>";
    return '<div class="app" aria-hidden="true">' + side + main + "</div>";
  }
  // ---------- Ledger ----------
  function renderLedger() {
    $("#ledger-body").innerHTML = S.ledger.map(function (r, i) {
      return '<tr style="--d:' + (i * 110) + 'ms"><td class="l-result">' + esc(L(r.result)) + '</td><td class="l-context">' + esc(L(r.context)) +
        '</td><td class="l-where">' + esc(L(r.where)) + "</td></tr>";
    }).join("");
  }
  function countUp(el, delay) {
    var orig = el.textContent;
    if (!/\d/.test(orig) || reduceMotion) return;
    var t0 = null, dur = 1400;
    function fmt(m, v) { return m.indexOf(",") > -1 ? v.toLocaleString("en-US") : String(v); }
    function frame(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = orig.replace(/\d[\d,]*/g, function (m) { return fmt(m, Math.round(parseInt(m.replace(/,/g, ""), 10) * e)); });
      if (p < 1) requestAnimationFrame(frame); else el.textContent = orig;
    }
    el.textContent = orig.replace(/\d[\d,]*/g, function (m) { return fmt(m, 0); });
    setTimeout(function () { requestAnimationFrame(frame); }, delay || 0);
  }
  onReveal["ledger-wrap"] = function () {
    $$("#ledger-body .l-result").forEach(function (el, i) { countUp(el, 150 + i * 110); });
  };

  // ---------- Timeline ----------
  function renderTimeline() {
    var n = S.timeline.length;
    $("#timeline").innerHTML = S.timeline.map(function (r, i) {
      return '<li class="' + (i === n - 1 ? "now" : "") + '" style="--d:' + (250 + i * 130) + 'ms"><div class="t-year"><span dir="' + (/[\u0600-\u06FF]/.test(L(r.year)) ? "rtl" : "ltr") + '">' + esc(L(r.year)) +
        '</span></div><div class="t-role">' + esc(L(r.role)) + "</div>" + (r.org ? '<div class="t-org">' + esc(L(r.org)) + "</div>" : "") +
        (r.desc ? '<p class="t-desc">' + esc(L(r.desc)) + "</p>" : "") + "</li>";
    }).join("");
  }

  // ---------- Projects ----------
  var TRACKS = {};
  P.forEach(function (p) {
    if (p.visual && p.visual.type === "audio") {
      p.visual.tracks.forEach(function (tr, i) { TRACKS[p.id + ":" + i] = { src: tr.src, title: tr.title }; });
    }
  });

  function mockHTML(name) {
    if (name === "dhimma") return dhimmaMock();
    if (name === "dub") {
      var st = t("stages");
      var rows = [["fr", "ok", "ok", "ok", "ok"], ["ur", "ok", "ok", "ok", "half"], ["id", "ok", "ok", "half", ""]];
      var html = '<div class="mk-dhead"><span></span>' + st.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div>";
      rows.forEach(function (r, ri) {
        html += '<div class="mk-drow"><span class="mk-lang" dir="ltr">' + r[0] + "</span>" +
          r.slice(1).map(function (s, ci) { return '<span class="mk-dot ' + s + '" style="--dd:' + (300 + ri * 160 + ci * 90) + 'ms"></span>'; }).join("") + "</div>";
      });
      html += '<div class="mk-alert">' + esc(t("dub_alert")) + "</div>";
      return '<div class="mock mock-dub" aria-hidden="true">' + html + "</div>";
    }
    if (name === "leads") {
      return '<div class="mock mock-leads" aria-hidden="true">' +
        '<div class="mk-lrow"><span class="num">7,000<small>' + esc(t("leads_raw")) + '</small></span><span class="mk-track"><b></b></span></div>' +
        '<div class="mk-lrow q"><span class="num">3,000<small>' + esc(t("leads_q")) + '</small></span><span class="mk-track"><b></b></span></div>' +
        '<div class="mk-tags"><span class="city">' + esc(t("leads_cities")) + "</span>" +
        t("leads_seg").map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div></div>";
    }
    if (name === "tea") {
      return '<div class="mock mock-tea" aria-hidden="true"><svg viewBox="0 0 200 160">' +
        '<path class="steam" d="M70 44c-7-9 7-15 0-25" stroke="#F3E3C3" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path class="steam" d="M90 44c-7-9 7-15 0-25" stroke="#F3E3C3" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path class="steam" d="M110 44c-7-9 7-15 0-25" stroke="#F3E3C3" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M40 58h100v18a50 50 0 0 1-100 0z" fill="#F3E3C3"/>' +
        '<path d="M140 66h8a15 15 0 0 1 0 30h-12" stroke="#F3E3C3" stroke-width="7" fill="none"/>' +
        '<ellipse cx="90" cy="58" rx="50" ry="7" fill="#B9772A"/>' +
        '<ellipse cx="90" cy="134" rx="68" ry="8" fill="#E1B86A"/>' +
        '<g class="leaf"><path d="M148 28c22-5 35 7 38 26-19 5-35-4-38-26z" fill="#86C796"/>' +
        '<path d="M151 31l31 21" stroke="#2F5A3E" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
        "</svg></div>";
    }
    return "";
  }

  function playersHTML(p) {
    return '<div class="players">' + p.visual.tracks.map(function (tr, i) {
      var key = p.id + ":" + i;
      return '<div class="player" data-track="' + key + '"><button class="p-btn" type="button">' + ICON.play + ICON.pause +
        '</button><div class="p-info"><span class="p-title">' + esc(L(tr.title)) + '</span><span class="p-bar"><b></b></span></div>' +
        '<span class="p-time">0:00</span></div>';
    }).join("") + "</div>";
  }
  function visualHTML(p, ctx) {
    var v = p.visual || {};
    if (v.type === "gallery") {
      if (ctx !== "dialog") return '<img src="' + esc(v.images[0].src) + '" alt="' + esc(L(v.images[0].alt)) + '" loading="lazy" decoding="async">';
      return '<div class="gal">' + v.images.map(function (im) {
        return '<figure class="gal-item"><button type="button" class="gal-zoom" data-zoom="' + esc(im.src) + '" data-zoom-cap="' + esc(L(im.caption)) + '" aria-label="' + esc(L(im.alt)) + '"><img src="' + esc(im.src) + '" alt="' + esc(L(im.alt)) + '" loading="lazy"></button><figcaption>' + esc(L(im.caption)) + "</figcaption></figure>";
      }).join("") + "</div>";
    }
    if (v.type === "sheet") return ctx === "dialog" ? sheetExplorer() : sheetMini();
    if (v.type === "phone") {
      if (ctx !== "dialog") return '<div class="phone phone-sm" aria-hidden="true"><div class="phone-screen"><img src="' + esc(v.top) + '" alt="" loading="lazy"></div></div>';
      return '<div class="ph-wrap"><figure class="ph-col"><div class="phone"><div class="phone-screen phone-scroll" tabindex="0" aria-label="' + esc(L(v.alt)) + '"><img src="' + esc(v.src) + '" alt="' + esc(L(v.alt)) + '"></div></div>' +
        '<figcaption class="ph-hint">' + esc(t("phone_hint")) + "</figcaption></figure>" + (p.calculator ? calcHTML() : "") + "</div>";
    }
    if (v.type === "image") return '<img src="' + esc(v.src) + '" alt="' + esc(L(v.alt)) + '" loading="lazy" decoding="async">';
    if (v.type === "audio") return playersHTML(p);
    if (v.type === "mock") return mockHTML(v.name);
    return "";
  }
  function visualClass(p, ctx) {
    var ty = p.visual && p.visual.type;
    if (ty === "audio") return " v-audio";
    if (ty === "sheet" && ctx === "dialog") return " v-sheet";
    if (ty === "phone") return ctx === "dialog" ? " v-phone" : " v-phone-card";
    if (ty === "gallery") return ctx === "dialog" ? " v-gallery" : " v-shot";
    if (ty === "mock" && p.visual.name === "dhimma") return ctx === "dialog" ? " v-app" : " v-app-card";
    return "";
  }
  function metaHTML(p) {
    return (p.own ? '<span class="own">' + esc(t("dh_own")) + "</span>" : "") +
      (p.client ? "<span>" + esc(L(p.client)) + "</span>" : "") +
      (p.status ? '<span class="badge">' + esc(L(p.status)) + "</span>" : "") +
      (p.note ? '<span class="vis-tag">' + esc(L(p.note)) + "</span>" : "") +
      (p.visual && p.visual.type === "mock" && p.visual.name !== "tea" ? '<span class="vis-tag">' + esc(t("illustrative")) + "</span>" : "");
  }

  // ---------- Cash-release calculator (Dhimma) ----------
  var calcState = { r: 500000, d: 75, g: 45 };
  function money(n) {
    var s = (Math.round(n * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return lang === "ar" ? s + " " + t("currency_ar") : t("currency_ar") + " " + s;
  }
  function calcHTML() {
    return '<div class="calc" data-calc><h3 class="calc-h">' + esc(t("calc_title")) + '</h3><p class="calc-lead">' + esc(t("calc_lead")) + "</p>" +
      '<label class="calc-f"><span>' + esc(t("calc_recv")) + '</span><input type="number" inputmode="numeric" min="0" step="1000" data-c="r" value="' + calcState.r + '"></label>' +
      '<label class="calc-f"><span>' + esc(t("calc_dso")) + '</span><input type="number" inputmode="numeric" min="1" max="365" data-c="d" value="' + calcState.d + '"></label>' +
      '<label class="calc-f calc-range"><span>' + esc(t("calc_target")) + ' <b data-c-out="g"></b></span><input type="range" min="5" step="1" data-c="g"><small data-c-out="faster"></small></label>' +
      '<div class="calc-out"><div><small>' + esc(t("calc_locked")) + '</small><b data-c-out="locked"></b></div>' +
      '<div class="calc-hero"><small>' + esc(t("calc_released")) + '</small><b data-c-out="released"></b></div>' +
      '<div class="calc-two"><div><small>' + esc(t("calc_remaining")) + '</small><b data-c-out="remaining"></b></div><div><small>' + esc(t("calc_daily")) + '</small><b data-c-out="daily"></b></div></div></div>' +
      '<div class="calc-formula"><strong>' + esc(t("calc_formula_title")) + "</strong><p>" + esc(t("calc_f1")) + "</p><p>" + esc(t("calc_f2")) + '</p><small>' + esc(t("calc_note")) + "</small></div></div>";
  }
  function bindCalc(scope) {
    var root = $("[data-calc]", scope);
    if (!root) return;
    var rng = $('[data-c="g"]', root);
    function update(flash) {
      var r = Math.max(0, calcState.r), d = Math.max(1, calcState.d);
      rng.max = String(d);
      if (calcState.g > d) calcState.g = d;
      rng.value = String(calcState.g);
      var daily = r / d, released = daily * (d - calcState.g);
      var out = function (k, v) { var el = $('[data-c-out="' + k + '"]', root); if (el) el.textContent = v; };
      out("g", calcState.g + " " + t("calc_days"));
      out("faster", t("calc_faster").replace("{n}", d - calcState.g));
      out("locked", money(r));
      out("released", money(released));
      out("remaining", money(r - released));
      out("daily", money(daily));
      if (flash) { var h = $(".calc-hero", root); h.classList.remove("pulse"); void h.offsetWidth; h.classList.add("pulse"); }
    }
    root.addEventListener("input", function (e) {
      var k = e.target.getAttribute("data-c");
      if (!k) return;
      var v = parseFloat(e.target.value);
      if (!isFinite(v)) return;
      calcState[k] = v;
      update(true);
    });
    update(false);
  }

  // ---------- Demo spreadsheet viewer ----------
  var SD = window.SHEET_DEMO || null;
  var sheetState = { tab: 0, lang: "", status: "", editor: "" };
  function stLabel(s) { var m = t("sh_status"); return (m && m[s]) || s; }
  function stClass(s) { return "st st" + Math.max(0, SD.statuses.indexOf(s)); }
  function pct(x) { return Math.round(x * 100) + "%"; }
  function sheetCalc() {
    var tasks = SD.tasks, approved = SD.statuses[4];
    var total = tasks.length;
    var done = tasks.filter(function (r) { return r[4] === approved; }).length;
    var langs = {}; tasks.forEach(function (r) { if (r[1]) langs[r[1]] = 1; });
    var eds = SD.editors.map(function (e) {
      var mine = tasks.filter(function (r) { return r[2] === e[0]; });
      var active = mine.filter(function (r) { return r[4] && r[4] !== approved; }).length;
      var appr = mine.filter(function (r) { return r[4] === approved; }).length;
      return { name: e[0], max: e[1], active: active, busy: active >= e[1], seats: Math.max(0, e[1] - active), total: mine.length, approved: appr };
    });
    var seats = eds.reduce(function (s, e) { return s + e.max; }, 0) - eds.reduce(function (s, e) { return s + e.active; }, 0);
    var dist = SD.statuses.map(function (s) { var n = tasks.filter(function (r) { return r[4] === s; }).length; return { s: s, n: n, p: total ? n / total : 0 }; });
    var avg = SD.archive.reduce(function (s, r) { return s + (r[6] || 0); }, 0) / (SD.archive.length || 1);
    return { total: total, active: total - done, done: total ? done / total : 0, langs: Object.keys(langs).length, eds: eds, seats: seats, dist: dist, avg: avg };
  }
  function sheetMini() {
    if (!SD) return "";
    var c = sheetCalc();
    var rows = SD.tasks.slice(0, 6).map(function (r, i) {
      return '<div class="ms-row"><span class="ms-n">' + (i + 4) + "</span><span>" + esc(r[0]) + "</span><span>" + esc(r[1]) + "</span><span>" + esc(r[2]) + '</span><span><i class="' + stClass(r[4]) + '">' + esc(stLabel(r[4])) + "</i></span></div>";
    }).join("");
    var cols = t("sh_cols");
    return '<div class="mock mock-sheet" aria-hidden="true">' +
      '<div class="ms-kpis"><span><b>' + c.total + "</b>" + esc(t("sh_clips")) + "</span><span><b>" + pct(c.done) + "</b>" + esc(t("sh_done_short")) + "</span><span><b>" + c.langs + "</b>" + esc(t("sh_lang_short")) + "</span></div>" +
      '<div class="ms-grid"><div class="ms-row ms-head"><span class="ms-n"></span><span>' + esc(cols[0]) + "</span><span>" + esc(cols[1]) + "</span><span>" + esc(cols[2]) + "</span><span>" + esc(cols[4]) + "</span></div>" + rows + "</div>" +
      '<div class="ms-tabs">' + t("sh_tabs").map(function (x, i) { return '<span class="' + (i === 1 ? "cur" : "") + '">' + esc(x) + "</span>"; }).join("") + "</div></div>";
  }
  function sheetExplorer() {
    if (!SD) return "";
    return '<div class="sx" data-sx>' +
      '<div class="sx-tabs" role="tablist">' + t("sh_tabs").map(function (x, i) {
        return '<button type="button" role="tab" class="sx-tab" data-sx-tab="' + i + '" aria-selected="' + (i === sheetState.tab) + '">' + esc(x) + "</button>";
      }).join("") + "</div>" +
      '<div class="sx-panel" role="tabpanel" data-sx-panel></div>' +
      '<p class="sx-demo">' + esc(t("sh_demo")) + "</p></div>";
  }
  function sxPanel(i) {
    var c = sheetCalc();
    if (i === 0) {
      var kpi = function (label, val, sub) { return '<div class="sx-kpi"><small>' + esc(label) + "</small><b>" + val + "</b>" + (sub ? "<span>" + sub + "</span>" : "") + "</div>"; };
      var avail = c.eds.filter(function (e) { return !e.busy; }).length;
      var bar = c.dist.map(function (d, k) { return '<i class="st' + k + '" style="--w:' + (d.p * 100).toFixed(2) + '%" title="' + esc(stLabel(d.s)) + '"></i>'; }).join("");
      var legend = c.dist.map(function (d, k) {
        return '<li><span class="dot st' + k + '"></span>' + esc(stLabel(d.s)) + "<b>" + d.n + "</b><em>" + pct(d.p) + "</em></li>";
      }).join("");
      return '<div class="sx-kpis">' +
        kpi(t("sh_total"), c.total) + kpi(t("sh_active"), c.active) + kpi(t("sh_done"), pct(c.done)) + kpi(t("sh_langs"), c.langs) +
        kpi(t("sh_editors"), c.eds.length, esc(avail + " " + t("sh_avail") + "، " + (c.eds.length - avail) + " " + t("sh_busy"))) + kpi(t("sh_seats"), c.seats) +
        '</div><h4 class="sx-h">' + esc(t("sh_dist")) + '</h4><div class="sx-stack">' + bar + '</div><ul class="sx-legend">' + legend + "</ul>";
    }
    if (i === 1) {
      var uniq = function (idx) { var m = {}; SD.tasks.forEach(function (r) { if (r[idx]) m[r[idx]] = 1; }); return Object.keys(m).sort(function (x, y) { return x.localeCompare(y, "ar"); }); };
      var sel = function (key, idx, all, list, labelFn) {
        return '<select data-sx-f="' + key + '" aria-label="' + esc(all) + '"><option value="">' + esc(all) + "</option>" +
          list.map(function (v) { return '<option value="' + esc(v) + '"' + (sheetState[key] === v ? " selected" : "") + ">" + esc(labelFn ? labelFn(v) : v) + "</option>"; }).join("") + "</select>";
      };
      return '<div class="sx-filters">' +
        sel("lang", 1, t("sh_all_lang"), uniq(1)) + sel("status", 4, t("sh_all_status"), SD.statuses, stLabel) + sel("editor", 2, t("sh_all_editor"), SD.editors.map(function (e) { return e[0]; })) +
        '<button type="button" class="sx-reset" data-sx-reset>' + esc(t("sh_reset")) + "</button></div>" +
        '<p class="sx-count" data-sx-count aria-live="polite"></p><div class="sx-scroll"><table class="sx-table"><thead><tr>' +
        t("sh_cols").map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody data-sx-rows></tbody></table></div>";
    }
    if (i === 2) {
      return '<p class="sx-rule">' + esc(t("sh_rule")) + '</p><ul class="sx-eds">' + c.eds.map(function (e, k) {
        var slots = ""; for (var s = 0; s < e.max; s++) slots += '<i class="' + (s < e.active ? "on" : "") + '" style="--sd:' + (k * 60 + s * 90) + 'ms"></i>';
        return '<li><span class="sx-name">' + esc(e.name) + '</span><span class="sx-slots" title="' + esc(t("sh_load")) + ": " + e.active + "/" + e.max + '">' + slots + "</span>" +
          '<span class="sx-pill ' + (e.busy ? "busy" : "free") + '">' + esc(e.busy ? t("sh_busy") : t("sh_avail")) + '</span><span class="sx-seats">' + e.seats + " " + esc(t("sh_seats_left")) + "</span></li>";
      }).join("") + "</ul>" +
      '<div class="sx-formula"><small>' + esc(t("sh_formula")) + '</small>' +
        '<p><code dir="ltr">COUNTIFS</code><span>' + esc(t("sh_f1")) + '</span></p>' +
        '<p><code dir="ltr">IF</code><span>' + esc(t("sh_f2")) + "</span></p></div>";
    }
    if (i === 3) {
      var max = Math.max.apply(null, c.eds.map(function (e) { return e.total; })) || 1;
      return '<ul class="sx-bars">' + c.eds.slice().sort(function (x, y) { return y.total - x.total; }).map(function (e, k) {
        var rate = e.total ? e.approved / e.total : 0;
        return '<li style="--bd:' + (k * 70) + 'ms"><span class="sx-name">' + esc(e.name) + '</span><span class="sx-track"><i class="tot" style="--w:' + (e.total / max * 100).toFixed(1) + '%"></i><i class="ok" style="--w:' + (e.approved / max * 100).toFixed(1) + '%"></i></span>' +
          '<span class="sx-num">' + e.approved + "/" + e.total + "<em>" + pct(rate) + "</em></span></li>";
      }).join("") + '</ul><ul class="sx-legend sx-legend-inline"><li><span class="dot st4"></span>' + esc(t("sh_approved")) + '</li><li><span class="dot tot"></span>' + esc(t("sh_projects")) + "</li></ul>";
    }
    var arch = SD.archive.slice().sort(function (x, y) { return x[5] < y[5] ? 1 : -1; });
    return '<div class="sx-kpis sx-kpis-1"><div class="sx-kpi"><small>' + esc(t("sh_avg")) + "</small><b>" + c.avg.toFixed(1) + "</b><span>" + esc(t("sh_days")) + "</span></div></div>" +
      '<div class="sx-scroll"><table class="sx-table"><thead><tr>' + t("sh_arch_cols").map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      arch.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + '</td><td dir="ltr">' + esc(r[5]) + '</td><td><b>' + r[6] + "</b></td></tr>"; }).join("") +
      "</tbody></table></div>";
  }
  function sxRows(root) {
    var rows = SD.tasks.filter(function (r) {
      return (!sheetState.lang || r[1] === sheetState.lang) && (!sheetState.status || r[4] === sheetState.status) && (!sheetState.editor || r[2] === sheetState.editor);
    });
    $("[data-sx-rows]", root).innerHTML = rows.length ? rows.map(function (r) {
      return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td><td>" + esc(r[3] || "—") + '</td><td><i class="' + stClass(r[4]) + '">' + esc(stLabel(r[4])) + '</i></td><td dir="ltr">' + esc(r[5]) + "</td></tr>";
    }).join("") : '<tr><td colspan="6" class="sx-none">' + esc(t("sh_empty")) + "</td></tr>";
    $("[data-sx-count]", root).textContent = t("sh_showing").replace("{n}", rows.length).replace("{t}", SD.tasks.length);
  }
  function sxShow(root, i) {
    sheetState.tab = i;
    $$("[data-sx-tab]", root).forEach(function (b) { b.setAttribute("aria-selected", String(+b.getAttribute("data-sx-tab") === i)); });
    var panel = $("[data-sx-panel]", root);
    panel.innerHTML = sxPanel(i);
    panel.classList.remove("in");
    if (i === 1) sxRows(root);
    requestAnimationFrame(function () { requestAnimationFrame(function () { panel.classList.add("in"); }); });
  }
  function bindSheet(scope) {
    var root = $("[data-sx]", scope);
    if (!root) return;
    root.addEventListener("click", function (e) {
      var tb = e.target.closest("[data-sx-tab]");
      if (tb) { sxShow(root, +tb.getAttribute("data-sx-tab")); return; }
      if (e.target.closest("[data-sx-reset]")) { sheetState.lang = sheetState.status = sheetState.editor = ""; sxShow(root, 1); }
    });
    root.addEventListener("change", function (e) {
      var f = e.target.getAttribute("data-sx-f");
      if (f) { sheetState[f] = e.target.value; sxRows(root); }
    });
    root.addEventListener("keydown", function (e) {
      if (!e.target.closest("[data-sx-tab]") || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      var n = t("sh_tabs").length, fwd = (e.key === "ArrowRight") !== (root.ownerDocument.documentElement.dir === "rtl");
      var i = (sheetState.tab + (fwd ? 1 : -1) + n) % n;
      sxShow(root, i);
      $('[data-sx-tab="' + i + '"]', root).focus();
    });
    sxShow(root, sheetState.tab);
  }

  function renderFilters() {
    var keys = ["all"].concat(S.sectors);
    $("#filters").innerHTML = keys.map(function (k) {
      return '<button class="filter" type="button" data-f="' + k + '" aria-pressed="' + (k === filter) + '">' + esc(t("filter_" + k)) + "</button>";
    }).join("");
  }
  function spans(list) {
    var out = [], i = 0;
    while (i < list.length) {
      var a = list[i], b = list[i + 1];
      if (a.size === "full" || !b || b.size === "full") { out.push(12); i += 1; continue; }
      var aw = a.size === "wide", bw = b.size === "wide";
      if (aw && !bw) out.push(7, 5); else if (!aw && bw) out.push(5, 7); else out.push(6, 6);
      i += 2;
    }
    return out;
  }
  function renderBento() {
    var list = P.filter(function (p) { return filter === "all" || p.sectors.indexOf(filter) > -1; });
    var sp = spans(list);
    $("#bento").innerHTML = list.map(function (p, i) {
      return '<article class="card enter' + (sp[i] === 12 ? " full" : "") + '" style="--span:' + sp[i] + ";--d:" + ((i % 2) * 130) + 'ms" data-id="' + p.id + '">' +
        '<div class="card-visual' + visualClass(p) + '">' + visualHTML(p) + "</div>" +
        '<div class="card-body"><div class="card-meta">' + metaHTML(p) + '</div><h3 id="ct-' + p.id + '">' + esc(L(p.title)) + "</h3>" +
        '<p class="card-sum">' + esc(L(p.summary)) + "</p>" +
        '<button class="card-open" type="button" data-open="' + p.id + '" aria-describedby="ct-' + p.id + '">' + esc(t("open_project")) + ICON.chevron + "</button>" +
        "</div></article>";
    }).join("");
    $("#work-empty").hidden = list.length > 0;
    $$("#bento .card").forEach(function (c) { watch(c); bindTilt(c, 6, 7); });
    bindPlayers($("#bento"));
  }

  function bindTilt(el, rx, ry, target) {
    if (!finePointer || reduceMotion) return;
    var node = target || el;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      node.classList.add("tilting");
      node.style.transform = "rotateX(" + (-py * rx).toFixed(2) + "deg) rotateY(" + (px * ry).toFixed(2) + "deg) translateY(-4px)";
      node.style.setProperty("--mx", ((px + 0.5) * 100).toFixed(1) + "%");
      node.style.setProperty("--my", ((py + 0.5) * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () { node.classList.remove("tilting"); node.style.transform = ""; });
  }

  // ---------- Audio ----------
  var audio = new Audio();
  audio.preload = "none";
  var curKey = null;
  var durations = {};
  function fmtTime(s) {
    if (!isFinite(s) || s < 0) return "0:00";
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function loadDuration(key) {
    if (durations[key] !== undefined) return;
    durations[key] = NaN;
    var a = new Audio();
    a.preload = "metadata";
    a.addEventListener("loadedmetadata", function () { durations[key] = a.duration; syncAll(); });
    a.src = TRACKS[key].src;
  }
  function syncPlayer(pl) {
    var key = pl.getAttribute("data-track");
    var active = key === curKey, playing = active && !audio.paused;
    pl.classList.toggle("playing", playing);
    pl.querySelector(".p-btn").setAttribute("aria-label", (playing ? t("pause") : t("play")) + ": " + L(TRACKS[key].title));
    var dur = active && isFinite(audio.duration) ? audio.duration : durations[key];
    var pct = active && isFinite(audio.duration) && audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
    pl.querySelector(".p-bar b").style.width = pct + "%";
    pl.querySelector(".p-time").textContent = active && audio.currentTime > 0 ? fmtTime(audio.currentTime) + " / " + fmtTime(dur) : fmtTime(dur);
  }
  function syncAll() { $$(".player").forEach(syncPlayer); }
  function toggleTrack(key) {
    if (curKey === key && !audio.paused) { audio.pause(); return; }
    if (curKey !== key) { audio.src = TRACKS[key].src; curKey = key; }
    var pr = audio.play();
    if (pr && pr.catch) pr.catch(function () {});
  }
  ["play", "pause", "ended", "timeupdate", "loadedmetadata"].forEach(function (ev) { audio.addEventListener(ev, syncAll); });
  function bindPlayers(scope) {
    $$(".player", scope).forEach(function (pl) {
      var key = pl.getAttribute("data-track");
      loadDuration(key);
      pl.querySelector(".p-btn").addEventListener("click", function (e) { e.stopPropagation(); toggleTrack(key); });
      syncPlayer(pl);
    });
  }

  // ---------- Project dialog (opens from the card) ----------
  var dialog = $("#pd");
  var lastOrigin = null;
  var closing = false;
  function flipFrom(origin) {
    var to = dialog.getBoundingClientRect();
    if (!origin || !document.body.contains(origin)) return null;
    var from = origin.getBoundingClientRect();
    if (!from.width) return null;
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    var s = Math.max(Math.min(from.width / to.width, 1), 0.3);
    return "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + s.toFixed(3) + ")";
  }
  function openProject(id, origin) {
    var p = P.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    var feats = (p.features && L(p.features)) || [];
    var links = (p.links || []).map(function (l) {
      return l.download
        ? '<a class="btn btn-line" href="' + esc(l.href) + '" download>' + esc(L(l.label)) + ICON.download + "</a>"
        : '<a class="btn btn-line" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(L(l.label)) + ICON.ext + "</a>";
    }).join("");
    var phases = (p.phases || []).length
      ? '<div class="pd-phases"><h3 class="pd-sub">' + esc(t("phases")) + '</h3><ol class="phases">' + p.phases.map(function (ph) {
          return '<li class="phase"><b>' + esc(L(ph.tag)) + "</b><span>" + esc(L(ph.text)) + "</span></li>";
        }).join("") + "</ol></div>"
      : "";
    var lab = p.labels || {};
    var roadmap = p.roadmap
      ? '<div class="pd-phases"><h3 class="pd-sub">' + esc(t("dh_roadmap")) + '</h3><ol class="roadmap">' + S.dhimma.roadmap.map(function (r) {
          return '<li class="' + (r.now ? "now" : "") + '"><span class="rm-tag">' + esc(L(r.tag)) +
            (r.now ? '<span class="rm-now">' + esc(t("dh_now")) + "</span>" : "") + '</span><span class="rm-desc">' + esc(L(r.desc)) + "</span></li>";
        }).join("") + "</ol></div>"
      : "";
    $("#pd-inner").innerHTML =
      '<div class="pd-head"><div><div class="card-meta">' + metaHTML(p) + '</div><h2 id="pd-title">' + esc(L(p.title)) + "</h2></div>" +
      '<button class="tool pd-close" type="button" aria-label="' + esc(t("close")) + '">' + ICON.close + "</button></div>" +
      '<div class="pd-visual' + visualClass(p, "dialog") + ' in">' + visualHTML(p, "dialog") + "</div>" +
      '<div class="pd-grid">' +
        '<div class="pd-block"><h3>' + esc(t("problem")) + "</h3><p>" + esc(L(p.problem)) + "</p></div>" +
        '<div class="pd-block"><h3>' + esc(t(lab.solution || "solution")) + "</h3><p>" + esc(L(p.solution)) + "</p></div>" +
        '<div class="pd-block res"><h3>' + esc(t(lab.result || "result")) + "</h3><p>" + esc(L(p.result)) + "</p></div>" +
      "</div>" + phases + roadmap +
      (feats.length ? '<div class="pd-feats"><h3 class="pd-sub">' + esc(t("features")) + "</h3><ul>" + feats.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul></div>" : "") +
      '<div class="pd-actions">' + links + '<a class="btn btn-solid" href="#contact" data-similar="' + p.id + '">' + esc(p.cta === "early" ? t("dh_early") : t("similar")) + "</a></div>";
    bindPlayers($("#pd-inner"));
    bindSheet($("#pd-inner"));
    bindCalc($("#pd-inner"));
    $(".pd-close", dialog).addEventListener("click", function () { closeDialog(); });
    $("[data-similar]", dialog).addEventListener("click", function (e) {
      e.preventDefault();
      closeDialog(function () {
        if (p.cta === "early") goToContact({ text: t("dh_early_msg"), type: "type_dhimma", sector: "other" });
        else requestSimilar(p);
      });
    });
    lastOrigin = origin || null;
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    root.classList.add("modal-open");
    $("#pd-inner").scrollTop = 0;
    if (reduceMotion || !dialog.animate) return;
    var start = flipFrom(lastOrigin) || "translateY(30px) scale(.96)";
    dialog.animate([{ transform: start, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 560, easing: EASE });
    Array.prototype.slice.call($("#pd-inner").children).forEach(function (el, i) {
      el.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }],
        { duration: 520, delay: 180 + i * 70, easing: EASE, fill: "backwards" });
    });
  }
  function closeDialog(after) {
    if (closing || !dialog.open) return;
    function done() {
      dialog.close();
      closing = false;
      if (typeof after === "function") after();
    }
    if (reduceMotion || !dialog.animate) { done(); return; }
    closing = true;
    var end = flipFrom(lastOrigin) || "translateY(30px) scale(.96)";
    var a = dialog.animate([{ transform: "none", opacity: 1 }, { transform: end, opacity: 0 }], { duration: 380, easing: "cubic-bezier(.7,0,.2,1)" });
    a.onfinish = done;
  }
  dialog.addEventListener("cancel", function (e) { e.preventDefault(); closeDialog(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
  dialog.addEventListener("close", function () {
    if (!dv.open) root.classList.remove("modal-open");
    if (curKey && !audio.paused && !$('#bento .player[data-track="' + curKey + '"]')) audio.pause();
  });

  function goToContact(fill) {
    var details = $("#f-details");
    if (fill.text && details.value.indexOf(fill.text) === -1) details.value = fill.text + (details.value ? "\n" + details.value : "\n");
    if (fill.type) { var r = $('input[name="type"][value="' + fill.type + '"]'); if (r) r.checked = true; }
    if (fill.sector) $("#f-sector").value = fill.sector;
    updateSendLinks();
    $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(function () { details.focus({ preventScroll: true }); }, reduceMotion ? 0 : 650);
  }
  function requestSimilar(p) {
    goToContact({ text: t("similar_msg") + L(p.title), type: "type_project", sector: sector || (p.sectors && p.sectors[0]) });
  }

  // ---------- Services, process, certs ----------
  function renderServices() {
    $("#services-list").innerHTML = S.services.map(function (s, i) {
      var ex = "";
      if (s.example && s.example.project) ex = '<button class="svc-link" type="button" data-open="' + s.example.project + '">' + esc(t("see_example")) + ICON.chevron + "</button>";
      else if (s.example && s.example.anchor) ex = '<button class="svc-link" type="button" data-anchor="' + s.example.anchor + '">' + esc(t("see_example")) + ICON.chevron + "</button>";
      return '<li class="svc" style="--d:' + (i * 90) + 'ms"><span class="term">' + esc(s.term) + "</span><h3>" + esc(L(s.title)) + "</h3><p>" + esc(L(s.desc)) + "</p>" + ex + "</li>";
    }).join("");
  }
  function renderProcess() {
    $("#steps").innerHTML = S.process.map(function (s, i) {
      return '<li class="step" style="--d:' + (i * 110) + 'ms"><div class="step-top"><span class="step-n" aria-hidden="true">' + (i + 1) +
        '</span><span class="term">' + esc(s.term) + "</span></div><h3>" + esc(L(s.title)) + "</h3><p>" + esc(L(s.desc)) +
        '</p><p class="step-out"><b>' + esc(t("deliverable")) + ":</b>" + esc(L(s.out)) + "</p></li>";
    }).join("");
  }
  function docActions(d, kind, i) {
    var out = "";
    if (d.img) out += '<button class="doc-btn" type="button" data-doc="' + kind + ":" + i + '">' + ICON.eye + "<span>" + esc(t("view_doc")) + "</span></button>";
    if (d.url) out += '<a class="doc-btn" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + ICON.ext + "<span>" + esc(t("verify")) + "</span></a>";
    return out;
  }
  function renderCerts() {
    $("#exp-docs").innerHTML = (S.experienceDocs || []).map(function (d, i) {
      var thumb = d.onRequest
        ? '<div class="exp-thumb exp-thumb-ph" aria-hidden="true">' + ICON.doc + "<span>" + esc(t("on_request")) + "</span></div>"
        : '<button class="exp-thumb" type="button" data-doc="exp:' + i + '" aria-label="' + esc(t("view_doc") + ": " + L(d.title) + "، " + L(d.org)) + '"><img src="' + esc(d.img) + '" alt="" loading="lazy"></button>';
      var acts = d.onRequest
        ? '<button class="doc-btn" type="button" data-request="' + i + '">' + ICON.mail + "<span>" + esc(t("request_doc")) + "</span></button>"
        : docActions(d, "exp", i);
      return '<li class="exp-doc" data-reveal style="--d:' + (i * 120) + 'ms">' + thumb +
        '<div class="exp-info"><span class="exp-org">' + esc(L(d.org)) + "</span><h4>" + esc(L(d.title)) + "</h4><p>" + esc(L(d.role)) + '</p><p class="exp-sign">' + esc(L(d.signer)) + "</p>" +
        '<div class="doc-actions">' + acts + "</div></div></li>";
    }).join("");
    $$("#exp-docs [data-reveal]").forEach(watch);
    $("#certs-list").innerHTML = S.certs.map(function (c, i) {
      return '<li class="cert" style="--d:' + (i * 60) + 'ms"><div class="cert-main"><span class="cert-name">' + esc(L(c.name)) + '</span><span class="cert-iss">' + esc(L(c.issuer)) +
        (c.year ? '<span class="cert-year">' + esc(c.year) + "</span>" : "") + '</span></div><div class="doc-actions">' + docActions(c, "cert", i) + "</div></li>";
    }).join("");
  }

  // ---------- Document viewer ----------
  var dv = $("#dv"), dvOrigin = null, dvClosing = false;
  function openDoc(key, origin) {
    var parts = key.split(":"), d = parts[0] === "exp" ? S.experienceDocs[+parts[1]] : S.certs[+parts[1]];
    if (!d || !d.img) return;
    var title = d.title ? L(d.title) : L(d.name), sub = d.org ? L(d.org) : L(d.issuer);
    $("#dv-inner").innerHTML = '<div class="dv-head"><div><small>' + esc(sub) + '</small><h2 id="dv-title">' + esc(title) + "</h2></div>" +
      '<button class="tool dv-close" type="button" aria-label="' + esc(t("close")) + '">' + ICON.close + "</button></div>" +
      '<div class="dv-img"><img src="' + esc(d.img) + '" alt="' + esc(title) + '"></div>' +
      '<div class="dv-actions">' + (d.pdf ? '<a class="btn btn-line" href="' + esc(d.pdf) + '" download>' + esc(t("download_pdf")) + ICON.download + "</a>" : "") +
      (d.url ? '<a class="btn btn-solid" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(t("verify")) + ICON.ext + "</a>" : "") + "</div>";
    $(".dv-close", dv).addEventListener("click", function () { closeDoc(); });
    dvOrigin = origin || null;
    if (typeof dv.showModal === "function") dv.showModal(); else dv.setAttribute("open", "");
    root.classList.add("modal-open");
    if (reduceMotion || !dv.animate) return;
    var start = flipTo(dv, dvOrigin) || "translateY(24px) scale(.96)";
    dv.animate([{ transform: start, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 480, easing: EASE });
  }
  function openZoom(src, cap, origin) {
    $("#dv-inner").innerHTML = '<div class="dv-head"><div><h2 id="dv-title">' + esc(cap) + "</h2></div>" +
      '<button class="tool dv-close" type="button" aria-label="' + esc(t("close")) + '">' + ICON.close + "</button></div>" +
      '<div class="dv-img dv-wide"><img src="' + esc(src) + '" alt="' + esc(cap) + '"></div>';
    $(".dv-close", dv).addEventListener("click", function () { closeDoc(); });
    dvOrigin = origin || null;
    if (typeof dv.showModal === "function") dv.showModal(); else dv.setAttribute("open", "");
    root.classList.add("modal-open");
    if (reduceMotion || !dv.animate) return;
    var start = flipTo(dv, dvOrigin) || "translateY(24px) scale(.96)";
    dv.animate([{ transform: start, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 480, easing: EASE });
  }
  function closeDoc() {
    if (dvClosing || !dv.open) return;
    if (reduceMotion || !dv.animate) { dv.close(); return; }
    dvClosing = true;
    var end = flipTo(dv, dvOrigin) || "translateY(24px) scale(.96)";
    var an = dv.animate([{ transform: "none", opacity: 1 }, { transform: end, opacity: 0 }], { duration: 320, easing: "cubic-bezier(.7,0,.2,1)" });
    an.onfinish = function () { dv.close(); dvClosing = false; };
  }
  function flipTo(box, origin) {
    if (!origin || !document.body.contains(origin)) return null;
    var to = box.getBoundingClientRect(), from = origin.getBoundingClientRect();
    if (!from.width) return null;
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2), dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    var sc = Math.max(Math.min(from.width / to.width, 1), 0.2);
    return "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + sc.toFixed(3) + ")";
  }
  dv.addEventListener("cancel", function (e) { e.preventDefault(); closeDoc(); });
  dv.addEventListener("close", function () { if (!dialog.open) root.classList.remove("modal-open"); });
  dv.addEventListener("click", function (e) { if (e.target === dv) closeDoc(); });


  // ---------- Contact ----------
  function buildMessage() {
    var name = $("#f-name").value.trim();
    var org = $("#f-org").value.trim();
    var sel = $("#f-sector");
    var sectorLabel = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent : "";
    var typeEl = $('input[name="type"]:checked');
    var typeLabel = typeEl ? t(typeEl.value) : "";
    var details = $("#f-details").value.trim();
    var who = t("msg_me") + " " + (name || "…") + (org ? " " + t("msg_from") + " " + org : "") + ".";
    return [t("msg_greet"), who, t("msg_sector") + ": " + sectorLabel, t("msg_type") + ": " + typeLabel, "", details].join("\n");
  }
  function updateSendLinks() {
    var msg = buildMessage();
    $("#send-wa").href = "https://wa.me/" + S.contact.whatsapp + "?text=" + encodeURIComponent(msg);
    $("#send-mail").href = "mailto:" + S.contact.email + "?subject=" + encodeURIComponent(t("msg_subject")) + "&body=" + encodeURIComponent(msg);
  }
  function validate() {
    var ok = true, first = null;
    [["#f-name", "#err-name"], ["#f-details", "#err-details"]].forEach(function (pair) {
      var input = $(pair[0]), err = $(pair[1]);
      var bad = !input.value.trim();
      input.setAttribute("aria-invalid", "false");
      if (bad) { void input.offsetWidth; input.setAttribute("aria-invalid", "true"); }
      err.hidden = !bad;
      if (bad) { ok = false; if (!first) first = input; }
    });
    if (first) first.focus();
    return ok;
  }
  function initContact() {
    if (sector) $("#f-sector").value = sector;
    var form = $("#contact-form");
    form.addEventListener("input", function (e) {
      updateSendLinks();
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) {
        e.target.setAttribute("aria-invalid", "false");
        var err = $("#" + e.target.getAttribute("aria-describedby"));
        if (err) err.hidden = true;
      }
    });
    form.addEventListener("change", updateSendLinks);
    form.addEventListener("submit", function (e) { e.preventDefault(); if (validate()) window.open($("#send-wa").href, "_blank", "noopener"); });
    ["#send-wa", "#send-mail"].forEach(function (id) {
      $(id).addEventListener("click", function (e) { updateSendLinks(); if (!validate()) e.preventDefault(); });
    });
    updateSendLinks();
  }

  // ---------- Compact menu ----------
  var menu = $("#drawer"), menuBtn = $("#menu-btn");
  var menuOpen = false;
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    root.classList.add("menu-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menu.inert = false;
    setTimeout(function () { var l = $(".menu-links a"); if (l) l.focus({ preventScroll: true }); }, 120);
  }
  function closeMenu(focusBtn) {
    if (!menuOpen) return;
    menuOpen = false;
    root.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menu.inert = true;
    if (focusBtn) menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener("click", function () { if (menuOpen) closeMenu(true); else openMenu(); });
  $("#scrim").addEventListener("click", function () { closeMenu(false); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuOpen) closeMenu(true); });
  window.addEventListener("resize", function () { if (menuOpen && window.innerWidth > 960) closeMenu(false); });

  // ---------- Scroll progress + active link ----------
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      $("#progress").style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$(".nav-links a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "work", "services", "contact"].forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  // ---------- Render all ----------
  function renderAll() {
    applyI18n();
    buildGate();
    renderLedger();
    renderTimeline();
    renderFilters();
    renderBento();
    renderServices();
    renderProcess();
    renderCerts();
    updateSendLinks();
    syncAll();
  }

  // ---------- Events ----------
  document.addEventListener("click", function (e) {
    var zoomBtn = e.target.closest("[data-zoom]");
    if (zoomBtn) { openZoom(zoomBtn.getAttribute("data-zoom"), zoomBtn.getAttribute("data-zoom-cap"), zoomBtn); return; }
    var reqBtn = e.target.closest("[data-request]");
    if (reqBtn) { var rd = S.experienceDocs[+reqBtn.getAttribute("data-request")]; goToContact({ text: L(rd.requestMsg), type: "type_job" }); return; }
    var docBtn = e.target.closest("[data-doc]");
    if (docBtn) { openDoc(docBtn.getAttribute("data-doc"), docBtn.closest(".exp-doc") || docBtn.closest(".cert") || docBtn); return; }
    var open = e.target.closest("[data-open]");
    if (open) { openProject(open.getAttribute("data-open"), open.closest(".card") || open); return; }
    var anchor = e.target.closest("[data-anchor]");
    if (anchor) {
      var target = document.getElementById(anchor.getAttribute("data-anchor"));
      if (target) { target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); setTimeout(playGate, reduceMotion ? 0 : 700); }
      return;
    }
    var f = e.target.closest("[data-f]");
    if (f) {
      filter = f.getAttribute("data-f");
      $$("#filters .filter").forEach(function (b) { b.setAttribute("aria-pressed", String(b === f)); });
      renderBento();
    }
  });

  $$(".js-lang").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = lang === "ar" ? "en" : "ar";
      store.set("ms-lang", lang);
      renderAll();
    });
  });
  $$(".js-theme").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = root.getAttribute("data-theme") || "light";
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store.set("ms-theme", next);
    });
  });
  $("#gate-replay").addEventListener("click", playGate);

  // ---------- Init ----------
  renderAll();
  initContact();
  introHero();
  onScroll();

  $$("[data-reveal]").forEach(watch);
  ["#services-list", "#steps", "#certs-list"].forEach(function (sel) { watch($(sel)); });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var gio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { playGate(); gio.disconnect(); } });
    }, { threshold: 0.45 });
    gio.observe($("#gate-viz"));
  } else {
    playGate();
  }
})();
