document.addEventListener("DOMContentLoaded", () => {
  const entry = document.getElementById("entry");
  const site = document.getElementById("site");
  const nameField = document.getElementById("nameField");
  const enterBtn = document.getElementById("enterBtn");

  const siteTitle = document.getElementById("siteTitle");
  const homeHeading = document.getElementById("homeHeading");
  const captionTitle = document.getElementById("captionTitle");
  const cardToLine = document.getElementById("cardToLine");

  const pages = ["home", "card", "about"];

  // -----------------
  // Tabs
  // -----------------
  function showPage(id) {
    pages.forEach((p) => {
      const el = document.getElementById(p);
      if (el) el.classList.toggle("show", p === id);
    });
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.page === id);
    });
  }

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  // -----------------
  // Confetti + Sparkle (canvas)
  // -----------------
  const canvas = document.getElementById("confetti");
  const ctx = canvas ? canvas.getContext("2d") : null;

  function resize() {
    if (!canvas || !ctx) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  let pieces = [];

  function addPiece(p) {
    pieces.push(p);
  }

  function burstConfetti(amount = 160) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.18;

    for (let i = 0; i < amount; i++) {
      addPiece({
        kind: "confetti",
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * -9 - 4,
        r: Math.random() * 3 + 2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        life: 0,
        max: 90 + Math.random() * 50,
        type: Math.random() < 0.6 ? "rect" : "circle",
        color:
          Math.random() < 0.45
            ? "rgba(246,211,222,0.95)"
            : Math.random() < 0.9
            ? "rgba(214,232,255,0.95)"
            : "rgba(255,255,255,0.92)",
      });
    }
  }

  function sparkle(x, y) {
    const n = 12;
    for (let i = 0; i < n; i++) {
      addPiece({
        kind: "sparkle",
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2.6,
        vy: (Math.random() - 0.5) * 2.6 - 0.6,
        r: Math.random() * 2 + 1,
        life: 0,
        max: 28 + Math.random() * 14,
        type: "circle",
        color: Math.random() < 0.5 ? "rgba(246,211,222,0.80)" : "rgba(214,232,255,0.80)",
      });
    }
  }

  function draw() {
    if (!canvas || !ctx) return requestAnimationFrame(draw);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces = pieces.filter((p) => p.life < p.max);

    for (const p of pieces) {
      p.life++;

      // physics
      if (p.kind === "confetti") p.vy += 0.18;
      else p.vy += 0.05;

      p.x += p.vx;
      p.y += p.vy;
      if (p.rot != null) p.rot += p.vr || 0;

      // fade
      const fade = 1 - p.life / p.max;
      ctx.globalAlpha = Math.max(0, fade);
      ctx.fillStyle = p.color;

      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.rot != null) ctx.rotate(p.rot);

      if (p.type === "rect") ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.2);
      else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();

  // Sparkle on background clicks (not on inputs/buttons)
  document.addEventListener("click", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (["button", "input", "textarea"].includes(tag)) return;
    sparkle(e.clientX, e.clientY);
  });

  // -----------------
  // Entry flow
  // -----------------
  function enterSite() {
    const name = (nameField.value || "").trim();
    if (!name) {
      nameField.focus();
      return;
    }

    localStorage.setItem("liz_site_name", name);

    if (siteTitle) siteTitle.textContent = `Happy Birthday, ${name}`;
    if (homeHeading) homeHeading.textContent = `Happy 15th, ${name}`;
    if (captionTitle) captionTitle.textContent = name;
    if (cardToLine) cardToLine.textContent = `To: ${name}`;

    entry.classList.add("hidden");
    site.classList.remove("hidden");
    showPage("home");

    // First-time confetti only (per browser)
    const hasBurst = localStorage.getItem("liz_first_burst");
    if (!hasBurst) {
      burstConfetti(190);
      localStorage.setItem("liz_first_burst", "yes");
    }
  }

  enterBtn.addEventListener("click", enterSite);
  nameField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enterSite();
  });

  // -----------------
  // Home buttons
  // -----------------
  const mini = document.getElementById("miniConfetti");
  const replay = document.getElementById("replayIntro");
  if (mini) mini.addEventListener("click", () => burstConfetti(120));
  if (replay) replay.addEventListener("click", () => burstConfetti(190));

  // -----------------
  // Card saving
  // -----------------
  const cardInput = document.getElementById("cardInput");
  const cardBody = document.getElementById("cardBody");
  const fromName = document.getElementById("fromName");
  const cardFromLine = document.getElementById("cardFromLine");
  const cardSig = document.getElementById("cardSig");

  function loadCard() {
    const savedMsg = localStorage.getItem("liz_card_msg");
    if (savedMsg && cardInput && cardBody) {
      cardInput.value = savedMsg;
      cardBody.textContent = savedMsg;
    }
    const savedFrom = localStorage.getItem("liz_card_from");
    if (savedFrom && fromName && cardFromLine && cardSig) {
      fromName.value = savedFrom;
      cardFromLine.textContent = `From: ${savedFrom}`;
      cardSig.textContent = `— ${savedFrom}`;
    }
  }
  loadCard();

  const saveCardBtn = document.getElementById("saveCard");
  const clearCardBtn = document.getElementById("clearCard");

  if (saveCardBtn) {
    saveCardBtn.addEventListener("click", () => {
      const msg = (cardInput?.value || "").trim();
      if (!msg) return;
      localStorage.setItem("liz_card_msg", msg);
      if (cardBody) cardBody.textContent = msg;
      burstConfetti(70);
    });
  }

  if (clearCardBtn) {
    clearCardBtn.addEventListener("click", () => {
      if (cardInput) cardInput.value = "";
      localStorage.removeItem("liz_card_msg");
      if (cardBody) cardBody.textContent = "Your card will show up here once you update it.";
    });
  }

  const setFromBtn = document.getElementById("setFromName");
  if (setFromBtn) {
    setFromBtn.addEventListener("click", () => {
      const n = (fromName?.value || "").trim();
      if (!n) return;
      localStorage.setItem("liz_card_from", n);
      if (car
