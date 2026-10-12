# 💕 Nada & Nadia — Kisah Cinta Kita

Website romantis berisi galeri kenangan, timeline perjalanan cinta, dan surat cinta untuk pasangan Nada & Nadia.

[Panduan foto](./public/images/README.md)

## ✨ Fitur

- 💑 **Hero Section** — Nama, tanggal jadian & countdown timer real-time
- 📅 **Timeline** — Perjalanan kisah cinta yang bisa diedit di code
- 📸 **Galeri Foto** — Polaroid style dengan lightbox (klik/swipe untuk memperbesar)
- 💌 **Surat Cinta** — Pesan personal yang bisa diedit di code, dengan animasi BlurText per kata
- 🎵 **Music Player** — Musik latar dengan play/pause, shuffle, repeat & volume control
- 🌙 **Dark Mode** — Toggle tema gelap/terang (tersimpan di browser)
- 📱 **Responsive** — Tampil sempurna di HP maupun desktop
- 📲 **PWA** — Bisa di-install ke home screen, service worker untuk offline

## 🚀 Cara Menjalankan

```bash
# 1. Clone repo ini
git clone https://github.com/username/nada-nadia.git
cd nada-nadia

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev

# 4. Buka di browser: http://localhost:5173/nadanadia/
```

> Base path default adalah `/nadanadia/` (lihat `vite.config.ts`).

## 🎨 Cara Kustomisasi

### Mengubah Timeline
Buka `src/components/Timeline.tsx` dan edit array `TIMELINE_ITEMS`:
```js
const TIMELINE_ITEMS = [
  {
    date: '15 April 2026',
    icon: '💑',
    title: 'Awal Kisah Kita',
    description: 'Deskripsi momen...',
  },
  // tambah lebih banyak di sini!
];
```

### Mengubah Surat Cinta
Buka `src/components/LoveLetter.tsx` dan edit objek `LOVE_LETTER`:
```js
const LOVE_LETTER = {
  greeting: 'Untuk Nadia Tersayangku,',
  paragraphs: ['Paragraf 1...', 'Paragraf 2...'],
  closing: 'Dengan seluruh cintaku,',
  signature: 'Nada ♥',
};
```

### Mengubah Tanggal Jadian
Buka `src/data/anniversary.ts` dan ubah `ANNIVERSARY_DATE`
(konstanta ini dipakai bersama oleh countdown timer dan badge tanggal di Hero).

### Menambah Musik
1. Taruh file mp3 di `public/music/`
2. Daftarkan di array `PLAYLIST` dalam `src/components/MusicPlayer.tsx`

### Menambah Foto
1. Upload foto ke `public/photos/`
2. Tambahkan ke array `STATIC_PHOTOS` dalam `src/components/Gallery.tsx`

## 🌐 Deploy

### GitHub Pages (otomatis via GitHub Actions)
Workflow di `.github/workflows/deploy.yml` build & deploy ke **branch `gh-pages`**:
1. Push code ke branch `main`
2. Pergi ke **Settings → Pages**
3. Set source ke **Deploy from a branch** → branch `gh-pages` / `/ (root)`
4. Website akan build & deploy otomatis!

Base path otomatis mengikuti nama repo (`BASE_PATH=/<nama-repo>/` di-set oleh workflow).

### Vercel
Vercel otomatis terdeteksi (`VERCEL` env) → base path `/`. Tidak perlu konfigurasi tambahan.

### Base path manual
Jika butuh base path lain, set environment variable saat build:
```bash
BASE_PATH=/nama-path/ npm run build
```

## 🛠️ Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v3**
- **Google Fonts** — Dancing Script, Playfair Display, Lato
- **oxlint** untuk linting

## TypeScript dan validasi

Gunakan Node.js 20.19+ atau 22.12+ sesuai persyaratan Vite.

```bash
npm run typecheck
npm run lint
npm run build
```

Build otomatis memeriksa tipe dan menghasilkan service worker dari `src/sw.ts`.
Komponen ada di `src/components`, hooks di `src/hooks`, context tema di
`src/context`, tipe musik di `src/types`, dan tanggal bersama di `src/data`.
Detail perubahan dan verifikasi: [laporan migrasi](./docs/typescript-migration.md).

---

Made with ♥ for Nada & Nadia
