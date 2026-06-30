/* =========================================================
   Designer Portfolio — interactions
   Custom cursor · scroll reveal · work hover preview ·
   count-up stats · magnetic button. No libraries.
   ========================================================= */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- custom cursor (dot + lagging ring) ---------- */
const dot = document.getElementById("dot");
const ring = document.getElementById("ring");
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

addEventListener("mousemove", (e) => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
});
function ringLoop() {
  rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  requestAnimationFrame(ringLoop);
}
if (!reduce) ringLoop();

// grow the ring over interactive elements
document.querySelectorAll("a, .work-item, .card, button").forEach((el) => {
  el.addEventListener("mouseenter", () => ring.classList.add("grow"));
  el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
});

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 6) * 0.06 + "s";
  io.observe(el);
});

/* ---------- work hover preview that follows the cursor ---------- */
const preview = document.getElementById("preview");
let previewX = 0, previewY = 0, hasPreview = false;

document.querySelectorAll(".work-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    preview.style.background = item.dataset.grad;
    preview.classList.add("show");
    hasPreview = true;
  });
  item.addEventListener("mouseleave", () => {
    preview.classList.remove("show");
    hasPreview = false;
  });
});
function previewLoop() {
  previewX += (mx - previewX) * 0.12;
  previewY += (my - previewY) * 0.12;
  if (hasPreview) preview.style.left = previewX + "px", preview.style.top = previewY + "px";
  requestAnimationFrame(previewLoop);
}
previewLoop();

/* ---------- count-up stats ---------- */
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    countIO.unobserve(el);
    if (reduce) { el.textContent = target; return; }
    const start = performance.now(), dur = 1400;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

/* ---------- magnetic button ---------- */
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    if (reduce) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.35}px, ${y * 0.45}px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
});

/* ---------- nav blends only over light sections (already via mix-blend) ---------- */
