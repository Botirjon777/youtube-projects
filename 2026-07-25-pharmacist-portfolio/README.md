# 💊 Pharmacist Portfolio — single page

> Pillar: **Tech / Creative** · Publish: **2026-07-25** · Profession series #2

A warm, trustworthy site for a community pharmacist. Soft teal/mint palette, **floating pill capsules** drifting in the background, and a **live "Open now" status** that reads the real clock. Pure HTML/CSS/JS.

## ▶️ Run it
Open `index.html`.

## ✨ Details
- **Floating capsule canvas** — two-tone pills drift gently upward (DPR-aware)
- **Live opening status** — computes Open/Closed from the current day + time
- **Count-up trust stats** (years, prescriptions, satisfaction)
- Service cards, dark "about" panel with tick-list, soft elevation on hover
- Editorial serif (DM Serif Display) + Inter; respects `prefers-reduced-motion`

## 🎬 Video outline
1. Hook (0–3s): pills floating up behind a calm headline — instantly "pharmacy."
2. (3–10s): stats counting up + service cards.
3. (10–16s): show the **live Open/Closed** badge — "it knows the time."
4. CTA: "A site for every profession — who's next?"

## 🗣️ Talking points
- Capsule = two rounded half-rectangles in different colors, drawn with `arc()` caps.
- The Open/Closed badge is ~10 lines: compare `getDay()`/`getHours()` to the schedule.
- Why a calm palette + generous whitespace signals trust for health brands.

## 🧩 Profession series
Programmer → **Pharmacist** → Accountant → … each profession, its own visual language.
