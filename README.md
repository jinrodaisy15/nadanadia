# 💕 Nada & Nadia — Kisah Cinta Kita

Website romantis berisi galeri kenangan, timeline perjalanan cinta, dan surat cinta untuk pasangan Nada & Nadia.

![Preview](./public/images/README.md)

## ✨ Fitur

- 💑 **Hero Section** — Nama, tanggal jadian & countdown timer real-time
- 📅 **Timeline** — Perjalanan kisah cinta yang bisa diedit di code
- 📸 **Galeri Foto** — Upload foto langsung dari browser (polaroid style)
- 💌 **Surat Cinta** — Pesan personal yang bisa diedit di code
- 🎵 **Music Player** — Musik latar dengan play/pause & volume control
- 💖 **Floating Hearts** — Animasi hati mengambang di background
- 📱 **Responsive** — Tampil sempurna di HP maupun desktop

## 🚀 Cara Menjalankan

```bash
# 1. Clone repo ini
git clone https://github.com/username/nada-nadia.git
cd nada-nadia

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev

# 4. Buka di browser: http://localhost:5173
```

## 🎨 Cara Kustomisasi

### Mengubah Timeline
Buka `src/components/Timeline.jsx` dan edit array `TIMELINE_ITEMS`:
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
Buka `src/components/LoveLetter.jsx` dan edit objek `LOVE_LETTER`:
```js
const LOVE_LETTER = {
  greeting: 'Untuk Nadia Tersayangku,',
  paragraphs: ['Paragraf 1...', 'Paragraf 2...'],
  closing: 'Dengan seluruh cintaku,',
  signature: 'Nada ♥',
};
```

### Menambah Musik
Taruh file musik di `public/music/music.mp3`

### Upload Foto
1. Buka website
2. Scroll ke bagian **Galeri Kenangan**
3. Klik "Pilih Foto" atau drag & drop
4. Foto tersimpan otomatis di browser

## 🌐 Deploy ke GitHub Pages

### Otomatis (via GitHub Actions)
1. Push code ke branch `main`
2. Pergi ke **Settings → Pages**
3. Set source ke **GitHub Actions**
4. Website akan build & deploy otomatis!

### Update nama repo
Buka `vite.config.js` dan ubah:
```js
const GITHUB_REPO_NAME = 'nama-repo-kamu'
```

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS v3**
- **Google Fonts** — Dancing Script, Playfair Display, Lato

---

Made with ♥ for Nada & Nadia
