/* =========================================================
   Programmer Portfolio — terminal typing, code paint, reveals
   ========================================================= */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- terminal typing ---------- */
const term = document.getElementById("term");
const LINES = [
  { html: '<span class="g">sam@dev</span>:<span class="c">~</span>$ whoami', pause: 500 },
  { html: '<span class="p">Sam Okoye</span> — Software Engineer', pause: 250 },
  { html: '<span class="g">sam@dev</span>:<span class="c">~</span>$ cat role.txt', pause: 500 },
  { html: 'Backend &amp; systems · 6 yrs · loves fast code', pause: 250 },
  { html: '<span class="g">sam@dev</span>:<span class="c">~</span>$ ls skills/', pause: 500 },
  { html: '<span class="c">go</span>  <span class="c">rust</span>  <span class="c">typescript</span>  <span class="c">postgres</span>  <span class="c">k8s</span>', pause: 250 },
  { html: '<span class="g">sam@dev</span>:<span class="c">~</span>$ <span class="d">scroll for more ↓</span>', pause: 0 },
];

async function typeTerminal() {
  if (reduce) { term.innerHTML = LINES.map((l) => l.html).join("\n"); return; }
  term.innerHTML = "";
  for (const line of LINES) {
    const el = document.createElement("div");
    term.appendChild(el);
    // type the plain text then swap to highlighted html
    const tmp = document.createElement("div"); tmp.innerHTML = line.html;
    const text = tmp.textContent;
    for (let i = 0; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      await wait(14 + Math.random() * 26);
    }
    el.innerHTML = line.html;
    await wait(line.pause);
  }
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
typeTerminal();

/* ---------- code editor paint (debounce.ts) ---------- */
const code = document.getElementById("code");
code.innerHTML =
`<span class="c">// debounce: run fn after calls go quiet</span>
<span class="k">export function</span> <span class="f">debounce</span>&lt;T <span class="k">extends</span> unknown[]&gt;(
  fn: (...a: T) =&gt; <span class="k">void</span>,
  wait = <span class="n">300</span>,
) {
  <span class="k">let</span> t: ReturnType&lt;<span class="k">typeof</span> setTimeout&gt;;
  <span class="k">return</span> (...args: T) =&gt; {
    <span class="f">clearTimeout</span>(t);
    t = <span class="f">setTimeout</span>(() =&gt; <span class="f">fn</span>(...args), wait);
  };
}`;

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 5) * 0.05 + "s"; io.observe(el); });

/* ---------- count-up stats ---------- */
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
