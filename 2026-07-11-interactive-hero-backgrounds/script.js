/* =========================================================
   Interactive Hero Backgrounds
   One canvas, five mouse-reactive themes. No libraries.
   Each theme = { init(), frame(t) }. Switch with the pills.
   ========================================================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let W = 0, H = 0, DPR = 1;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  if (active) active.init();
}

/* ---------- mouse (smoothed) ---------- */
const mouse = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, has: false };
function setMouse(px, py) {
  mouse.tx = px * DPR;
  mouse.ty = py * DPR;
  mouse.has = true;
}
addEventListener("mousemove", (e) => setMouse(e.clientX, e.clientY));
addEventListener("touchmove", (e) => {
  if (e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

function updateMouse() {
  if (!mouse.has) { mouse.x = W / 2; mouse.y = H / 2; mouse.tx = mouse.x; mouse.ty = mouse.y; }
  const nx = mouse.x + (mouse.tx - mouse.x) * 0.12;
  const ny = mouse.y + (mouse.ty - mouse.y) * 0.12;
  mouse.vx = nx - mouse.x;
  mouse.vy = ny - mouse.y;
  mouse.x = nx; mouse.y = ny;
}

const rand = (a, b) => a + Math.random() * (b - a);

/* =========================================================
   THEME: tech — particle constellation
   ========================================================= */
const tech = {
  pts: [],
  init() {
    const n = Math.round((W * H) / (16000 * DPR));
    this.pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: rand(-0.3, 0.3) * DPR, vy: rand(-0.3, 0.3) * DPR,
    }));
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const pts = this.pts;
    const link = 130 * DPR;
    // mouse gently pulls nearby points
    for (const p of pts) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < (200 * DPR) ** 2) { p.vx += dx * 0.00004; p.vy += dy * 0.00004; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      p.vx *= 0.99; p.vy *= 0.99;
    }
    // links
    ctx.lineWidth = DPR;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.strokeStyle = `rgba(88,166,255,${(1 - d / link) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      // link to cursor
      const mdx = pts[i].x - mouse.x, mdy = pts[i].y - mouse.y, md = Math.hypot(mdx, mdy);
      if (md < link * 1.4) {
        ctx.strokeStyle = `rgba(120,200,255,${(1 - md / (link * 1.4)) * 0.7})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    // nodes
    ctx.fillStyle = "#9fd0ff";
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 * DPR, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 3.5 * DPR, 0, 7); ctx.fill();
  },
};

/* =========================================================
   THEME: anime — falling sakura petals (wind follows mouse)
   ========================================================= */
