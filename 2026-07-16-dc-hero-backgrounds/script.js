/* =========================================================
   DC Hero Backgrounds — Batman · Superman · Flash · Green Lantern
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
/* stylised flying-bat silhouette */
function bat(x, y, s, flap) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-6, -4 * flap, -12, 0);
  ctx.quadraticCurveTo(-7, 1, -5, 4);
  ctx.quadraticCurveTo(-4, 1, 0, 2);
  ctx.quadraticCurveTo(4, 1, 5, 4);
  ctx.quadraticCurveTo(7, 1, 12, 0);
  ctx.quadraticCurveTo(6, -4 * flap, 0, 0);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* =========================================================
   BATMAN — Gotham rain, a bat-signal + bats homing on cursor
   ========================================================= */
const batman = {
  drops: [], bats: [],
  init() {
    this.drops = Array.from({ length: Math.round(W / (6 * DPR)) }, () => this.drop());
    this.bats = Array.from({ length: 10 }, () => this.batObj());
  },
  drop() { return { x: Math.random() * W, y: Math.random() * H, len: rand(10, 22) * DPR, sp: rand(9, 16) * DPR }; },
  batObj() { return { x: Math.random() * W, y: Math.random() * H, s: rand(1.4, 3) * DPR, vx: rand(-1, 1) * DPR, vy: rand(-1, 1) * DPR, ph: rand(0, 7) }; },
  frame(t) {
    ctx.clearRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y;
    // signal glow
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 210 * DPR);
    g.addColorStop(0, "rgba(220,235,255,0.18)"); g.addColorStop(1, "rgba(220,235,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 210 * DPR, 0, 7); ctx.fill();
    // rain
    const wind = (mouse.x / W - 0.5) * 4 * DPR;
    ctx.strokeStyle = "rgba(150,180,220,0.35)"; ctx.lineWidth = 1.4 * DPR;
    ctx.beginPath();
    for (const d of this.drops) {
      d.y += d.sp; d.x += wind;
      if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
      ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - wind * 0.5, d.y + d.len);
    }
    ctx.stroke();
    // bats home toward the cursor
    ctx.fillStyle = "#1a2230";
    for (const b of this.bats) {
      const dx = cx - b.x, dy = cy - b.y, d = Math.hypot(dx, dy) || 1;
      b.vx += dx / d * 0.03; b.vy += dy / d * 0.03; b.vx *= 0.97; b.vy *= 0.97;
      b.x += b.vx; b.y += b.vy;
      bat(b.x, b.y, b.s, 1 + Math.sin(t * 8 + b.ph) * 0.6);
    }
    // glowing emblem at cursor
    ctx.save(); ctx.shadowColor = "#cfe0ff"; ctx.shadowBlur = 22 * DPR;
    ctx.fillStyle = "#0b0f16"; bat(cx, cy, 6.5 * DPR, 1.2); ctx.restore();
  },
};

/* =========================================================
   SUPERMAN — flying forward: red/blue speed streaks + clouds
   ========================================================= */
