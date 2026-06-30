/* =========================================================
   Marvel Hero Backgrounds — Iron Man (JARVIS) · Thor (Mjölnir)
                              · Spider-Man · Ant-Man (live ants)
   One canvas engine, four mouse-reactive themes. No libraries.

   NOTE: hero "logos" are hand-drawn vector art (no copyrighted
   images, crisp at any size, fully offline). To use your own
   licensed artwork instead, drop e.g. assets/ironman.png and
   load it in the relevant theme's draw step.
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

/* ---------- shared helpers ---------- */
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
function hexStr(n) { let s = ""; for (let i = 0; i < n; i++) s += "0123456789ABCDEF"[(Math.random() * 16) | 0]; return s; }

/* Iron Man faceplate (vector) */
function faceplate(cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 100, s / 100);
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,170,60,0.25)"; ctx.fillStyle = "rgba(255,140,40,0.05)";
  ctx.beginPath();
  ctx.moveTo(0, -100); ctx.lineTo(40, -80); ctx.lineTo(46, -10); ctx.lineTo(34, 30);
  ctx.lineTo(20, 40); ctx.lineTo(14, 80); ctx.lineTo(0, 95); ctx.lineTo(-14, 80);
  ctx.lineTo(-20, 40); ctx.lineTo(-34, 30); ctx.lineTo(-46, -10); ctx.lineTo(-40, -80);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -100); ctx.lineTo(0, 95); ctx.stroke();          // seam
  ctx.beginPath(); ctx.moveTo(-16, 55); ctx.lineTo(16, 55); ctx.stroke();          // mouth
  for (let i = -12; i <= 12; i += 6) { ctx.beginPath(); ctx.moveTo(i, 52); ctx.lineTo(i, 58); ctx.stroke(); }
  ctx.fillStyle = "rgba(140,235,255,0.85)";                                        // glowing eyes
  ctx.beginPath(); ctx.moveTo(-34, -8); ctx.lineTo(-12, -12); ctx.lineTo(-12, 2); ctx.lineTo(-32, 4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(34, -8); ctx.lineTo(12, -12); ctx.lineTo(12, 2); ctx.lineTo(32, 4); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/* Mjölnir (vector), drawn at (cx,cy), head up, scale s */
function mjolnir(cx, cy, s, ang) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = "#6b5638"; ctx.fillRect(-2.5, 0, 5, 36);                         // handle
  ctx.fillStyle = "#4a3a24"; for (let y = 3; y < 34; y += 4) ctx.fillRect(-2.5, y, 5, 1.6); // wrap
  ctx.fillStyle = "#c9b27a"; ctx.fillRect(-4, 34, 8, 4);                           // pommel
  const grd = ctx.createLinearGradient(0, -17, 0, -1);
  grd.addColorStop(0, "#eef2f6"); grd.addColorStop(0.5, "#aab4be"); grd.addColorStop(1, "#7c8791");
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.moveTo(-23, -17); ctx.lineTo(23, -17); ctx.lineTo(25, -2); ctx.lineTo(-25, -2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#5a646e"; ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = "rgba(150,210,255,0.95)"; ctx.lineWidth = 1.6;                 // rune
  ctx.beginPath(); ctx.moveTo(-6, -13); ctx.lineTo(0, -5); ctx.lineTo(6, -13); ctx.stroke();
  ctx.restore();
}

/* a little ant facing +x, drawn in ~unit space then scaled */
function drawAnt(x, y, ang, sc, t, ph) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
  const swing = Math.sin(t * 12 + ph) * 2;
  ctx.strokeStyle = "#15110c"; ctx.lineWidth = 1.1; ctx.lineCap = "round";
  for (const sgn of [-1, 1]) for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.moveTo(i * 3 - 1, 0);
    ctx.lineTo(i * 3 + swing * 0.5, sgn * 5);
    ctx.lineTo(i * 3 + swing, sgn * 8.5);
    ctx.stroke();
  }
  ctx.fillStyle = "#241c12";
  ctx.beginPath(); ctx.ellipse(-6, 0, 3.4, 2.7, 0, 0, 7); ctx.fill();              // abdomen
  ctx.beginPath(); ctx.ellipse(-1, 0, 2, 1.8, 0, 0, 7); ctx.fill();               // thorax
  ctx.beginPath(); ctx.ellipse(4, 0, 2.7, 2.3, 0, 0, 7); ctx.fill();              // head
  ctx.strokeStyle = "#241c12"; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(6, -1); ctx.lineTo(9.5, -3.2); ctx.moveTo(6, 1); ctx.lineTo(9.5, 3.2); ctx.stroke();
  ctx.restore();
}

