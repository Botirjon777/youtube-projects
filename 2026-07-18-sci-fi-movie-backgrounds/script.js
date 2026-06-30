/* =========================================================
   Sci-Fi Movie Backgrounds — Interstellar · Inception · Blade Runner
   One canvas engine, three mouse-reactive themes. No libraries.
   ========================================================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (a, b) => a + Math.random() * (b - a);

let W = 0, H = 0, DPR = 1;
const mouse = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, has: false };

function resize() {
  DPR = Math.min(devicePixelRatio || 1, 2);
  W = canvas.width = innerWidth * DPR | 0;
  H = canvas.height = innerHeight * DPR | 0;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  if (active) active.init();
}
function setMouse(px, py) { mouse.tx = px * DPR; mouse.ty = py * DPR; mouse.has = true; }
addEventListener("mousemove", (e) => setMouse(e.clientX, e.clientY));
addEventListener("touchmove", (e) => { if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
function updateMouse() {
  if (!mouse.has) { mouse.x = W / 2; mouse.y = H / 2; mouse.tx = mouse.x; mouse.ty = mouse.y; }
  const nx = mouse.x + (mouse.tx - mouse.x) * 0.12, ny = mouse.y + (mouse.ty - mouse.y) * 0.12;
  mouse.vx = nx - mouse.x; mouse.vy = ny - mouse.y; mouse.x = nx; mouse.y = ny;
}

/* =========================================================
   INTERSTELLAR — Gargantua: black hole + accretion disk + lensing halo
   ========================================================= */
const interstellar = {
  stars: [],
  init() {
    this.stars = Array.from({ length: Math.round((W * H) / (8000 * DPR)) },
      () => ({ x: Math.random() * W, y: Math.random() * H, r: rand(0.4, 1.7) * DPR, a: rand(0.3, 1) }));
  },
  frame(t) {
    ctx.fillStyle = "#01010a"; ctx.fillRect(0, 0, W, H);
    for (const s of this.stars) { ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fillRect(s.x, s.y, s.r, s.r); }
    const cx = mouse.x, cy = mouse.y, R = 80 * DPR;
    ctx.globalCompositeOperation = "lighter";
    // accretion disk — squashed ring of glowing particles
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2 + t * 0.4;
      const x = cx + Math.cos(a) * R * 1.7, y = cy + Math.sin(a) * R * 0.55;
      ctx.fillStyle = `rgba(255,${(150 + Math.sin(a) * 60) | 0},60,0.7)`;
      ctx.beginPath(); ctx.arc(x, y, 3 * DPR, 0, 7); ctx.fill();
    }
    // disk glow
    const dg = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 2.3);
    dg.addColorStop(0, "rgba(255,160,60,0)"); dg.addColorStop(0.5, "rgba(255,150,55,0.22)"); dg.addColorStop(1, "rgba(255,150,55,0)");
    ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(cx, cy, R * 2.3, 0, 7); ctx.fill();
    // gravitational lensing — bright halo arc over the top + disk outline
    ctx.shadowColor = "#ffb347"; ctx.shadowBlur = 22 * DPR;
    ctx.strokeStyle = "rgba(255,205,130,0.85)"; ctx.lineWidth = 4 * DPR;
    ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.7, R * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 5 * DPR;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.7, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke();
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    // event horizon
    ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  },
};

/* =========================================================
   INCEPTION — the infinite loop: rotating squares zoom forever
   ========================================================= */
const inception = {
  sq: [],
  init() {
    this.sq = Array.from({ length: 16 }, (_, i) => ({ s: i / 16, rot: i * 0.3 }));
  },
  frame(t) {
    ctx.fillStyle = "#0c0a06"; ctx.fillRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y, maxS = Math.hypot(W, H);
    ctx.lineWidth = 2 * DPR;
    for (const q of this.sq) {
      q.s += 0.004; q.rot += 0.004;
      if (q.s > 1) q.s -= 1;
      const size = q.s * q.s * maxS;                       // accelerate outward → endless zoom
      const alpha = Math.min(1, (1 - q.s) * 1.4) * Math.min(1, q.s * 5);
      ctx.strokeStyle = `rgba(214,184,122,${alpha * 0.8})`;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(q.rot + t * 0.05);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    }
    // the spinning totem
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 3);
    ctx.fillStyle = "rgba(232,201,138,0.95)";
    ctx.fillRect(-3 * DPR, -18 * DPR, 6 * DPR, 36 * DPR);
    ctx.restore();
  },
};