const anime = {
  petals: [],
  init() {
    const n = Math.round((W * H) / (26000 * DPR));
    this.petals = Array.from({ length: n }, () => this.make(true));
  },
  make(spread) {
    return {
      x: Math.random() * W,
      y: spread ? Math.random() * H : -20 * DPR,
      s: rand(7, 16) * DPR,
      sy: rand(0.6, 1.6) * DPR,
      sway: rand(0, Math.PI * 2),
      swaySpd: rand(0.01, 0.03),
      rot: rand(0, Math.PI * 2),
      rotSpd: rand(-0.03, 0.03),
      hue: rand(330, 350),
    };
  },
  petal(p) {
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = `hsla(${p.hue},80%,80%,0.92)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.s / 2);
    ctx.quadraticCurveTo(p.s / 2, -p.s / 4, p.s / 3, p.s / 2);
    ctx.quadraticCurveTo(0, p.s / 4, -p.s / 3, p.s / 2);
    ctx.quadraticCurveTo(-p.s / 2, -p.s / 4, 0, -p.s / 2);
    ctx.fill();
    ctx.restore();
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const wind = (mouse.x / W - 0.5) * 4 * DPR + 0.3 * DPR;
    for (const p of this.petals) {
      p.sway += p.swaySpd;
      p.x += wind + Math.sin(p.sway) * 0.8 * DPR;
      p.y += p.sy;
      p.rot += p.rotSpd;
      if (p.y > H + 20 * DPR || p.x < -30 * DPR || p.x > W + 30 * DPR) Object.assign(p, this.make(false));
      this.petal(p);
    }
  },
};

/* =========================================================
   THEME: gaming — synthwave perspective grid
   ========================================================= */
const gaming = {
  off: 0,
  init() { this.off = 0; },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const horizon = H * 0.46;
    const vpx = W / 2 + (mouse.x - W / 2) * 0.12;   // vanishing point drifts with mouse

    // sun
    const sunR = Math.min(W, H) * 0.16;
    const g = ctx.createLinearGradient(0, horizon - sunR, 0, horizon + sunR);
    g.addColorStop(0, "#ffd24a"); g.addColorStop(0.5, "#ff5f9e"); g.addColorStop(1, "#7a2bff");
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, horizon); ctx.clip();
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(vpx, horizon, sunR, 0, 7); ctx.fill();
    ctx.restore();

    // grid floor
    this.off = (this.off + 1.2 * DPR) % (40 * DPR);
    ctx.strokeStyle = "rgba(255,80,180,0.55)";
    ctx.lineWidth = 1.4 * DPR;
    // horizontal receding lines
    for (let i = 0; i < 22; i++) {
      const t = (i * 40 * DPR + this.off) / (22 * 40 * DPR);
      const y = horizon + t * t * (H - horizon);
      ctx.globalAlpha = Math.min(1, t * 1.4);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // converging verticals
    const cols = 18;
    for (let i = -cols; i <= cols; i++) {
      const x0 = vpx + i * 14 * DPR;
      const x1 = vpx + i * ((W / cols)) ;
      ctx.beginPath(); ctx.moveTo(x0, horizon); ctx.lineTo(x1, H); ctx.stroke();
    }
  },
};

/* =========================================================
   THEME: water — ripples on move + rising bubbles
   ========================================================= */
const water = {
  ripples: [], bubbles: [],
  init() {
    this.ripples = [];
    this.bubbles = Array.from({ length: Math.round(W / (40 * DPR)) }, () => this.bubble());
  },
  bubble() {
    return { x: Math.random() * W, y: H + Math.random() * H, r: rand(2, 6) * DPR, sp: rand(0.4, 1.4) * DPR, drift: rand(-0.3, 0.3) * DPR };
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    // spawn ripples where the mouse moves fast enough
    if (Math.hypot(mouse.vx, mouse.vy) > 1.2 * DPR) {
      this.ripples.push({ x: mouse.x, y: mouse.y, r: 4 * DPR, a: 0.6 });
    }
    ctx.lineWidth = 2 * DPR;
    this.ripples = this.ripples.filter((r) => {
      r.r += 2.6 * DPR; r.a -= 0.012;
      if (r.a <= 0) return false;
      ctx.strokeStyle = `rgba(220,250,255,${r.a})`;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.stroke();
      return true;
    });
    // bubbles
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (const b of this.bubbles) {
      b.y -= b.sp; b.x += b.drift + Math.sin(b.y * 0.01) * 0.3 * DPR;
      if (b.y < -10 * DPR) Object.assign(b, this.bubble());
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
    }
  },
};

/* =========================================================
   THEME: cute — pastel aurora blobs + sparkles (gooey cursor)
   ========================================================= */
const cute = {
  blobs: [], sparks: [], cx: 0, cy: 0,
  init() {
    this.cx = W / 2; this.cy = H / 2;
    const palette = ["#ff9ed8", "#a99cff", "#9be7ff", "#ffd1a9", "#c4ffd1"];
    this.blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(120, 260) * DPR,
      vx: rand(-0.25, 0.25) * DPR, vy: rand(-0.25, 0.25) * DPR,
      c: palette[i % palette.length],
    }));
    this.sparks = Array.from({ length: 40 }, () => this.spark());
  },
  spark() { return { x: Math.random() * W, y: Math.random() * H, r: rand(1, 2.6) * DPR, ph: rand(0, 7), sp: rand(0.02, 0.06) }; },
  frame(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const b of this.blobs) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -b.r) b.x = W + b.r; if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r; if (b.y > H + b.r) b.y = -b.r;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c + "cc"); g.addColorStop(1, b.c + "00");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
    }
    // gooey cursor glow
    this.cx += (mouse.x - this.cx) * 0.08; this.cy += (mouse.y - this.cy) * 0.08;
    const cg = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, 180 * DPR);
    cg.addColorStop(0, "rgba(255,255,255,0.7)"); cg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(this.cx, this.cy, 180 * DPR, 0, 7); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    // sparkles twinkle
    for (const s of this.sparks) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(t * s.sp + s.ph));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
  },
};

/* =========================================================
   Switching + main loop
   ========================================================= */
const THEMES = { tech, anime, gaming, water, cute };
let active = tech;

const hero = document.getElementById("hero");
const titles = {
  tech:   { t: "Interactive Heroes", s: "five mouse-reactive backgrounds · pure canvas, zero libraries" },
  anime:  { t: "Sakura Dreams", s: "petals drift on a wind that follows your mouse 🌸" },
  gaming: { t: "SYNTHWAVE", s: "neon grid · move to steer the horizon 🎮" },
  water:  { t: "Make Waves", s: "every move sends ripples through the deep 🌊" },
  cute:   { t: "Soft & Sparkly", s: "pastel aurora that glows around your cursor 💗" },
};

function switchTheme(name) {
  if (!THEMES[name]) return;
  active = THEMES[name];
  document.body.dataset.theme = name;
  document.getElementById("title").textContent = titles[name].t;
  document.getElementById("sub").textContent = titles[name].s;
  document.querySelectorAll(".switcher button").forEach((b) =>
    b.classList.toggle("active", b.dataset.theme === name));
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
  active.frame(t);
  // parallax the hero text opposite the mouse
  const px = (mouse.x / W - 0.5);
  const py = (mouse.y / H - 0.5);
  hero.style.transform = `translate(${-px * 26}px, ${-py * 18}px)`;
  requestAnimationFrame(loop);
}

addEventListener("resize", resize);
resize();
active.init();
if (!reduce) loop();
else active.frame(0); // single static frame
