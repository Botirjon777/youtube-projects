/* =========================================================
   Will you go on a date with me? 💌
   She can only say yes — the "No" button keeps running away.
   Then she picks the food, day & time, and the countdown begins.
   ========================================================= */

/* ---------- tiny helpers ---------- */
const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showStep(id) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0 });
}

/* =========================================================
   STEP 1 — the un-clickable "No"
   ========================================================= */
const noBtn = $("noBtn");
const yesBtn = $("yesBtn");
const noHint = $("noHint");

const DODGES = [
  "Nope, can't catch me 😏",
  "Try again 😅",
  "The Yes button is right there 👉",
  "You know you want to 💕",
  "Almost! …not really 🙈",
];
let dodgeCount = 0;
let yesScale = 1;

function runAway() {
  // jump to a random spot on screen (fixed so it escapes its container)
  const pad = 20;
  const x = pad + Math.random() * (window.innerWidth - noBtn.offsetWidth - pad * 2);
  const y = pad + Math.random() * (window.innerHeight - noBtn.offsetHeight - pad * 2);
  noBtn.style.position = "fixed";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  // taunt + grow the Yes button so the choice gets easier and easier
  noHint.textContent = DODGES[dodgeCount % DODGES.length];
  dodgeCount++;
  yesScale = Math.min(yesScale + 0.12, 2.2);
  yesBtn.style.transform = `scale(${yesScale})`;
}

// dodge on any attempt to reach it
["mouseenter", "mousedown", "touchstart", "focus", "click"].forEach((ev) =>
  noBtn.addEventListener(ev, (e) => { e.preventDefault(); runAway(); }, { passive: false })
);

yesBtn.addEventListener("click", () => {
  burst(50);
  showStep("step-plan");
});

/* =========================================================
   STEP 2 — pick food, day & time
   ========================================================= */
const plan = { food: null, day: null, time: $("timeInput").value };
const confirmBtn = $("confirmBtn");
const planHint = $("planHint");

// default the date to tomorrow
(function defaultTomorrow() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  $("dayInput").value = t.toISOString().slice(0, 10);
  plan.day = $("dayInput").value;
})();

$("foodChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("selected"));
  chip.classList.add("selected");
  plan.food = chip.dataset.food;
  refreshPlan();
});

$("dayInput").addEventListener("change", (e) => { plan.day = e.target.value; refreshPlan(); });
$("timeInput").addEventListener("change", (e) => { plan.time = e.target.value; refreshPlan(); });

function refreshPlan() {
  const ready = plan.food && plan.day && plan.time;
  confirmBtn.disabled = !ready;
  planHint.textContent = ready ? "perfect — lock it in 💖" : "pick a food and a day ♡";
}

confirmBtn.addEventListener("click", () => {
  startCountdown();
  burst(60);
  showStep("step-done");
});

/* =========================================================
   STEP 3 — the live countdown
   ========================================================= */
function startCountdown() {
  const target = new Date(`${plan.day}T${plan.time}`);

  const pretty = target.toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });
  const clock = target.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  $("summary").innerHTML = `${plan.food} on <b>${pretty}</b> at <b>${clock}</b>`;

  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      $("doneHint").textContent = "It's time — see you now! 💖";
      $("days").textContent = $("hours").textContent = $("mins").textContent = $("secs").textContent = "0";
      clearInterval(timer);
      burst(80);
      return;
    }
    const s = Math.floor(diff / 1000);
    $("days").textContent = Math.floor(s / 86400);
    $("hours").textContent = pad(Math.floor((s % 86400) / 3600));
    $("mins").textContent = pad(Math.floor((s % 3600) / 60));
    $("secs").textContent = pad(s % 60);
  }
  tick();
  const timer = setInterval(tick, 1000);
}

/* =========================================================
   Floating hearts (shared with the channel style)
   ========================================================= */
const EMOJIS = ["💖", "💕", "💗", "💓", "🩷", "💞"];
const heartLayer = $("hearts");

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
if (!reduceMotion) setInterval(() => spawnHeart(), 1000);

function burst(n) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) setTimeout(() => spawnHeart(Math.random() * 100), i * 25);
}