/* =========================================================
   BLADE RUNNER — neon rain city, searchlight follows the cursor
   ========================================================= */
const bladerunner = {
  drops: [], signs: [], sky: [],
  init() {
    this.drops = Array.from({ length: Math.round(W / (4 * DPR)) }, () => this.drop());
    const colors = ["#ff2e88", "#19d3ff", "#ffd23b", "#b14bff", "#19ff7a"];
    this.signs = Array.from({ length: 14 }, () => ({
      x: Math.random() * W, y: rand(0.1, 0.7) * H, r: rand(40, 120) * DPR,
      c: colors[(Math.random() * colors.length) | 0], ph: rand(0, 7), fr: rand(0.6, 2.2),
    }));
    this.sky = [];
    let x = 0;
    while (x < W) { const w = rand(30, 90) * DPR, h = rand(0.2, 0.6) * H; this.sky.push({ x, w, h }); x += w + rand(2, 10) * DPR; }
  },
  drop() { return { x: Math.random() * W, y: Math.random() * H, len: rand(14, 30) * DPR, sp: rand(12, 22) * DPR }; },
  frame(t) {
    ctx.fillStyle = "rgba(6,4,12,0.35)"; ctx.fillRect(0, 0, W, H);
    // flickering neon haze
    ctx.globalCompositeOperation = "lighter";
    for (const s of this.signs) {
      const fl = 0.4 + 0.6 * Math.abs(Math.sin(t * s.fr + s.ph));
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      g.addColorStop(0, s.c + "cc"); g.addColorStop(1, s.c + "00");
      ctx.globalAlpha = fl * 0.5; ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    // skyline silhouette
    ctx.fillStyle = "#02030a";
    for (const b of this.sky) ctx.fillRect(b.x, H - b.h, b.w, b.h);
    // searchlight at the cursor
    const cx = mouse.x, cy = mouse.y;
    const lg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 190 * DPR);
    lg.addColorStop(0, "rgba(120,220,255,0.16)"); lg.addColorStop(1, "rgba(120,220,255,0)");
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(cx, cy, 190 * DPR, 0, 7); ctx.fill();
    // heavy rain (wind follows mouse)
    const wind = (mouse.x / W - 0.5) * 5 * DPR;
    ctx.strokeStyle = "rgba(170,200,235,0.30)"; ctx.lineWidth = 1.3 * DPR;
    ctx.beginPath();
    for (const d of this.drops) {
      d.y += d.sp; d.x += wind;
      if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
      ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - wind * 0.4, d.y + d.len);
    }
    ctx.stroke();
  },
};

/* =========================================================
   Switching + main loop
   ========================================================= */
const THEMES = { interstellar, inception, bladerunner };
let active = interstellar;

const hero = document.getElementById("hero");
const titles = {
  interstellar: { t: "INTERSTELLAR", s: "Gargantua's disk bends around your cursor 🕳️" },
  inception:    { t: "INCEPTION", s: "an infinite dream-loop spirals from your cursor 🌀" },
  bladerunner:  { t: "BLADE RUNNER", s: "neon rain · your cursor is the searchlight 🌃" },
};

function switchTheme(name) {
  if (!THEMES[name]) return;
  active = THEMES[name];
  document.body.dataset.theme = name;
  document.getElementById("title").textContent = titles[name].t;
  document.getElementById("sub").textContent = titles[name].s;
  document.querySelectorAll(".switcher button").forEach((b) => b.classList.toggle("active", b.dataset.theme === name));
  active.init();
}
document.getElementById("switcher").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) switchTheme(btn.dataset.theme);
});

let t = 0;
function loop() {
  t += 0.016;
  updateMouse();
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  active.frame(t);
  const px = mouse.x / W - 0.5, py = mouse.y / H - 0.5;
  hero.style.transform = `translate(${-px * 22}px, ${-py * 16}px)`;
  requestAnimationFrame(loop);
}

addEventListener("resize", resize);
resize();
active.init();
if (!reduce) loop(); else active.frame(0);