const superman = {
  sp: [], clouds: [],
  init() {
    this.sp = Array.from({ length: Math.round((W * H) / (12000 * DPR)) }, () => this.streak());
    this.clouds = Array.from({ length: 8 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rand(120, 260) * DPR, v: rand(0.2, 0.6) * DPR, a: rand(0.05, 0.12) }));
  },
  streak() { return { a: rand(0, 7), r: rand(10, 40) * DPR, sp: rand(3, 8) * DPR, red: Math.random() < 0.5 }; },
  frame() {
    ctx.fillStyle = "rgba(8,10,28,0.30)"; ctx.fillRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y, diag = Math.hypot(W, H);
    ctx.globalCompositeOperation = "lighter";
    // clouds
    for (const c of this.clouds) {
      c.x += c.v; if (c.x - c.r > W) c.x = -c.r;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      g.addColorStop(0, `rgba(180,200,255,${c.a})`); g.addColorStop(1, "rgba(180,200,255,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.fill();
    }
    // speed streaks radiate from the cursor
    ctx.lineWidth = 2 * DPR;
    for (const s of this.sp) {
      s.r += s.sp;
      if (s.r > diag) Object.assign(s, this.streak());
      const x1 = cx + Math.cos(s.a) * s.r, y1 = cy + Math.sin(s.a) * s.r;
      const x0 = cx + Math.cos(s.a) * (s.r - s.sp * 4), y0 = cy + Math.sin(s.a) * (s.r - s.sp * 4);
      const al = Math.min(1, s.r / 300);
      ctx.strokeStyle = (s.red ? "rgba(255,60,60," : "rgba(90,150,255,") + al + ")";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    // heat vision when moving
    if (Math.hypot(mouse.vx, mouse.vy) > 1.5 * DPR) {
      ctx.strokeStyle = "rgba(255,40,40,0.85)"; ctx.lineWidth = 3 * DPR;
      ctx.shadowColor = "#f33"; ctx.shadowBlur = 16 * DPR;
      for (const off of [-14, 14]) {
        ctx.beginPath();
        ctx.moveTo(cx + off * DPR, cy);
        ctx.lineTo(cx + off * DPR + mouse.vx * 30, cy + mouse.vy * 30);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
  },
};

/* =========================================================
   FLASH — Speed Force: a lightning trail chases the cursor
   ========================================================= */
const flash = {
  trail: [],
  init() { this.trail = []; },
  frame() {
    ctx.fillStyle = "rgba(10,6,0,0.28)"; ctx.fillRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y;
    this.trail.push({ x: cx, y: cy });
    if (this.trail.length > 22) this.trail.shift();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round"; ctx.shadowColor = "#ffb000"; ctx.shadowBlur = 18 * DPR;
    for (let i = 1; i < this.trail.length; i++) {
      const a = i / this.trail.length;
      ctx.strokeStyle = `rgba(255,${(180 * a + 40) | 0},20,${a})`;
      ctx.lineWidth = a * 8 * DPR;
      ctx.beginPath(); ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y); ctx.lineTo(this.trail[i].x, this.trail[i].y); ctx.stroke();
    }
    // crackle off the cursor
    ctx.shadowBlur = 10 * DPR; ctx.strokeStyle = "rgba(255,230,120,0.85)"; ctx.lineWidth = 1.6 * DPR;
    for (let i = 0; i < 4; i++) {
      const ang = rand(0, 7), r = rand(20, 60) * DPR;
      strokePath(jagged(cx, cy, cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 16 * DPR));
    }
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#fff3c4"; ctx.beginPath(); ctx.arc(cx, cy, 5 * DPR, 0, 7); ctx.fill();
  },
};

/* =========================================================
   GREEN LANTERN — willpower energy: rings + a ring construct
   ========================================================= */
const greenlantern = {
  rings: [], ang: 0, c: 0,
  init() { this.rings = []; this.ang = 0; this.c = 0; },
  frame() {
    ctx.fillStyle = "rgba(1,12,7,0.20)"; ctx.fillRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y;
    this.ang += 0.02; this.c++;
    if (this.c % 5 === 0) this.rings.push({ r: 6 * DPR, life: 1 });
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowColor = "#19ff7a";
    // expanding rings
    ctx.lineWidth = 3 * DPR; ctx.shadowBlur = 14 * DPR;
    this.rings = this.rings.filter((r) => {
      r.r += 4 * DPR; r.life -= 0.012; if (r.life <= 0) return false;
      ctx.strokeStyle = `rgba(60,255,130,${r.life})`;
      ctx.beginPath(); ctx.arc(cx, cy, r.r, 0, 7); ctx.stroke();
      return true;
    });
    // rotating ring construct
    ctx.strokeStyle = "rgba(120,255,170,0.9)"; ctx.lineWidth = 2.5 * DPR;
    const N = 12, R = 46 * DPR;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const a = this.ang + (i / N) * Math.PI * 2;
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // glowing core
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42 * DPR);
    g.addColorStop(0, "rgba(190,255,215,0.9)"); g.addColorStop(1, "rgba(60,255,130,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 42 * DPR, 0, 7); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
  },
};

/* =========================================================
   Switching + main loop
   ========================================================= */
const THEMES = { batman, superman, flash, greenlantern };
let active = batman;

const hero = document.getElementById("hero");
const titles = {
  batman:       { t: "BATMAN", s: "Gotham rain + a bat-signal that follows you 🦇" },
  superman:     { t: "SUPERMAN", s: "fly forward through red & blue speed streaks 🔵" },
  flash:        { t: "THE FLASH", s: "the Speed Force trails your every move ⚡" },
  greenlantern: { t: "GREEN LANTERN", s: "willpower energy rings from your cursor 💚" },
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
