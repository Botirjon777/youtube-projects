# 🎨 Designer Portfolio — single page

> Pillar: **Tech / Creative** · Publish: **2026-07-21**

A premium, editorial **single-page portfolio** for a designer/art-director. Shows off the kind of craft that wins clients — pure HTML/CSS/JS, no build, no libraries.

## ▶️ Run it
Open `index.html`. Scroll. Hover the work list. Move your mouse.

## ✨ Creative details
- **Custom cursor** — a dot + a lagging ring that *grows* over interactive elements
- **Floating work preview** — hover any project and a gradient preview card glides to your cursor (the classic agency-portfolio move)
- **Scroll-reveal** — headings and rows rise into place via `IntersectionObserver`
- **Line-by-line hero** — the display type masks up word by word
- **Infinite marquee** of services
- **Count-up stats** (120 projects, 8 years, 14 awards) when they scroll into view
- **Magnetic "Let's talk"** button that leans toward the cursor
- **Editorial type system** — Fraunces (serif display) + Space Grotesk, warm paper palette, film **grain** overlay, `mix-blend-mode` nav
- Fully responsive + respects `prefers-reduced-motion`

## 🎬 Video outline
1. Hook (0–3s): hover the work list → the preview card snapping to the cursor.
2. (3–8s): the hero text masking up + custom cursor growing on hover.
3. (8–16s): scroll-reveal cascade + count-up stats + magnetic button.
4. (16–22s): "all hand-coded, zero libraries."
5. CTA: "Steal the cursor + preview trick — save this."

## 🗣️ Talking points
- The hover preview = one fixed div, eased toward the mouse, background swapped per `data-grad`.
- Custom cursor = dot tracks instantly, ring lerps (the lag is what makes it feel premium).
- `mix-blend-mode: difference` lets the nav stay legible over both light and dark sections.
- Reveal system is just a CSS class toggled by `IntersectionObserver` — cheap and smooth.

## 🎁 Make it yours
Swap the name, copy, the four `data-grad` gradients (or replace them with real `background-image` screenshots), and the stats' `data-count` values.
