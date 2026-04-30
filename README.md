<div align="center">

# 🗺️ Matemap

**A Tinder-inspired roommate matching app for Kasetsart University students**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?style=flat-square&logo=react)](https://expo.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-Admin_Panel-black?style=flat-square&logo=next.js)](https://nextjs.org/)

[📱 Download App](https://expo.dev/accounts/matheedev/projects/matemap-front/builds/df641297-3b68-4ddb-88f7-4d27a762ba2d) · [🖥️ Admin Panel](https://matemap-back.vercel.app)

</div>

---

## 📖 Overview

**Matemap** is a university startup project built to solve the roommate-finding problem for KU students. Inspired by Tinder's swipe-based UX, users can browse and match with potential roommates based on lifestyle preferences and location within the campus area.

This project consists of two repositories:
- [`matemap-front`](https://github.com/THEkingmay/matemap-front) — React Native mobile app (Expo)
- [`matemap-back`](https://github.com/THEkingmay/matemap-back) — Next.js admin panel

> 👨‍💼 **My Role:** Project Manager — led the team, planned architecture, managed sprints, and contributed to development on both sides.

---

## ✨ Features

- 🔥 **Swipe Matching** — Tinder-style card swipe to like or pass on potential roommates
- 💬 **Real-time Chat** — Instant messaging via Supabase Realtime after matching
- 👤 **Profile Setup** — Users fill in lifestyle habits, preferences, and room requirements
- 🛠️ **Admin Panel** — Web dashboard (Next.js) for managing users and reports
- 📲 **Cross-platform** — iOS & Android via Expo

---

## 🛠️ Tech Stack

### Mobile App (`matemap-front`)
| Technology | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile |
| TypeScript | Type-safe development |
| Supabase Realtime | Live chat & sync |
| Expo Router | File-based navigation |

### Admin Panel (`matemap-back`)
| Technology | Purpose |
|---|---|
| Next.js (App Router) | Web framework |
| TypeScript | Type-safe development |
| Supabase | Database & Auth |
| Tailwind CSS + Shadcn/UI | UI components |

---

## 🚀 Getting Started

### Mobile App

```bash
git clone https://github.com/THEkingmay/matemap-front.git
cd matemap-front
npm install
npx expo start
```

Or download the pre-built APK:
👉 [Expo Build Link](https://expo.dev/accounts/matheedev/projects/matemap-front/builds/df641297-3b68-4ddb-88f7-4d27a762ba2d)

### Admin Panel

```bash
git clone https://github.com/THEkingmay/matemap-back.git
cd matemap-back
npm install
```

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

```bash
npm run dev
```

---

## 📄 License

Educational project — Kasetsart University, CS Program.
