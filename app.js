// Global Emigration — shared site script
(function () {
  var PHONE = "917455027539";
  var EMAIL = "sdmediatechsolutions@gmail.com";

  // navbar: drawer, dropdown, scroll state
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  var scrim = document.querySelector(".scrim");
  var setOpen = function (open) {
    if (!nav) return;
    nav.classList.toggle("open", open);
    if (scrim) scrim.classList.toggle("show", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
  };
  if (burger) burger.addEventListener("click", function () { setOpen(true); });
  if (scrim) scrim.addEventListener("click", function () { setOpen(false); });
  document.querySelectorAll(".drawer-close").forEach(function (b) { b.addEventListener("click", function () { setOpen(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); document.querySelectorAll(".dd.open").forEach(function (d) { d.classList.remove("open"); }); } });
  document.querySelectorAll(".dd > button").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var dd = b.parentNode, open = !dd.classList.contains("open");
      dd.classList.toggle("open", open);
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".dd.open").forEach(function (d) { if (!d.contains(e.target) && window.innerWidth > 1000) d.classList.remove("open"); });
  });
  var header = document.querySelector(".header");
  var onScroll = function () { if (header) header.classList.toggle("scrolled", window.scrollY > 40); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // copy buttons
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = btn.textContent;
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = label; }, 1600); };
      try { navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(done, done); } catch (e) { done(); }
    });
  });

  // jobs filter
  var jf = document.querySelector(".jobs-filter");
  if (jf) {
    jf.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      jf.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var f = b.getAttribute("data-f");
      document.querySelectorAll("[data-c]").forEach(function (card) {
        card.hidden = !(f === "all" || card.getAttribute("data-c").indexOf(f) > -1);
      });
    });
  }

  // enquiry form -> WhatsApp or Email
  var form = document.getElementById("enquiry");
  if (form) {
    var build = function () {
      var v = function (id) { return (form.querySelector(id).value || "").trim(); };
      var name = v("#f-name"), phone = v("#f-phone");
      var err = form.querySelector(".err");
      if (!name || phone.replace(/\D/g, "").length < 10) {
        err.textContent = "Please enter your name and a valid mobile number.";
        return null;
      }
      err.textContent = "";
      return "Hello, I want to enquire about going abroad.\n\n" +
        "Name: " + name + "\nMobile: " + phone +
        "\nCountry: " + v("#f-country") + "\nService: " + v("#f-service") +
        "\nPassport: " + v("#f-passport") +
        (v("#f-msg") ? "\n\n" + v("#f-msg") : "");
    };
    var go = function (url) {
      var w = null;
      try { w = window.open(url, "_blank"); } catch (x) {}
      if (!w) window.location.href = url;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = build(); if (!t) return;
      go("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(t));
    });
    var mailBtn = document.getElementById("send-mail");
    if (mailBtn) mailBtn.addEventListener("click", function () {
      var t = build(); if (!t) return;
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Emigration enquiry") + "&body=" + encodeURIComponent(t);
    });
  }

  // hero route animation: India -> Dubai / Riyadh / New York
  var cv = document.getElementById("routes");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W, H, dpr, t0 = performance.now();
    var size = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var pts = function () {
      var o = { x: W * 0.80, y: H * 0.62 };           // India
      return { o: o, d: [
        { x: W * 0.66, y: H * 0.52 },                  // Dubai
        { x: W * 0.58, y: H * 0.58 },                  // Riyadh
        { x: W * 0.10, y: H * 0.30 }                   // New York
      ] };
    };
    var draw = function (now) {
      ctx.clearRect(0, 0, W, H);
      // dot field
      ctx.fillStyle = "rgba(11,34,64,0.07)";
      for (var x = 12; x < W; x += 22) for (var y = 12; y < H; y += 22) ctx.fillRect(x, y, 2, 2);
      var p = pts(), k = reduce ? 1 : ((now - t0) / 2600) % 1;
      p.d.forEach(function (d, i) {
        var cx = (p.o.x + d.x) / 2, cy = Math.min(p.o.y, d.y) - (Math.abs(p.o.x - d.x) * 0.35 + 30);
        ctx.setLineDash([5, 6]);
        ctx.strokeStyle = "rgba(11,122,117,0.35)"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(p.o.x, p.o.y); ctx.quadraticCurveTo(cx, cy, d.x, d.y); ctx.stroke();
        ctx.setLineDash([]);
        var tt = (k + i * 0.33) % 1, a = 1 - tt;
        var px = a * a * p.o.x + 2 * a * tt * cx + tt * tt * d.x;
        var py = a * a * p.o.y + 2 * a * tt * cy + tt * tt * d.y;
        ctx.fillStyle = "rgba(201,154,46,0.95)";
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, 6.3); ctx.fill();
        ctx.fillStyle = "rgba(11,34,64,0.5)";
        ctx.beginPath(); ctx.arc(d.x, d.y, 4, 0, 6.3); ctx.fill();
      });
      ctx.fillStyle = "#0b7a75";
      ctx.beginPath(); ctx.arc(p.o.x, p.o.y, 5, 0, 6.3); ctx.fill();
      if (!reduce) requestAnimationFrame(draw);
    };
    size(); window.addEventListener("resize", size);
    requestAnimationFrame(draw);
  }
})();
