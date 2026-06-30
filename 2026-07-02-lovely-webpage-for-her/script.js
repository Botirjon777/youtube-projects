/* =========================================================
   For You 💖 — a lovely little webpage
   Edit the CONFIG below to make it personal.
   ========================================================= */

const CONFIG = {
  name: "Emma",
  // Sweet lines that type out under the name, one after another
  lines: [
    "you are my favorite hello",
    "and my hardest goodbye",
    "every day with you is my favorite day ♡",
  ],
  // When your story began (YYYY, M-1, D)  ← month is 0-based!
  since: new Date(2023, 5, 12), // 12 June 2023
  // Front emoji + the reason revealed on the back
  reasons: [
    { emoji: "😊", text: "Your smile fixes my worst days." },
    { emoji: "🤗", text: "Your hugs feel like home." },
    { emoji: "😂", text: "You laugh at my terrible jokes." },
    { emoji: "🌙", text: "Late-night talks with you never get old." },
    { emoji: "☕", text: "Even quiet mornings are better with you." },
    { emoji: "💪", text: "You make me want to be better." },
  ],
};

/* ---------- Personalize ---------- */
document.getElementById("name").textContent = CONFIG.name;
document.title = `For ${CONFIG.name} 💖`;

/* ---------- Typewriter ---------- */
(function typewriter() {
  const el = document.getElementById("typed");
  let line = 0, char = 0, deleting = false;

  function tick() {
    const current = CONFIG.lines[line];
    el.textContent = current.slice(0, char);

    if (!deleting && char < current.length) {
      char++;
    } else if (!deleting && char === current.length) {
      deleting = true;
      return setTimeout(tick, 1600);
    } else if (deleting && char > 0) {
      char--;
    } else {
      deleting = false;
      line = (line + 1) % CONFIG.lines.length;
    }
    setTimeout(tick, deleting ? 35 : 70);
  }
  tick();
})();

/* ---------- Reason cards ---------- */
(function buildCards() {
  const wrap = document.getElementById("cards");
  CONFIG.reasons.forEach((r) => {
    const card = document.createElement("button");
    card.className = "card";
    card.setAttribute("aria-label", "Reveal a reason");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">${r.emoji}</div>
        <div class="card-face card-back">${r.text}</div>
      </div>`;
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    wrap.appendChild(card);
  });
})();

/* ---------- Together-since counter ---------- */
(function counter() {
  const pad = (n) => String(n).padStart(2, "0");
  const els = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    mins: document.getElementById("mins"),
    secs: document.getElementById("secs"),
  };
  function update() {
    const diff = Date.now() - CONFIG.since.getTime();
    const s = Math.floor(diff / 1000);
    els.days.textContent = Math.floor(s / 86400);
    els.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    els.mins.textContent = pad(Math.floor((s % 3600) / 60));
    els.secs.textContent = pad(s % 60);
  }
  update();
  setInterval(update, 1000);
})();

/* ---------- Surprise note ---------- */
document.getElementById("surpriseBtn").addEventListener("click", function () {
  document.getElementById("note").hidden = false;
  this.style.display = "none";
  burst(40);
});

/* ---------- Floating hearts ---------- */
const EMOJIS = ["💖", "💕", "💗", "💓", "🩷", "💞"];
const heartLayer = document.getElementById("hearts");

function spawnHeart(x) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  h.style.left = (x ?? Math.random() * 100) + "vw";
  h.style.fontSize = 0.9 + Math.random() * 1.4 + "rem";
  h.style.animationDuration = 6 + Math.random() * 6 + "s";
  heartLayer.appendChild(h);
  setTimeout(() => h.remove(), 12000);
}

// gentle ambient hearts
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) setInterval(() => spawnHeart(), 900);

// a celebratory burst
function burst(n) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) setTimeout(() => spawnHeart(Math.random() * 100), i * 30);
}
