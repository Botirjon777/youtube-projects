/* =========================================================
   Pharmacist site — floating pills, reveals, count-up,
   live "open now" status.
   ========================================================= */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- floating pills / capsules canvas ---------- */
const canvas = document.getElementById("pills");
const ctx = canvas.getContext("2d");
let W, H, DPR, pills = [];
const COLORS = [["#18a999", "#ffffff"], ["#7ad6c6", "#ffffff"], ["#0f7d70", "#d6f3ea"], ["#a8e6d8", "#18a999"]];
const rand = (a, b) => a + Math.random() * (b - a);

function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = canvas.width = innerWidth * DPR; H = canvas.height = innerHeight * DPR;
  canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
  const n = Math.round((innerWidth * innerHeight) / 90000);
  pills = Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    len: rand(26, 54) * DPR, w: rand(12, 20) * DPR,
    rot: rand(0, Math.PI), spin: rand(-0.004, 0.004),
    vy: rand(-0.25, -0.7) * DPR, vx: rand(-0.2, 0.2) * DPR,
    c: COLORS[(Math.random() * COLORS.length) | 0], a: rand(0.12, 0.3),
  }));
}
function capsule(p) {
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a;
  const r = p.w / 2, half = p.len / 2;
  // left half
  ctx.fillStyle = p.c[0];
  ctx.beginPath(); ctx.moveTo(-half + r, -r); ctx.lineTo(0, -r); ctx.lineTo(0, r); ctx.lineTo(-half + r, r);
  ctx.arc(-half + r, 0, r, Math.PI / 2, -Math.PI / 2); ctx.fill();
  // right half
  ctx.fillStyle = p.c[1];
  ctx.beginPath(); ctx.moveTo(half - r, -r); ctx.lineTo(0, -r); ctx.lineTo(0, r); ctx.lineTo(half - r, r);
  ctx.arc(half - r, 0, r, -Math.PI / 2, Math.PI / 2); ctx.fill();
  ctx.restore();
}
function loop() {
  ctx.clearRect(0, 0, W, H);
  for (const p of pills) {
    p.x += p.vx; p.y += p.vy; p.rot += p.spin;
    if (p.y < -p.len) { p.y = H + p.len; p.x = Math.random() * W; }
    if (p.x < -p.len) p.x = W + p.len; if (p.x > W + p.len) p.x = -p.len;
    capsule(p);
  }
  requestAnimationFrame(loop);
}
addEventListener("resize", resize);
resize();
if (!reduce) loop(); else for (const p of pills) capsule(p);

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.07 + "s"; io.observe(el); });

/* ---------- count-up ---------- */
const cio = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || "";
    cio.unobserve(el);
    if (reduce) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 1300;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

/* ---------- live "open now" ---------- */
(function openStatus() {
  const el = document.getElementById("openNow");
  if (!el) return;
  const now = new Date(), day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  let open;
  if (day >= 1 && day <= 5) open = h >= 8.5 && h < 19;
  else if (day === 6) open = h >= 9 && h < 17;
  else open = h >= 10 && h < 14;
  el.querySelector("b").textContent = open ? "Open now" : "Closed";
  el.classList.toggle("closed", !open);
})();
