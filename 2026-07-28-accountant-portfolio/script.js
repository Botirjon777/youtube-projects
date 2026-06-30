/* =========================================================
   Accountant site — growth chart that builds on scroll,
   reveals, and count-up stats (with prefix/suffix).
   ========================================================= */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- build the bar chart ---------- */
const chart = document.getElementById("chart");
const VALUES = [42, 48, 45, 58, 64, 71, 88]; // last quarter is the emerald "now" bar
VALUES.forEach((v) => {
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.dataset.h = v;
  chart.appendChild(bar);
});

/* grow bars when the card scrolls into view */
const chartIO = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    chartIO.unobserve(e.target);
    chart.querySelectorAll(".bar").forEach((bar, i) => {
      const h = bar.dataset.h + "%";
      if (reduce) { bar.style.height = h; return; }
      setTimeout(() => { bar.style.height = h; }, i * 90);
    });
  });
}, { threshold: 0.4 });
chartIO.observe(chart);

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.07 + "s"; io.observe(el); });

/* ---------- count-up (prefix + suffix, supports decimals) ---------- */
const cio = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    cio.unobserve(el);
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    const start = performance.now(), dur = 1400;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = prefix + (target % 1 ? val.toFixed(1) : Math.round(val)) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
