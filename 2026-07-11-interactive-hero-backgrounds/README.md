# ✨ Interactive Hero Backgrounds

> Pillar: **Creative** · Publish: **2026-07-11**

**Twelve** mouse-reactive hero backgrounds in one page, switchable with a pill bar. Pure `<canvas>`, **zero libraries**. Move the mouse and everything responds — the perfect "wow moment" reel.

## ▶️ Run it
Open `index.html`. Move your mouse. Click the pills to switch themes.

## 🎨 The twelve themes
| Theme | Reacts to mouse by… |
|-------|---------------------|
| 🖥️ **Tech** | particle constellation; nodes link to each other and to your cursor, which gently pulls them |
| 🌸 **Anime** | falling sakura petals blown by a **wind that follows your mouse** (left/right) |
| 🎮 **Gaming** | synthwave perspective grid + sun; the **horizon/vanishing point steers** with the mouse |
| 🌊 **Water** | fast moves spawn **expanding ripples**; bubbles rise underneath |
| 💗 **Cute** | pastel aurora blobs (additive blend) with a **gooey glow that follows the cursor** + twinkling sparkles |
| 🌌 **Galaxy** | 3D starfield that **warps out of wherever you point** (classic hyperspace streaks) |
| 💚 **Matrix** | digital rain; the **column under your cursor burns bright** white |
| 🔥 **Fire** | rising embers with additive glow; your **cursor is a torch** spitting flames |
| ⚡ **Lightning** | jagged plasma bolts **arc to the cursor** every few frames (midpoint-displacement) |
| 🐠 **Boids** | a flocking swarm (alignment/cohesion/separation) that **chases your cursor** |
| ❄️ **Snow** | snowfall whose **wind direction follows your mouse** |
| 🌀 **Vortex** | particles **spiral into the cursor** like an event horizon |

The hero text also **parallaxes** opposite the cursor.

## 🎬 Video outline (Short)
1. Hook (0–2s): mouse swirling, constellation snapping to the cursor.
2. (2–10s): rapid-fire switch through all 5 themes — one satisfying beat each.
3. (10–18s): "all of this is one canvas, no libraries" — flash the theme object pattern.
4. CTA: "Which one for your portfolio? Save this."

## 🗣️ Talking points
- One engine: each theme is just `{ init(), frame(t) }`; the loop calls the active one.
- DPR-aware canvas sizing for crisp retina rendering.
- Smoothed mouse (lerp) so motion feels weighty, plus mouse **velocity** drives the water ripples.
- `globalCompositeOperation = "lighter"` is the secret behind the glowing aurora blend.
- Respects `prefers-reduced-motion` (renders one static frame).

## 🔧 Reuse it
Each theme is self-contained — copy one `{ init, frame }` object + its slice of CSS background into your own hero. Swap `titles[name]` for your copy.
