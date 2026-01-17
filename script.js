const pages = ["home", "about", "card"];
const fxLayer = document.getElementById("fx-layer");

function showPage(id) {
  pages.forEach((p) => {
    document.getElementById(p).classList.toggle("show", p === id);
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === id);
  });
}

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// Click anywhere for a little heart sparkle
document.addEventListener("click", (e) => {
  // Don't trigger when clicking buttons/inputs/textareas (so it doesn't feel annoying)
  const tag = e.target.tagName.toLowerCase();
  if (["button", "input", "textarea"].includes(tag)) return;

  spawnFx(e.clientX, e.clientY, Math.random() < 0.65 ? "💗" : "🩵");
});

function spawnFx(x, y, emoji) {
  const el = document.createElement("div");
  el.className = "fx";
  el.textContent = emoji;

  const jitterX = (Math.random() - 0.5) * 18;
  const jitterY = (Math.random() - 0.5) * 12;

  el.style.left = `${x + jitterX}px`;
  el.style.top = `${y + jitterY}px`;

  fxLayer.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

// Confetti button
document.getElementById("confettiBtn").addEventListener("click", () => {
  for (let i = 0; i < 30; i++) {
    const x = window.innerWidth * Math.random();
    const y = window.innerHeight * (0.15 + Math.random() * 0.2);
    const emoji = ["✨", "🎀", "🩵", "💗", "🎉"][Math.floor(Math.random() * 5)];
    setTimeout(() => spawnFx(x, y, emoji), i * 18);
  }
});

// Memory capsule notes
const noteReveal = document.getElementById("noteReveal");
document.querySelectorAll(".note").forEach((btn) => {
  btn.addEventListener("click", () => {
    const msg = btn.dataset.note;
    noteReveal.querySelector(".reveal-text").textContent = msg;
    noteReveal.querySelector(".reveal-emoji").textContent = Math.random() < 0.5 ? "🎀" : "🧁";
  });
});

// Compliment generator
const compliments = [
  "Liz, you’re the kind of person who makes everything feel lighter 💗",
  "You’re genuinely so cool and effortless (it’s unfair) ✨",
  "Your laugh is probably someone’s favorite sound 🩵",
  "You deserve a year that feels like a warm hug 🎀",
  "Main character energy, always 🌸",
  "You’re sweet, strong, and iconic — all at once 💞",
];

document.getElementById("addComplimentBtn").addEventListener("click", () => {
  const out = document.getElementById("complimentOut");
  out.textContent = compliments[Math.floor(Math.random() * compliments.length)];
});

// Card saving (local storage)
const cardInput = document.getElementById("cardInput");
const prettyMessage = document.getElementById("prettyMessage");

function loadCard() {
  const saved = localStorage.getItem("liz_card_message");
  if (saved) {
    cardInput.value = saved;
    prettyMessage.textContent = saved;
  }

  const name = localStorage.getItem("liz_card_name");
  if (name) {
    document.getElementById("signatureLine").textContent = `— ${name}`;
    document.getElementById("fromLine").textContent = `From: ${name}`;
    document.getElementById("nameInput").value = name;
  }
}

document.getElementById("saveCardBtn").addEventListener("click", () => {
  const msg = cardInput.value.trim();
  if (!msg) {
    prettyMessage.innerHTML = "Write something in the box, then click <b>Update Card</b> 💗";
    localStorage.removeItem("liz_card_message");
    return;
  }
  localStorage.setItem("liz_card_message", msg);
  prettyMessage.textContent = msg;
  spawnFx(window.innerWidth * 0.5, window.innerHeight * 0.35, "💌");
});

document.getElementById("clearCardBtn").addEventListener("click", () => {
  cardInput.value = "";
  prettyMessage.innerHTML = "Write something in the box, then click <b>Update Card</b> 💗";
  localStorage.removeItem("liz_card_message");
  spawnFx(window.innerWidth * 0.5, window.innerHeight * 0.35, "🩵");
});

document.getElementById("setNameBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) return;

  localStorage.setItem("liz_card_name", name);
  document.getElementById("signatureLine").textContent = `— ${name}`;
  document.getElementById("fromLine").textContent = `From: ${name}`;
  spawnFx(window.innerWidth * 0.5, window.innerHeight * 0.35, "🎀");
});

// Floating hearts toggle
let heartsOn = false;
let heartInterval = null;

function spawnFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = Math.random() < 0.5 ? "💗" : "🩵";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${14 + Math.random() * 16}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 8200);
}

document.getElementById("toggleHeartsBtn").addEventListener("click", () => {
  heartsOn = !heartsOn;
  if (heartsOn) {
    heartInterval = setInterval(spawnFloatingHeart, 650);
    spawnFx(window.innerWidth * 0.5, window.innerHeight * 0.25, "💞");
  } else {
    clearInterval(heartInterval);
    heartInterval = null;
    spawnFx(window.innerWidth * 0.5, window.innerHeight * 0.25, "✨");
  }
});

loadCard();
