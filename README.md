# Project Garuda: Operasi Nusantara

Versi browser game lengkap dari konsep **Open World Action + Stealth + Edukasi Anti Korupsi**.

## Cara main

Buka `index.html` langsung di browser. Game ini tidak membutuhkan instalasi dependency.

Untuk preview lokal lewat server:

```powershell
node server.mjs
```

Di Windows, bisa juga double-click:

```powershell
start-game.bat
```

Kalau `npm` tersedia di komputer kamu, bisa juga:

```powershell
npm start
```

Buka `http://localhost:8000`. Kalau port 8000 sedang dipakai, jalankan:

```powershell
$env:PORT=8123; npm start
```

Lalu buka `http://localhost:8123`.

## Kontrol

- `WASD` / tombol panah: bergerak
- `Shift`: stealth
- `E`: interaksi, bicara dengan NPC, ambil bukti
- `H`: hack terminal
- `F`: tembak pistol laser saat melawan boss
- `Q`: drone mode untuk disable kamera
- `M`: motor mode untuk bergerak cepat
- `Space`: distraksi menggunakan Intel NARA
- `P`: pause

## Fitur

- Kota open world bergaya pixel art cyberpunk Indonesia.
- Lima misi utama: Data Hilang, Uang Rakyat, Operasi Tengah Malam, Mafia Pelabuhan, dan The Minister.
- NPC informan, arsip bukti, bukti opsional, reputasi rakyat, Intel NARA, alert, stealth stamina, drone mode, motor mode, kamera, penjaga, dan final choice.
- Musik latar cyber-pixel, efek suara pistol laser, klik tombol, hacking, dan suara dialog karakter.
- Save otomatis memakai `localStorage`.
- Materi edukasi anti korupsi lewat misi dan dialog.
