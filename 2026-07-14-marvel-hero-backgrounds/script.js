/* =========================================================
   Marvel Hero Backgrounds — Iron Man · Thor · Spider-Man · Ant-Man
   One canvas engine, four mouse-reactive themes. No libraries.
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

/* jagged lightning path via midpoint displacement (shared by Thor) */
function jagged(x1, y1, x2, y2, amp) {
  let pts = [[x1, y1], [x2, y2]];
  for (let g = 0; g < 5; g++) {
    const np = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      np.push(a, [(a[0] + b[0]) / 2 + rand(-1, 1) * amp / (g + 1),
                  (a[1] + b[1]) / 2 + rand(-1, 1) * amp / (g + 1)]);
    }
    np.push(pts[pts.length - 1]);
    pts = np;
  }
  return pts;
}
function strokePath(p) {
  ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
  for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.stroke();
}

/* =========================================================
   IRON MAN — arc-reactor HUD locks onto the cursor
   ========================================================= */
const ironman = {
  sparks: [], ang: 0,
  init() { this.sparks = []; this.ang = 0; },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y;
    // reactor glow
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 170 * DPR);
    g.addColorStop(0, "rgba(130,235,255,0.95)");
    g.addColorStop(0.4, "rgba(255,200,90,0.40)");
    g.addColorStop(1, "rgba(255,150,40,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 170 * DPR, 0, 7); ctx.fill();
    // rotating HUD arcs
    this.ang += 0.012;
    ctx.lineWidth = 2.4 * DPR;
    for (let i = 0; i < 4; i++) {
      const r = (52 + i * 28) * DPR;
      ctx.strokeStyle = i % 2 ? "rgba(255,190,70,0.85)" : "rgba(120,230,255,0.85)";
      const start = this.ang * (i % 2 ? -1.4 : 1) + i;
      ctx.beginPath(); ctx.arc(cx, cy, r, start, start + Math.PI * 1.35); ctx.stroke();
    }
    // ticks
    ctx.strokeStyle = "rgba(180,240,255,0.6)"; ctx.lineWidth = 1.5 * DPR;
    for (let k = 0; k < 36; k++) {
      const a = (k / 36) * Math.PI * 2 + this.ang;
      const r1 = 150 * DPR, r2 = (k % 3 ? 160 : 168) * DPR;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }
    // repulsor sparks on movement
    if (Math.hypot(mouse.vx, mouse.vy) > 1 * DPR)
      for (let k = 0; k < 3; k++) this.sparks.push({ x: cx, y: cy, vx: rand(-3.5, 3.5) * DPR, vy: rand(-3.5, 3.5) * DPR, life: 1 });
    ctx.globalCompositeOperation = "lighter";
    this.sparks = this.sparks.filter((s) => {
      s.life -= 0.03; if (s.life <= 0) return false;
      s.x += s.vx; s.y += s.vy; s.vx *= 0.96; s.vy *= 0.96;
      ctx.fillStyle = `rgba(255,${190 + (40 * (1 - s.life)) | 0},90,${s.life})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.6 * DPR, 0, 7); ctx.fill();
      return true;
    });
    ctx.globalCompositeOperation = "source-over";
    // core
    ctx.fillStyle = "#eaffff"; ctx.beginPath(); ctx.arc(cx, cy, 9 * DPR, 0, 7); ctx.fill();
  },
};

/* =========================================================
   THOR — storm bolts strike the cursor + Mjölnir crackle
   ========================================================= */
const thor = {
  bolts: [], timer: 0,
  init() { this.bolts = []; this.timer = 0; },
  frame() {
    ctx.fillStyle = "rgba(4,8,20,0.25)"; ctx.fillRect(0, 0, W, H);
    if (--this.timer <= 0) {
      this.bolts.push({ pts: jagged(rand(0, W), 0, mouse.x, mouse.y, 60 * DPR), life: 1 });
      this.timer = rand(10, 26);
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round"; ctx.shadowColor = "#9cf";
    // crackle around the cursor (charged hammer)
    ctx.shadowBlur = 12 * DPR; ctx.strokeStyle = "rgba(180,220,255,0.7)"; ctx.lineWidth = 1.6 * DPR;
    for (let i = 0; i < 5; i++) {
      const a = rand(0, 7), r = rand(24, 64) * DPR;
      strokePath(jagged(mouse.x, mouse.y, mouse.x + Math.cos(a) * r, mouse.y + Math.sin(a) * r, 18 * DPR));
    }
    // main bolts
    ctx.shadowBlur = 18 * DPR; ctx.lineWidth = 2.6 * DPR;
    this.bolts = this.bolts.filter((b) => {
      b.life -= 0.06; if (b.life <= 0) return false;
      ctx.strokeStyle = `rgba(205,228,255,${b.life})`;
      strokePath(b.pts);
      return true;
    });
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   SPIDER-MAN — a web that shoots from your cursor
   ========================================================= */
const spiderman = {
  anchors: [],
  init() { this.anchors = Array.from({ length: 16 }, () => ({ x: Math.random() * W, y: Math.random() * H })); },
  frame() {
    ctx.clearRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y;
    // nearest anchors, sorted by angle so the web reads cleanly
    const near = this.anchors
      .map((a) => ({ a, d: Math.hypot(a.x - cx, a.y - cy) }))
      .sort((p, q) => p.d - q.d).slice(0, 8).map((o) => o.a)
      .sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx));
    // radial strands
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 1.3 * DPR;
    near.forEach((a) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(a.x, a.y); ctx.stroke(); });
    // concentric rings between strands
    ctx.strokeStyle = "rgba(210,230,255,0.5)";
    for (let ring = 1; ring <= 4; ring++) {
      const t = ring / 4.4;
      ctx.beginPath();
      near.forEach((a, i) => {
        const x = cx + (a.x - cx) * t, y = cy + (a.y - cy) * t;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath(); ctx.stroke();
    }
    // spider node
    ctx.fillStyle = "#e62429"; ctx.beginPath(); ctx.arc(cx, cy, 5 * DPR, 0, 7); ctx.fill();
    ctx.fillStyle = "#1a55ff"; ctx.beginPath(); ctx.arc(cx, cy, 2 * DPR, 0, 7); ctx.fill();
  },
};

/* =========================================================
   ANT-MAN — Quantum Realm tunnel of rings around the cursor
   ========================================================= */
const antman = {
  rings: [], specks: [], t: 0,
  init() {
    this.rings = []; this.t = 0;
    this.specks = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rand(1, 3) * DPR, hue: rand(180, 320), ph: rand(0, 7) }));
  },
  frame() {
    ctx.fillStyle = "rgba(6,2,16,0.18)"; ctx.fillRect(0, 0, W, H);
    this.t++;
    if (this.t % 4 === 0) this.rings.push({ r: 6 * DPR, hue: (this.t * 5) % 360, life: 1 });
    ctx.globalCompositeOperation = "lighter";
    const cx = mouse.x, cy = mouse.y;
    ctx.lineWidth = 3 * DPR;
    this.rings = this.rings.filter((r) => {
      r.r += 4.5 * DPR; r.life -= 0.011; if (r.life <= 0) return false;
      ctx.strokeStyle = `hsla(${r.hue},90%,62%,${r.life})`;
      ctx.beginPath(); ctx.ellipse(cx, cy, r.r, r.r * 0.7, 0, 0, 7); ctx.stroke();
      return true;
    });
    // quantum specks twinkle
    for (const s of this.specks) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(this.t * 0.03 + s.ph));
      ctx.fillStyle = `hsla(${s.hue},90%,70%,${a})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   Switching + main loop
   ========================================================= */
const THEMES = { ironman, thor, spiderman, antman };
let active = ironman;

const hero = document.getElementById("hero");
const titles = {
  ironman:   { t: "IRON MAN", s: "arc-reactor HUD that locks onto your cursor 🔴" },
  thor:      { t: "THOR", s: "storm bolts strike wherever you point ⚡" },
  spiderman: { t: "SPIDER-MAN", s: "a web shoots from your cursor 🕷️" },
  antman:    { t: "ANT-MAN", s: "shrink into the Quantum Realm tunnel 🐜" },
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
  hero.style.transform = `translate(${-px * 26}px, ${-py * 18}px)`;
  requestAnimationFrame(loop);
}

addEventListener("resize", resize);
resize();
active.init();
if (!reduce) loop(); else active.frame(0);
