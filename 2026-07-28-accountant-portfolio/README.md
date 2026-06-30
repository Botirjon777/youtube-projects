# 📊 Accountant Portfolio — single page

> Pillar: **Tech / Creative** · Publish: **2026-07-28** · Profession series #3

A sharp, trustworthy site for a chartered accountant. Navy + gold, an **animated growth chart** that builds bar-by-bar on scroll, and **count-up results** (with $ prefixes and M/%/+ suffixes). Pure HTML/CSS/JS.

## ▶️ Run it
Open `index.html`. Scroll to watch the chart and numbers animate.

## ✨ Details
- **Growth bar chart** that grows when scrolled into view (last bar highlighted emerald = "now")
- **Count-up stats** supporting prefix/suffix and decimals (`$4.2M`, `320+`, `100%`)
- Service grid that inverts to navy on hover, founder quote, fixed-fee trust points
- Editorial **Fraunces** headings + Inter; respects `prefers-reduced-motion`

## 🎬 Video outline
1. Hook (0–3s): the bar chart building up + "▲ 38%".
2. (3–10s): results counting up ($4.2M saved…).
3. (10–16s): service cards flipping to navy on hover.
4. CTA: "Profession #3 — what job should I design next?"

## 🗣️ Talking points
- The chart is just flex `div.bar` elements with `height: 0` → set to `data-h%` on intersect, staggered by `setTimeout`. CSS transition does the rest.
- One count-up function handles prefix/suffix/decimals — reused across the whole series.
- Why navy+gold reads as "established & financial."

## 🧩 Profession series so far
Programmer (terminal) → Pharmacist (floating pills) → **Accountant (data viz)** → … next ideas: Architect, Lawyer, Chef, Photographer, Teacher, Real-estate agent, Barber, Fitness coach.