/* =========================================================
   IRON MAN — JARVIS HUD (calculations lock onto the cursor)
   ========================================================= */
const ironman = {
  t: 0, wave: [], hexlines: [],
  init() { this.t = 0; this.wave = Array(120).fill(0); this.hexlines = []; },
  frame() {
    ctx.clearRect(0, 0, W, H);
    this.t++;
    const cx = mouse.x, cy = mouse.y;
    // background faceplate with subtle parallax
    faceplate(W / 2 + (mouse.x - W / 2) * 0.02, H / 2 + (mouse.y - H / 2) * 0.02, Math.min(W, H) * 0.24);

    // targeting reticle locked to cursor
    ctx.strokeStyle = "rgba(120,230,255,0.9)"; ctx.lineWidth = 2 * DPR;
    for (let i = 0; i < 3; i++) {
      const r = (40 + i * 18) * DPR, a = this.t * 0.02 * (i % 2 ? -1 : 1);
      ctx.beginPath(); ctx.arc(cx, cy, r, a, a + Math.PI * 1.3); ctx.stroke();
    }
    const b = 60 * DPR, k = 16 * DPR;
    ctx.strokeStyle = "rgba(255,190,70,0.9)";
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + sx * b, cy + sy * b - sy * k);
      ctx.lineTo(cx + sx * b, cy + sy * b);
      ctx.lineTo(cx + sx * b - sx * k, cy + sy * b);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(cx - 14 * DPR, cy); ctx.lineTo(cx - 5 * DPR, cy);
    ctx.moveTo(cx + 5 * DPR, cy); ctx.lineTo(cx + 14 * DPR, cy);
    ctx.moveTo(cx, cy - 14 * DPR); ctx.lineTo(cx, cy - 5 * DPR);
    ctx.moveTo(cx, cy + 5 * DPR); ctx.lineTo(cx, cy + 14 * DPR);
    ctx.stroke();

    // ---- JARVIS "calculations" ----
    const pad = 24 * DPR;
    ctx.textBaseline = "alphabetic";
    ctx.font = `${12 * DPR}px "JetBrains Mono", monospace`;
    if (this.t % 4 === 0) this.hexlines = Array.from({ length: 11 }, () => hexStr(20));
    ctx.fillStyle = "rgba(130,235,255,0.8)"; ctx.textAlign = "left";
    this.hexlines.forEach((l, i) => ctx.fillText(l, pad, pad + (i + 1) * 16 * DPR));

    // right-side system bars
    ctx.textAlign = "right";
    ["ARC REACTOR", "REPULSORS", "TARGETING", "THRUSTERS", "FLIGHT SYS"].forEach((m, i) => {
      const y = pad + (i + 1) * 32 * DPR, v = 0.5 + 0.5 * Math.sin(this.t * 0.05 + i);
      ctx.fillStyle = "rgba(255,190,70,0.9)"; ctx.fillText(m, W - pad, y);
      ctx.fillStyle = "rgba(120,230,255,0.22)"; ctx.fillRect(W - pad - 130 * DPR, y + 5 * DPR, 130 * DPR, 6 * DPR);
      ctx.fillStyle = "rgba(120,230,255,0.95)"; ctx.fillRect(W - pad - 130 * DPR, y + 5 * DPR, 130 * DPR * v, 6 * DPR);
    });
    ctx.textAlign = "left";

    // bottom scanning sine wave
    this.wave.push(Math.sin(this.t * 0.2) + rand(-0.4, 0.4)); this.wave.shift();
    ctx.strokeStyle = "rgba(120,230,255,0.7)"; ctx.lineWidth = 1.5 * DPR;
    const wy = H - pad - 24 * DPR, ww = 240 * DPR;
    ctx.beginPath();
    this.wave.forEach((v, i) => {
      const x = pad + (i / this.wave.length) * ww, y = wy + v * 16 * DPR;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // status line
    const msgs = ["ANALYZING...", "TARGET LOCKED", "CALCULATING TRAJECTORY", "SYSTEMS NOMINAL"];
    ctx.fillStyle = "rgba(255,210,120,0.95)"; ctx.font = `${13 * DPR}px "JetBrains Mono", monospace`;
    ctx.fillText(msgs[((this.t / 40) | 0) % msgs.length], pad, H - pad);

    ctx.fillStyle = "#eaffff"; ctx.beginPath(); ctx.arc(cx, cy, 4 * DPR, 0, 7); ctx.fill();
  },
};

/* =========================================================
   THOR — Mjölnir at the cursor, storm bolts strike the hammer
   ========================================================= */
const thor = {
  bolts: [], timer: 0,
  init() { this.bolts = []; this.timer = 0; },
  frame(t) {
    ctx.fillStyle = "rgba(4,8,20,0.25)"; ctx.fillRect(0, 0, W, H);
    const cx = mouse.x, cy = mouse.y, headY = cy - 18 * DPR;
    if (--this.timer <= 0) {
      this.bolts.push({ pts: jagged(rand(0, W), 0, cx, headY, 60 * DPR), life: 1 });
      this.timer = rand(10, 26);
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round"; ctx.shadowColor = "#9cf";
    // charge glow around the hammer head
    const g = ctx.createRadialGradient(cx, headY, 0, cx, headY, 90 * DPR);
    g.addColorStop(0, "rgba(120,180,255,0.35)"); g.addColorStop(1, "rgba(120,180,255,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, headY, 90 * DPR, 0, 7); ctx.fill();
    // crackle off the hammer
    ctx.shadowBlur = 12 * DPR; ctx.strokeStyle = "rgba(180,220,255,0.7)"; ctx.lineWidth = 1.6 * DPR;
    for (let i = 0; i < 5; i++) {
      const a = rand(0, 7), r = rand(24, 70) * DPR;
      strokePath(jagged(cx, headY, cx + Math.cos(a) * r, headY + Math.sin(a) * r, 18 * DPR));
    }
    // strike bolts
    ctx.shadowBlur = 18 * DPR; ctx.lineWidth = 2.6 * DPR;
    this.bolts = this.bolts.filter((bz) => {
      bz.life -= 0.06; if (bz.life <= 0) return false;
      ctx.strokeStyle = `rgba(205,228,255,${bz.life})`; strokePath(bz.pts);
      return true;
    });
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "source-over";
    // the hammer itself (gentle bob)
    mjolnir(cx, cy, 1.5 * DPR, Math.sin(t * 1.5) * 0.05);
  },
};

/* =========================================================
   SPIDER-MAN — web shoots from your cursor to nearby anchors
   (original anchor version, lightly eased so it's smoother)
   ========================================================= */
const spiderman = {
  anchors: [], ex: 0, ey: 0,
  init() {
    this.anchors = Array.from({ length: 16 }, () => ({ x: Math.random() * W, y: Math.random() * H }));
    this.ex = W / 2; this.ey = H / 2;
  },
  frame() {
    ctx.clearRect(0, 0, W, H);
    // ease the web centre toward the cursor → smoother, no jitter
    this.ex += (mouse.x - this.ex) * 0.16; this.ey += (mouse.y - this.ey) * 0.16;
    const cx = this.ex, cy = this.ey;
    // nearest anchors, then sorted by angle so the rings read cleanly
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
   ANT-MAN — real ants; Grow / Shrink / Send home / Release
   ========================================================= */
const antman = {
  ants: [], scale: 1, targetScale: 1, home: { x: 0, y: 0 }, mode: "wander",
  init() {
    this.home = { x: W * 0.13, y: H * 0.82 };
    this.scale = 1; this.targetScale = 1; this.mode = "wander";
    this.ants = Array.from({ length: 30 }, () => this.makeAnt(true));
  },
  makeAnt(spread) {
    return {
      x: spread ? Math.random() * W : this.home.x, y: spread ? Math.random() * H : this.home.y,
      ang: rand(0, 7), sp: rand(0.7, 1.4) * DPR, ph: rand(0, 7), wander: rand(0, 7), gone: false,
    };
  },
  grow() { this.targetScale = Math.min(this.targetScale * 1.6, 9); },
  shrink() { this.targetScale = Math.max(this.targetScale / 1.6, 0.35); },
  sendHome() { this.mode = "home"; },
  release() { this.mode = "wander"; for (const a of this.ants) if (a.gone) { a.gone = false; a.x = this.home.x; a.y = this.home.y; } },
  frame(t) {
    ctx.clearRect(0, 0, W, H);
    this.scale += (this.targetScale - this.scale) * 0.08;
    const hm = this.home;
    // anthill mound + hole
    ctx.fillStyle = "#3a2a18";
    ctx.beginPath(); ctx.moveTo(hm.x - 48 * DPR, hm.y);
    ctx.quadraticCurveTo(hm.x, hm.y - 46 * DPR, hm.x + 48 * DPR, hm.y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1a1206"; ctx.beginPath(); ctx.ellipse(hm.x, hm.y - 8 * DPR, 10 * DPR, 6 * DPR, 0, 0, 7); ctx.fill();

    const sc = 1.7 * DPR * this.scale;
    for (const a of this.ants) {
      if (a.gone) continue;
      let tx, ty;
      if (this.mode === "home") { tx = hm.x; ty = hm.y - 8 * DPR; }
      else { a.wander += rand(-0.3, 0.3); tx = mouse.x + Math.cos(a.wander) * 130 * DPR; ty = mouse.y + Math.sin(a.wander) * 130 * DPR; }
      let da = Math.atan2(ty - a.y, tx - a.x) - a.ang;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      a.ang += da * 0.08;
      const spd = a.sp * (0.6 + this.scale * 0.25);
      a.x += Math.cos(a.ang) * spd; a.y += Math.sin(a.ang) * spd;
      if (this.mode === "home" && Math.hypot(a.x - hm.x, a.y - (hm.y - 8 * DPR)) < 16 * DPR) { a.gone = true; continue; }
      a.x = Math.max(0, Math.min(W, a.x)); a.y = Math.max(0, Math.min(H, a.y));
      drawAnt(a.x, a.y, a.ang, sc, t, a.ph);
    }
  },
};

/* =========================================================
   Switching + main loop
   ========================================================= */
const THEMES = { ironman, thor, spiderman, antman };
let active = ironman;

const hero = document.getElementById("hero");
const antControls = document.getElementById("antControls");
const titles = {
  ironman:   { t: "IRON MAN", s: "JARVIS HUD — calculations lock onto your cursor 🔴" },
  thor:      { t: "THOR", s: "Mjölnir crackles where you point; lightning strikes ⚡" },
  spiderman: { t: "SPIDER-MAN", s: "a smooth web shoots from your cursor 🕷️" },
  antman:    { t: "ANT-MAN", s: "real ants swarm your cursor — grow, shrink, send home 🐜" },
};

function switchTheme(name) {
  if (!THEMES[name]) return;
  active = THEMES[name];
  document.body.dataset.theme = name;
  document.getElementById("title").textContent = titles[name].t;
  document.getElementById("sub").textContent = titles[name].s;
  document.querySelectorAll(".switcher button").forEach((bn) => bn.classList.toggle("active", bn.dataset.theme === name));
  antControls.hidden = name !== "antman";
  active.init();
}
document.getElementById("switcher").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) switchTheme(btn.dataset.theme);
});
antControls.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn && typeof active[btn.dataset.act] === "function") active[btn.dataset.act]();
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
