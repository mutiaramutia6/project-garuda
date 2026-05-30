const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const ui = {
  missionName: document.getElementById("missionName"),
  missionText: document.getElementById("missionText"),
  objectiveText: document.getElementById("objectiveText"),
  lessonText: document.getElementById("lessonText"),
  repValue: document.getElementById("repValue"),
  evidenceValue: document.getElementById("evidenceValue"),
  intelValue: document.getElementById("intelValue"),
  modeValue: document.getElementById("modeValue"),
  evidenceList: document.getElementById("evidenceList"),
  startScreen: document.getElementById("startScreen"),
  startButton: document.getElementById("startButton"),
  continueButton: document.getElementById("continueButton"),
  resetButton: document.getElementById("resetButton"),
  pausePanel: document.getElementById("pausePanel"),
  resumeButton: document.getElementById("resumeButton"),
  saveButton: document.getElementById("saveButton"),
  hackPanel: document.getElementById("hackPanel"),
  hackTitle: document.getElementById("hackTitle"),
  hackNote: document.getElementById("hackNote"),
  hackPrompt: document.getElementById("hackPrompt"),
  hackInput: document.getElementById("hackInput"),
  hackSubmit: document.getElementById("hackSubmit"),
  hackCancel: document.getElementById("hackCancel"),
  dialogPanel: document.getElementById("dialogPanel"),
  dialogSpeaker: document.getElementById("dialogSpeaker"),
  dialogText: document.getElementById("dialogText"),
  dialogNext: document.getElementById("dialogNext"),
  choicePanel: document.getElementById("choicePanel"),
  choiceText: document.getElementById("choiceText"),
  choiceHonest: document.getElementById("choiceHonest"),
  choiceDark: document.getElementById("choiceDark")
};
const W = canvas.width;
const H = canvas.height;
const SAVE_KEY = "project-garuda-operasi-nusantara-save";
const SAFE_SPAWN = { x: 112, y: 540 };
const keys = new Set();
const audio = {
  ctx: null,
  master: null,
  musicGain: null,
  fxGain: null,
  musicTimer: null,
  musicStep: 0,
  enabled: false
};
const musicPattern = [0, 3, 7, 10, 12, 15, 17, 15, 12, 10, 14, 17, 19, 22, 19, 17, 5, 8, 12, 15, 17, 20, 22, 20, 17, 15, 12, 10, 8, 10, 12, 15, 0, 5, 8, 12, 15, 19, 22, 24, 22, 19, 17, 15, 12, 17, 19, 22, 7, 10, 14, 17, 19, 22, 24, 26, 24, 22, 19, 17, 15, 14, 12, 10];
const musicCounterMelody = [12, 10, 8, 7, 8, 10, 12, 15, 17, 15, 12, 10, 8, 10, 12, 14, 19, 17, 15, 12, 10, 12, 15, 17, 20, 19, 17, 15, 14, 12, 10, 8];
const musicHarmony = [12, 15, 19, 22, 24, 27, 24, 22, 19, 15, 12, 10];
const musicPadChords = [
  [0, 3, 7, 10],
  [-5, -2, 3, 7],
  [-7, -3, 0, 5],
  [-2, 2, 5, 8],
  [3, 7, 10, 14],
  [-9, -5, -2, 3]
];
const musicBass = [0, 0, 7, 0, 3, 3, 10, 3, -5, -5, 2, -5, -7, -7, 0, -7, 0, 7, 3, 0, -5, 2, -7, -5, 3, 10, 7, 3, -2, 5, -5, -7];
const musicArp = [0, 7, 12, 15, 19, 24, 19, 15, 3, 10, 14, 17, 22, 26, 22, 17, 5, 12, 15, 20, 24, 27, 24, 20];
const battleMelody = [0, 7, 10, 12, 15, 12, 10, 7, 3, 7, 10, 15, 17, 15, 10, 7];
const goodEndingMelody = [0, 4, 7, 12, 16, 14, 12, 7, 9, 12, 16, 19, 21, 19, 16, 12];
const badEndingMelody = [0, 3, 6, 10, 13, 10, 6, 3, -2, 1, 6, 8, 10, 8, 6, 1];
const deathEndingMelody = [0, -2, 3, 5, 7, 5, 3, -2, -5, -2, 0, 3, 5, 3, 0, -2];
const missions = [
  {
    id: "data",
    name: "Misi 1 - Data Hilang",
    text: "Masuk ke gedung pemerintahan dan curi data rahasia proyek fiktif.",
    objective: "Hack terminal DATA di Gedung Pemerintah.",
    lesson: "Korupsi data membuat publik buta terhadap penggunaan anggaran. Ketika dokumen dihapus, laporan dipalsukan, dan akses informasi ditutup, rakyat tidak bisa membuktikan penyimpangan meski dampaknya terasa di sekolah, jalan, dan layanan umum.",
    target: "data-server",
    reward: "Database proyek palsu"
  },
  {
    id: "uang",
    name: "Misi 2 - Uang Rakyat",
    text: "Ikuti aliran uang korupsi dari rekening bayangan ke markas mafia.",
    objective: "Bicara dengan saksi bank, lalu hack terminal BANK.",
    lesson: "Transparansi anggaran adalah pagar pertama melawan korupsi. Jika aliran uang dapat dilihat, warga, jurnalis, auditor, dan aparat jujur bisa menemukan rekening bayangan sebelum dana pendidikan, kesehatan, dan bantuan sosial hilang.",
    target: "bank-server",
    needsNpc: "saksi-bank",
    reward: "Jejak transfer dana rakyat"
  },
  {
    id: "sadap",
    name: "Misi 3 - Operasi Tengah Malam",
    text: "Pergi ke Hotel Garuda City, temui NARA untuk mengambil alat sadap, lalu pasang di distrik elite tanpa memicu alarm.",
    objective: "Temui NARA di Hotel Garuda City untuk alat sadap, lalu hack titik SADAP.",
    lesson: "Pelapor dan saksi harus dilindungi karena korupsi besar jarang terbuka tanpa orang berani bicara. Tanpa perlindungan, saksi dapat diancam, dipindahkan, dibungkam, atau disalahkan sehingga kejahatan jabatan tetap berulang.",
    target: "sadap-point",
    needsItem: "Alat sadap NARA",
    itemNpc: "nara",
    reward: "Rekaman rapat rahasia"
  },
  {
    id: "pelabuhan",
    name: "Misi 4 - Mafia Pelabuhan",
    text: "Bongkar penyelundupan uang ilegal di pelabuhan gelap.",
    objective: "Disable kamera pelabuhan dengan drone, lalu hack KARGO.",
    lesson: "Korupsi di pelabuhan dan distribusi membuat ekonomi melemah. Pungli, penyelundupan, dan laporan palsu menaikkan biaya barang, menghambat usaha kecil, membuat harga kebutuhan naik, dan akhirnya rakyat biasa yang menanggung kerugiannya.",
    target: "cargo-server",
    needsCameraOff: "cam-port",
    reward: "Manifest kargo uang ilegal"
  },
  {
    id: "minister",
    name: "Misi Final - The Minister",
    text: "Masuk ke tower utama, kalahkan sistem hacker gelap, dan bongkar semuanya.",
    objective: "Hack terminal PUBLIKASI, lalu kalahkan THE MINISTER.",
    lesson: "Integritas berarti memilih kepentingan rakyat meski ada risiko pribadi. Ketika bukti sudah lengkap, pilihan jujur adalah membuka kebenaran, melindungi saksi, menolak kesepakatan gelap, dan membangun sistem yang bisa diawasi bersama.",
    target: "minister-server",
    reward: "Identitas THE MINISTER"
  }
];
const districts = [
  { id: "gov", x: 24, y: 24, w: 220, h: 128, name: "Gedung Pemerintah", color: "#17293a", accent: "#29c7ff", doorX: 134, doorY: 154 },
  { id: "bank", x: 292, y: 28, w: 198, h: 130, name: "Jakarta Futuristik", color: "#142536", accent: "#ff3b5f", doorX: 392, doorY: 160 },
  { id: "elite", x: 548, y: 26, w: 156, h: 132, name: "Distrik Elite", color: "#221b35", accent: "#b88cff", doorX: 626, doorY: 160 },
  { id: "tower", x: 780, y: 32, w: 196, h: 138, name: "Tower Garuda Hitam", color: "#241421", accent: "#ffd166", doorX: 878, doorY: 172 },
  { id: "port", x: 34, y: 342, w: 258, h: 146, name: "Pelabuhan Gelap", color: "#10232f", accent: "#29c7ff", doorX: 164, doorY: 490 },
  { id: "village", x: 348, y: 342, w: 228, h: 146, name: "Hotel Garuda City", color: "#131b2e", accent: "#29c7ff", doorX: 462, doorY: 490 },
  { id: "mafia", x: 632, y: 342, w: 210, h: 146, name: "Markas Mafia", color: "#271920", accent: "#ff3b5f", doorX: 738, doorY: 490 },
  { id: "clinic", x: 898, y: 344, w: 88, h: 144, name: "Klinik Publik", color: "#132a2a", accent: "#2ee89b", doorX: 942, doorY: 490 },
  { id: "media", x: 908, y: 226, w: 78, h: 72, name: "Media", color: "#1a2536", accent: "#29c7ff", doorX: 948, doorY: 300 }
];
const interiors = {
  gov: { name: "Lobi Gedung Pemerintah", wall: "#14263a", floor: "#0c1724", accent: "#29c7ff", exitX: 512, exitY: 530 },
  bank: { name: "Ruang Arsip Bank Kota", wall: "#172231", floor: "#0d1925", accent: "#ff3b5f", exitX: 512, exitY: 530 },
  elite: { name: "Apartemen Distrik Elite", wall: "#211a35", floor: "#140f24", accent: "#b88cff", exitX: 512, exitY: 530 },
  tower: { name: "Atrium Tower Garuda Hitam", wall: "#251321", floor: "#160a14", accent: "#ffd166", exitX: 512, exitY: 530 },
  port: { name: "Gudang Pelabuhan Gelap", wall: "#102838", floor: "#07151e", accent: "#29c7ff", exitX: 512, exitY: 530 },
  village: { name: "Lobby Hotel Garuda City", wall: "#10192d", floor: "#09111f", accent: "#29c7ff", exitX: 512, exitY: 530 },
  mafia: { name: "Ruang Bawah Markas Mafia", wall: "#271820", floor: "#170b10", accent: "#ff3b5f", exitX: 512, exitY: 530 },
  clinic: { name: "Klinik Publik Darurat", wall: "#112827", floor: "#0a1718", accent: "#2ee89b", exitX: 512, exitY: 530 },
  media: { name: "Studio Media Independen", wall: "#142235", floor: "#0b1421", accent: "#29c7ff", exitX: 512, exitY: 530 }
};
const backgroundBuildings = [
  { x: 4, y: 32, w: 48, h: 78, color: "rgba(12, 25, 39, 0.66)", accent: "#29c7ff" },
  { x: 78, y: 18, w: 38, h: 92, color: "rgba(19, 31, 48, 0.62)", accent: "#ffd166" },
  { x: 210, y: 46, w: 58, h: 64, color: "rgba(22, 28, 45, 0.6)", accent: "#b88cff" },
  { x: 274, y: 6, w: 36, h: 126, color: "rgba(13, 28, 46, 0.58)", accent: "#ff3b5f" },
  { x: 534, y: 24, w: 44, h: 88, color: "rgba(17, 32, 48, 0.64)", accent: "#2ee89b" },
  { x: 592, y: 2, w: 30, h: 138, color: "rgba(14, 27, 45, 0.54)", accent: "#29c7ff" },
  { x: 704, y: 12, w: 50, h: 102, color: "rgba(27, 24, 42, 0.62)", accent: "#ff3b5f" },
  { x: 828, y: 18, w: 34, h: 118, color: "rgba(24, 26, 43, 0.56)", accent: "#ffd166" },
  { x: 928, y: 34, w: 60, h: 80, color: "rgba(18, 36, 47, 0.62)", accent: "#29c7ff" },
  { x: 8, y: 282, w: 60, h: 36, color: "rgba(13, 31, 38, 0.66)", accent: "#29c7ff" },
  { x: 320, y: 300, w: 42, h: 58, color: "rgba(20, 29, 36, 0.68)", accent: "#ffd166" },
  { x: 608, y: 286, w: 52, h: 52, color: "rgba(27, 22, 39, 0.65)", accent: "#b88cff" },
  { x: 904, y: 300, w: 34, h: 48, color: "rgba(14, 30, 32, 0.7)", accent: "#2ee89b" }
];
const cityProps = [
  { type: "metro", x: 26, y: 196, w: 64, h: 42, color: "#111827", accent: "#29c7ff", label: "METRO" },
  { type: "newsstand", x: 18, y: 252, w: 62, h: 34, color: "#13243a", accent: "#ffd166", label: "KORAN" },
  { type: "warung", x: 108, y: 210, w: 62, h: 28, color: "#132b35", accent: "#ffd166", label: "CAFE" },
  { type: "foodcart", x: 118, y: 252, w: 62, h: 30, color: "#2a1d17", accent: "#ff3b5f", label: "SATE" },
  { type: "billboard", x: 212, y: 210, w: 86, h: 30, color: "#111827", accent: "#2ee89b", label: "OPEN DATA" },
  { type: "ojek", x: 316, y: 224, w: 58, h: 20, color: "#10231d", accent: "#2ee89b", label: "OJEK" },
  { type: "barrier", x: 454, y: 224, w: 74, h: 14, color: "#322417", accent: "#ffd166" },
  { type: "hologram", x: 564, y: 214, w: 48, h: 44, color: "#101827", accent: "#b88cff", label: "AI" },
  { type: "fountain", x: 642, y: 218, w: 46, h: 34, color: "#102838", accent: "#29c7ff", label: "AIR" },
  { type: "park", x: 708, y: 210, w: 84, h: 32, color: "#10231d", accent: "#2ee89b", label: "PLAZA" },
  { type: "towerRelay", x: 864, y: 212, w: 34, h: 34, color: "#221421", accent: "#ff3b5f" },
  { type: "policeVan", x: 878, y: 250, w: 70, h: 26, color: "#1a2536", accent: "#ff3b5f", label: "PATROLI" },
  { type: "busStop", x: 204, y: 524, w: 82, h: 28, color: "#102838", accent: "#29c7ff", label: "HALTE" },
  { type: "taxi", x: 330, y: 524, w: 58, h: 22, color: "#2a2311", accent: "#ffd166", label: "TAXI" },
  { type: "sportsCar", x: 590, y: 524, w: 66, h: 22, color: "#181427", accent: "#b88cff", label: "VIP" },
  { type: "market", x: 696, y: 522, w: 88, h: 36, color: "#151c2e", accent: "#ff3b5f", label: "NIGHT MART" },
  { type: "garudaSign", x: 806, y: 520, w: 56, h: 42, color: "#171327", accent: "#ffd166", label: "GARUDA" },
  { type: "hotelSign", x: 490, y: 520, w: 68, h: 36, color: "#10192d", accent: "#29c7ff", label: "HOTEL" },
  { type: "atm", x: 884, y: 522, w: 42, h: 36, color: "#102838", accent: "#2ee89b", label: "ATM" },
  { type: "trash", x: 944, y: 520, w: 42, h: 34, color: "#182536", accent: "#ff3b5f" },
  { type: "lamp", x: 84, y: 256, w: 12, h: 28, color: "#26384c", accent: "#29c7ff" },
  { type: "lamp", x: 300, y: 256, w: 12, h: 28, color: "#26384c", accent: "#ff3b5f" },
  { type: "lamp", x: 612, y: 260, w: 12, h: 28, color: "#26384c", accent: "#ffd166" },
  { type: "lamp", x: 956, y: 258, w: 12, h: 28, color: "#26384c", accent: "#2ee89b" }
];
const cityCrowd = [
  { x: 94, y: 292, skin: "warga-desa", path: 34, speed: 0.0014, label: "Warga" },
  { x: 190, y: 274, skin: "jurnalis-media", path: 42, speed: 0.0011, label: "Reporter" },
  { x: 338, y: 272, skin: "saksi-bank", path: 26, speed: 0.0015, label: "Pegawai" },
  { x: 580, y: 284, skin: "resepsionis-hotel", path: 34, speed: 0.0012, label: "Tamu" },
  { x: 742, y: 276, skin: "penjaga-elite", path: 46, speed: 0.001, label: "Security" },
  { x: 844, y: 530, skin: "teknisi-port", path: 38, speed: 0.0013, label: "Teknisi" }
];
const interiorCrowd = [
  { location: "gov", x: 246, y: 430, skin: "arsip-gov", path: 62, axis: "x", speed: 0.0012, label: "Staf" },
  { location: "gov", x: 712, y: 338, skin: "warga-desa", path: 48, axis: "y", speed: 0.001, label: "Pemohon" },
  { location: "bank", x: 292, y: 424, skin: "saksi-bank", path: 54, axis: "x", speed: 0.0011, label: "Nasabah" },
  { location: "bank", x: 704, y: 318, skin: "resepsionis-hotel", path: 38, axis: "y", speed: 0.0013, label: "Teller" },
  { location: "elite", x: 296, y: 414, skin: "penjaga-elite", path: 58, axis: "x", speed: 0.001, label: "Tamu VIP" },
  { location: "tower", x: 282, y: 416, skin: "analis-tower", path: 52, axis: "x", speed: 0.0009, label: "Analis" },
  { location: "tower", x: 752, y: 410, skin: "jurnalis-media", path: 44, axis: "y", speed: 0.0011, label: "Saksi" },
  { location: "port", x: 276, y: 414, skin: "teknisi-port", path: 72, axis: "x", speed: 0.0013, label: "Buruh" },
  { location: "village", x: 246, y: 430, skin: "warga-desa", path: 70, axis: "x", speed: 0.0012, label: "Tamu" },
  { location: "village", x: 746, y: 336, skin: "resepsionis-hotel", path: 42, axis: "y", speed: 0.001, label: "Staf Hotel" },
  { location: "mafia", x: 294, y: 418, skin: "informan-mafia", path: 56, axis: "x", speed: 0.0012, label: "Kurir" },
  { location: "clinic", x: 284, y: 416, skin: "dokter-klinik", path: 60, axis: "x", speed: 0.0014, label: "Pasien" },
  { location: "media", x: 712, y: 416, skin: "jurnalis-media", path: 64, axis: "x", speed: 0.0012, label: "Kru" }
];
const characterSkin = {
  coat: "#111820",
  armor: "#1f3144",
  scarf: "#ff3b5f",
  visor: "#29c7ff",
  skin: "#f1f7ff",
  hair: "#05070b",
  stealth: "#2ee89b"
};
const vehicleSkin = {
  body: "#29c7ff",
  bodyDark: "#0d5c7a",
  trim: "#ffd166",
  energy: "#ff3b5f",
  tire: "#05070b",
  glass: "#b9edff"
};
const npcSkins = {
  nara: { coat: "#10231d", armor: "#174633", scarf: "#2ee89b", visor: "#bfffe3", skin: "#e9f6ff", hair: "#05070b" },
  "saksi-bank": { coat: "#2a2414", armor: "#5b4420", scarf: "#ffd166", visor: "#fff1bf", skin: "#f4e2c8", hair: "#17120a" },
  "warga-desa": { coat: "#151c2e", armor: "#244b66", scarf: "#29c7ff", visor: "#b9edff", skin: "#f2d4b7", hair: "#15100d" },
  "informan-mafia": { coat: "#20162d", armor: "#3a2552", scarf: "#b88cff", visor: "#eadbff", skin: "#e6d0bb", hair: "#08050d" },
  "arsip-gov": { coat: "#17293a", armor: "#244b66", scarf: "#29c7ff", visor: "#d8f6ff", skin: "#f1d2b7", hair: "#13100e" },
  "dokter-klinik": { coat: "#edf8f4", armor: "#2f7d73", scarf: "#2ee89b", visor: "#123f3d", skin: "#e6c3aa", hair: "#25140d" },
  "jurnalis-media": { coat: "#13243a", armor: "#265579", scarf: "#29c7ff", visor: "#b9edff", skin: "#f1d6bd", hair: "#0b0811" },
  "teknisi-port": { coat: "#132b35", armor: "#1e5870", scarf: "#ffd166", visor: "#e6fbff", skin: "#e2bda0", hair: "#15110c" },
  "penjaga-elite": { coat: "#201632", armor: "#4b3474", scarf: "#b88cff", visor: "#efe2ff", skin: "#efd0b9", hair: "#090611" },
  "analis-tower": { coat: "#251321", armor: "#5c2b36", scarf: "#ffd166", visor: "#ffd6de", skin: "#eed3b5", hair: "#0d0706" },
  "resepsionis-hotel": { coat: "#17293a", armor: "#1f5f78", scarf: "#ffd166", visor: "#b9edff", skin: "#f0d1b5", hair: "#16100b" }
};
const guardSkins = {
  "Polisi Korup": { coat: "#33121c", armor: "#5b1f30", scarf: "#ff3b5f", visor: "#ffd6de", skin: "#f2d4b7", hair: "#0b0508" },
  "Hacker Gelap": { coat: "#171327", armor: "#352458", scarf: "#b88cff", visor: "#f1e8ff", skin: "#e9f6ff", hair: "#05070b" },
  "Mafia Uang": { coat: "#2b171c", armor: "#4a2230", scarf: "#ffd166", visor: "#ffe8a3", skin: "#e6c6aa", hair: "#12080a" },
  "Satpam Arsip": { coat: "#182536", armor: "#254463", scarf: "#29c7ff", visor: "#c7f2ff", skin: "#f2d4b7", hair: "#0a1017" },
  "Satpam Bank": { coat: "#231d11", armor: "#55401f", scarf: "#ffd166", visor: "#fff1bf", skin: "#f4d7bd", hair: "#100b06" },
  "Pengawal Elite": { coat: "#1d1531", armor: "#3c2a61", scarf: "#b88cff", visor: "#eadbff", skin: "#f1d0ba", hair: "#07040d" },
  "Mafia Gudang": { coat: "#24151a", armor: "#4d2631", scarf: "#ff3b5f", visor: "#ffd6de", skin: "#e7c0a7", hair: "#100608" }
};
const boss = {
  id: "the-minister",
  x: 512,
  y: 300,
  baseX: 512,
  baseY: 300,
  facing: -1,
  phase: 0,
  name: "THE MINISTER",
  location: "tower",
  color: "#ffd166",
  dialog: [
    "Kamu pikir bukti cukup untuk mengubah negeri, ARYA?",
    "Aku bukan cuma satu orang. Aku sistem yang hidup dari ketakutan.",
    "Kalau GARUDA benar-benar berani, bawa semua bukti itu ke terminal publik."
  ]
};
const terminals = [
  { id: "data-server", x: 512, y: 184, label: "DATA", type: "match", active: true, camera: null, location: "gov" },
  { id: "bank-server", x: 512, y: 178, label: "BANK", type: "password", active: true, camera: null, location: "bank" },
  { id: "sadap-point", x: 730, y: 260, label: "SADAP", type: "match", active: true, camera: null, location: "elite" },
  { id: "cargo-server", x: 512, y: 194, label: "KARGO", type: "sequence", active: true, camera: "cam-port", location: "port" },
  { id: "minister-server", x: 512, y: 166, label: "PUBLIK", type: "password", active: true, camera: null, location: "tower" }
];
const npcs = [
  {
    id: "nara",
    x: 404,
    y: 342,
    name: "NARA",
    color: "#2ee89b",
    gives: "Alat sadap NARA",
    location: "village",
    dialog: [
      "ARYA, aku pindahkan pos GARUDA ke Hotel Garuda City. Lobby ini lebih aman untuk melindungi saksi.",
      "Ambil alat sadap ini. Setelah itu pergi ke Distrik Elite dan pasang di titik SADAP tanpa memicu alarm.",
      "Drone sniper sudah ku-upgrade: rotor senyap, kamera neon, dan jammer pendek untuk mematikan CCTV.",
      "Ingat: bukti harus kuat, tapi cara kita juga harus bersih."
    ]
  },
  {
    id: "saksi-bank",
    x: 398,
    y: 304,
    name: "Saksi Bank",
    color: "#ffd166",
    gives: "Keterangan saksi bank",
    location: "bank",
    dialog: [
      "Aku melihat dana sekolah masuk ke rekening bayangan.",
      "Nomor kuncinya disamarkan dalam password: RAKYAT.",
      "Tolong lindungi identitasku. Tanpa saksi, kasus besar sering hilang."
    ]
  },
  {
    id: "warga-desa",
    x: 588,
    y: 392,
    name: "Warga Kota",
    color: "#29c7ff",
    gives: "Foto sekolah rusak",
    optional: true,
    location: "village",
    dialog: [
      "Aku mengungsi ke hotel ini setelah proyek kota dipakai untuk pencitraan, bukan layanan publik.",
      "Ambil foto ini. Biar warga kota tahu dampaknya nyata dan menuntut anggaran kembali."
    ]
  },
  {
    id: "resepsionis-hotel",
    x: 510,
    y: 292,
    name: "Resepsionis Hotel",
    color: "#ffd166",
    optional: true,
    location: "village",
    dialog: [
      "Hotel Garuda City jadi tempat aman sementara untuk NARA, saksi, dan warga kota.",
      "Di balik lampu neon, korupsi tetap meninggalkan tagihan yang harus dibayar rakyat."
    ]
  },
  {
    id: "informan-mafia",
    x: 742,
    y: 360,
    name: "Informan",
    color: "#b88cff",
    gives: "Peta markas mafia",
    optional: true,
    location: "mafia",
    dialog: [
      "Mafia uang menyimpan rute kargo di pelabuhan.",
      "Gunakan motor untuk cepat, tapi suara mesin bikin penjaga curiga."
    ]
  },
  {
    id: "arsip-gov",
    x: 326,
    y: 360,
    name: "Petugas Arsip",
    color: "#29c7ff",
    location: "gov",
    dialog: [
      "Rak kiri menyimpan kontrak palsu, tapi auditnya sengaja dibuat berlapis.",
      "Kalau data publik disembunyikan, rakyat tidak bisa mengawasi anggaran."
    ]
  },
  {
    id: "penjaga-elite",
    x: 660,
    y: 378,
    name: "Penjaga Apartemen",
    color: "#b88cff",
    location: "elite",
    dialog: [
      "Malam ini banyak tamu pejabat datang tanpa daftar resmi.",
      "Masuk pelan-pelan. Kamera di lorong masih aktif."
    ]
  },
  {
    id: "teknisi-port",
    x: 300,
    y: 418,
    name: "Teknisi Kargo",
    color: "#ffd166",
    location: "port",
    dialog: [
      "Manifest asli selalu berbeda dari laporan yang dikirim ke publik.",
      "Matikan kamera pelabuhan dulu, baru server kargo aman dibuka."
    ]
  },
  {
    id: "dokter-klinik",
    x: 632,
    y: 388,
    name: "Dokter Klinik",
    color: "#2ee89b",
    location: "clinic",
    dialog: [
      "Obat publik hilang di laporan, pasien yang menanggung akibatnya.",
      "Korupsi bukan angka di layar saja. Ia mengubah antrean menjadi luka."
    ]
  },
  {
    id: "jurnalis-media",
    x: 360,
    y: 338,
    name: "Jurnalis",
    color: "#29c7ff",
    location: "media",
    dialog: [
      "Bawa bukti yang lengkap. Media tidak cukup hanya berani; harus akurat.",
      "Kalau publik melihat pola uang, saksi, dan dampaknya, jaringan korup sulit bersembunyi."
    ]
  },
  {
    id: "analis-tower",
    x: 366,
    y: 350,
    name: "Analis GARUDA",
    color: "#ffd166",
    location: "tower",
    dialog: [
      "THE MINISTER kuat karena banyak orang merasa tidak punya pilihan.",
      "Pilihan terakhir nanti bukan cuma menang atau kalah, tapi jujur atau ikut gelap."
    ]
  }
];
const pickups = [
  { id: "invoice", x: 278, y: 240, name: "Invoice proyek palsu", active: true, location: "gov" },
  { id: "drone-log", x: 772, y: 210, name: "Log drone pengintai", active: true, location: "mafia" },
  { id: "gold-mask", x: 728, y: 164, name: "Serpihan topeng emas", active: true, location: "tower" },
  { id: "ruang-arsip", x: 264, y: 334, name: "Foto ruang arsip gelap", active: true, location: "bank" },
  { id: "clinic-report", x: 704, y: 250, name: "Data obat publik hilang", active: true, location: "clinic" },
  { id: "media-drive", x: 326, y: 246, name: "Rekaman siaran dibungkam", active: true, location: "media" }
];
const guards = [
  { x: 212, y: 222, baseX: 212, baseY: 222, dx: 1.2, dy: 0, range: 85, phase: 0, type: "Polisi Korup" },
  { x: 478, y: 236, baseX: 478, baseY: 236, dx: 0, dy: 1.1, range: 74, phase: 1, type: "Hacker Gelap" },
  { x: 760, y: 238, baseX: 760, baseY: 238, dx: 1.1, dy: 0, range: 95, phase: 2, type: "Mafia Uang" },
  { x: 258, y: 520, baseX: 258, baseY: 520, dx: 1.3, dy: 0, range: 110, phase: 3, type: "Mafia Uang" },
  { x: 718, y: 462, baseX: 718, baseY: 462, dx: 0, dy: 1, range: 72, phase: 4, type: "Polisi Korup" },
  { x: 882, y: 270, baseX: 882, baseY: 270, dx: 1, dy: 0, range: 72, phase: 5, type: "Hacker Gelap" },
  { x: 310, y: 284, baseX: 310, baseY: 284, dx: 1, dy: 0, range: 96, phase: 2.4, type: "Satpam Arsip", location: "gov" },
  { x: 676, y: 312, baseX: 676, baseY: 312, dx: 0, dy: 1, range: 82, phase: 1.7, type: "Satpam Bank", location: "bank" },
  { x: 344, y: 382, baseX: 344, baseY: 382, dx: 1, dy: 0, range: 120, phase: 4.2, type: "Pengawal Elite", location: "elite" },
  { x: 736, y: 326, baseX: 736, baseY: 326, dx: 0, dy: 1, range: 95, phase: 3.4, type: "Hacker Gelap", location: "tower" },
  { x: 314, y: 334, baseX: 314, baseY: 334, dx: 1, dy: 0, range: 108, phase: 5.2, type: "Mafia Gudang", location: "port" },
  { x: 704, y: 344, baseX: 704, baseY: 344, dx: 0, dy: 1, range: 92, phase: 6.2, type: "Mafia Uang", location: "mafia" }
];
const cameras = [
  { id: "cam-gov", x: 88, y: 202, angle: 0, speed: 0.018, disabled: false },
  { id: "cam-bank", x: 558, y: 224, angle: 1.6, speed: -0.014, disabled: false },
  { id: "cam-tower", x: 888, y: 230, angle: 3.1, speed: 0.016, disabled: false },
  { id: "cam-port", x: 246, y: 326, angle: 4.6, speed: -0.015, disabled: false },
  { id: "cam-mafia", x: 648, y: 508, angle: 4.4, speed: -0.012, disabled: false },
  { id: "cam-gov-in", x: 250, y: 164, angle: 0.4, speed: 0.015, disabled: false, location: "gov" },
  { id: "cam-bank-in", x: 762, y: 178, angle: 2.7, speed: -0.013, disabled: false, location: "bank" },
  { id: "cam-tower-in", x: 742, y: 168, angle: 2.9, speed: 0.017, disabled: false, location: "tower" }
];
const player = {
  x: SAFE_SPAWN.x,
  y: SAFE_SPAWN.y,
  lastSafeX: SAFE_SPAWN.x,
  lastSafeY: SAFE_SPAWN.y,
  speed: 2.35,
  mode: "Jalan",
  stealth: false,
  stamina: 100,
  caught: 0,
  facing: 1,
  moving: false,
  walkPhase: 0
};
const state = {
  running: false,
  paused: false,
  mission: 0,
  reputation: 50,
  intel: 1,
  alert: 0,
  evidence: [],
  inventory: [],
  completedNpc: [],
  message: "PROJECT GARUDA siap. Mulai game untuk Operasi Nusantara.",
  messageTimer: 0,
  dialog: null,
  dialogIndex: 0,
  hack: null,
  ending: null,
  distraction: 0,
  shake: 0,
  transition: null,
  bossHp: 260,
  bossMaxHp: 260,
  bossDefeated: false,
  bossAttackCooldown: 0,
  attackCooldown: 0,
  slashTimer: 0,
  playerLives: 2,
  playerMaxLives: 2,
  playerArmor: 100,
  playerHp: 100,
  location: "outside",
  outsideX: SAFE_SPAWN.x,
  outsideY: SAFE_SPAWN.y
};
const playerShots = [];
const bossLasers = [];
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function safeNumber(value, fallback, min, max) {
  const number = Number(value);
  return Number.isFinite(number) ? clamp(number, min, max) : fallback;
}
function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}
function initAudio() {
  if (audio.ctx) return true;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return false;
  audio.ctx = new AudioCtor();
  audio.master = audio.ctx.createGain();
  audio.musicGain = audio.ctx.createGain();
  audio.fxGain = audio.ctx.createGain();
  audio.master.gain.value = 0.82;
  audio.musicGain.gain.value = 0.5;
  audio.fxGain.gain.value = 0.72;
  audio.musicGain.connect(audio.master);
  audio.fxGain.connect(audio.master);
  audio.master.connect(audio.ctx.destination);
  return true;
}
function resumeAudio() {
  if (!initAudio()) return;
  if (audio.ctx.state === "suspended") audio.ctx.resume();
  audio.enabled = true;
  startMusic();
}
function midiToFreq(note) {
  return 440 * 2 ** ((note - 69) / 12);
}
function playTone(freq, duration = 0.12, type = "square", volume = 0.18, destination = audio.master, when = 0) {
  if (!audio.ctx || !audio.enabled) return;
  const start = audio.ctx.currentTime + when;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}
function playChord(notes, root, duration = 0.55, type = "sine", volume = 0.026, when = 0) {
  notes.forEach((note, index) => {
    playTone(midiToFreq(root + note), duration, type, volume, audio.musicGain, when + index * 0.018);
  });
}
function playNoise(duration = 0.09, volume = 0.12, when = 0) {
  if (!audio.ctx || !audio.enabled) return;
  const start = audio.ctx.currentTime + when;
  const length = Math.max(1, Math.floor(audio.ctx.sampleRate * duration));
  const buffer = audio.ctx.createBuffer(1, length, audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(gain);
  gain.connect(audio.fxGain || audio.master);
  source.start(start);
}
function playKick(when = 0) {
  if (!audio.ctx || !audio.enabled) return;
  const start = audio.ctx.currentTime + when;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, start);
  osc.frequency.exponentialRampToValueAtTime(45, start + 0.12);
  gain.gain.setValueAtTime(0.16, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
  osc.connect(gain);
  gain.connect(audio.musicGain);
  osc.start(start);
  osc.stop(start + 0.16);
}
function playHat(when = 0) {
  playNoise(0.028, 0.032, when);
}
function playSnare(when = 0) {
  if (!audio.ctx || !audio.enabled) return;
  playNoise(0.085, 0.07, when);
  playTone(190, 0.06, "triangle", 0.04, audio.musicGain, when + 0.005);
  playTone(380, 0.035, "square", 0.025, audio.musicGain, when + 0.018);
}
function playRiser(root, when = 0) {
  for (let i = 0; i < 5; i += 1) {
    playTone(midiToFreq(root + 24 + i * 3), 0.045, "triangle", 0.028, audio.musicGain, when + i * 0.035);
  }
}
function musicShouldPause() {
  return (!state.running && !state.ending) || (state.paused && !state.dialog && !state.hack && !state.ending);
}
function currentMusicMode() {
  if (state.ending === "baik") return "good-ending";
  if (state.ending === "buruk") return "bad-ending";
  if (state.ending === "mati") return "death-ending";
  if (bossAwake()) return "battle";
  return "explore";
}
function startMusic() {
  if (!audio.ctx || audio.musicTimer) return;
  audio.musicTimer = window.setInterval(() => {
    if (!audio.enabled || musicShouldPause()) return;
    const step = audio.musicStep % musicPattern.length;
    const barStep = audio.musicStep % 16;
    const phraseStep = audio.musicStep % 64;
    const mode = currentMusicMode();
    const battleMix = mode === "battle";
    const goodEnding = mode === "good-ending";
    const badEnding = mode === "bad-ending";
    const deathEnding = mode === "death-ending";
    const endingMix = goodEnding || badEnding || deathEnding;
    const melody = battleMix ? battleMelody : goodEnding ? goodEndingMelody : badEnding ? badEndingMelody : deathEnding ? deathEndingMelody : musicPattern;
    const melodyStep = audio.musicStep % melody.length;
    const root = battleMix ? 45 : goodEnding ? 52 : badEnding ? 41 : deathEnding ? 38 : currentLocation() === "village" ? 52 : currentLocation() === "tower" ? 48 : 50;
    const leadNote = root + 24 + melody[melodyStep];
    const counterNote = root + 24 + musicCounterMelody[audio.musicStep % musicCounterMelody.length];
    const arpNote = root + 24 + musicArp[audio.musicStep % musicArp.length];
    const bassNote = root + musicBass[audio.musicStep % musicBass.length];
    if (!deathEnding && (barStep === 0 || barStep === 8 || (battleMix && (barStep === 4 || barStep === 12)))) playKick();
    if (battleMix && (barStep === 2 || barStep === 10)) playKick(0.035);
    if (!deathEnding && (barStep === 4 || barStep === 12)) playSnare(0.005);
    if (!endingMix && (barStep === 3 || barStep === 7 || barStep === 11 || barStep === 15)) playHat(0.02);
    if (battleMix && barStep % 2 === 1) playHat(0.014);
    if ((battleMix || badEnding) && (barStep === 3 || barStep === 11)) playNoise(0.025, 0.018, 0.02);
    playTone(midiToFreq(bassNote), deathEnding ? 0.5 : 0.3, battleMix || badEnding ? "sawtooth" : "triangle", battleMix ? 0.13 : endingMix ? 0.075 : 0.09, audio.musicGain);
    playTone(midiToFreq(bassNote - 12), deathEnding ? 0.42 : 0.26, "sine", battleMix ? 0.07 : 0.052, audio.musicGain, 0.012);
    if (!deathEnding && barStep % 2 === 0) playTone(midiToFreq(arpNote), battleMix ? 0.1 : 0.14, "triangle", battleMix ? 0.066 : 0.044, audio.musicGain, 0.045);
    if (barStep === 0 || barStep === 4 || barStep === 8 || barStep === 12) playTone(midiToFreq(leadNote), endingMix ? 0.34 : 0.18, battleMix ? "square" : "triangle", battleMix ? 0.12 : goodEnding ? 0.082 : badEnding ? 0.07 : deathEnding ? 0.058 : 0.075, audio.musicGain, 0.02);
    if (!battleMix && !deathEnding && (barStep === 6 || barStep === 14)) playTone(midiToFreq(counterNote), 0.2, "sine", goodEnding ? 0.055 : 0.05, audio.musicGain, 0.08);
    if (barStep % 4 === 1 && !deathEnding) playTone(midiToFreq(root + musicHarmony[(audio.musicStep >> 1) % musicHarmony.length]), 0.22, "triangle", 0.05, audio.musicGain, 0.04);
    if (barStep === 6 || barStep === 14) playChord(goodEnding ? [0, 4, 7, 12] : badEnding ? [0, 3, 6, 10] : deathEnding ? [0, 3, 7] : [0, 7, 12], root + 24, endingMix ? 0.55 : 0.28, "sine", battleMix ? 0.025 : 0.022, 0.035);
    if (barStep === 0 || barStep === 8) {
      const chord = goodEnding ? [0, 4, 7, 12] : badEnding ? [0, 3, 6, 10] : deathEnding ? [0, 3, 7, 10] : musicPadChords[(audio.musicStep >> 4) % musicPadChords.length];
      playChord(chord, root + 12, endingMix ? 0.9 : 0.62, "sine", battleMix ? 0.03 : 0.026);
    }
    if ((battleMix || goodEnding) && (barStep === 7 || barStep === 15)) playTone(midiToFreq(leadNote + 12), 0.1, "triangle", 0.065, audio.musicGain, 0.08);
    if (battleMix && (phraseStep === 31 || phraseStep === 63)) playRiser(root, 0.02);
    audio.musicStep += 1;
  }, 136);
}
function playButtonSound() {
  resumeAudio();
  playTone(760, 0.055, "square", 0.09);
  playTone(1140, 0.045, "triangle", 0.055, audio.master, 0.035);
}
function playShootSound() {
  resumeAudio();
  playTone(1320, 0.08, "sawtooth", 0.16);
  playTone(580, 0.12, "square", 0.08, audio.master, 0.035);
  playNoise(0.07, 0.055);
}
function playVoiceSound(speaker = "") {
  resumeAudio();
  const base = speaker === "THE MINISTER" ? 170 : speaker === "NARA" ? 520 : 390;
  for (let i = 0; i < 4; i += 1) {
    playTone(base + i * 42 + Math.random() * 28, 0.035, "square", 0.055, audio.master, i * 0.045);
  }
}
function playHackSound(success) {
  resumeAudio();
  if (success) {
    playTone(520, 0.06, "triangle", 0.09);
    playTone(780, 0.08, "triangle", 0.09, audio.master, 0.06);
    playTone(1040, 0.1, "triangle", 0.08, audio.master, 0.13);
  } else {
    playTone(180, 0.12, "sawtooth", 0.12);
    playNoise(0.12, 0.08, 0.02);
  }
}
function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  if (!lengthSq) return dist(px, py, ax, ay);
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / lengthSq, 0, 1);
  return dist(px, py, ax + dx * t, ay + dy * t);
}
function currentLocation() {
  return state.location || "outside";
}
function inCurrentLocation(entity) {
  return (entity.location || "outside") === currentLocation();
}
function activeInterior() {
  return interiors[currentLocation()] || null;
}
function gameplayLocked() {
  return !state.running || state.paused || state.dialog || state.hack || state.ending;
}
function nearestDoor() {
  if (currentLocation() !== "outside") return null;
  return districts.find((district) => dist(player.x, player.y, district.doorX, district.doorY) < 42);
}
function collisionRadius() {
  if (player.mode === "Motor") return 20;
  if (player.mode === "Drone") return 12;
  return 13;
}
function collidesWithRect(x, y, rect, radius) {
  const nearestX = clamp(x, rect.x, rect.x + rect.w);
  const nearestY = clamp(y, rect.y, rect.y + rect.h);
  return dist(x, y, nearestX, nearestY) < radius;
}
function collidesWithDistrict(x, y, radius = collisionRadius()) {
  if (currentLocation() !== "outside") return null;
  return districts.find((district) => {
    const body = { x: district.x, y: district.y, w: district.w, h: district.h - 4 };
    const atDoorMouth = Math.abs(x - district.doorX) < 26 && y >= district.y + district.h - 12;
    return !atDoorMouth && collidesWithRect(x, y, body, radius);
  }) || null;
}
function collidesWithCityProp(x, y, radius = collisionRadius()) {
  return null;
}
function playerIsInsideSolid() {
  if (currentLocation() !== "outside") return false;
  return Boolean(collidesWithDistrict(player.x, player.y));
}
function movePlayerToSafeSpawn() {
  player.x = SAFE_SPAWN.x;
  player.y = SAFE_SPAWN.y;
  player.lastSafeX = SAFE_SPAWN.x;
  player.lastSafeY = SAFE_SPAWN.y;
  state.outsideX = SAFE_SPAWN.x;
  state.outsideY = SAFE_SPAWN.y;
}
function resolveOutsideBuildings(nextX, nextY) {
  if (currentLocation() !== "outside") return { x: nextX, y: nextY };
  let resolvedX = nextX;
  let resolvedY = player.y;
  if (collidesWithDistrict(resolvedX, resolvedY)) resolvedX = player.x;
  resolvedY = nextY;
  if (collidesWithDistrict(resolvedX, resolvedY)) resolvedY = player.y;
  if (collidesWithDistrict(resolvedX, resolvedY)) {
    resolvedX = player.x;
    resolvedY = player.y;
  }
  return { x: resolvedX, y: resolvedY };
}
function setMessage(text, duration = 260) {
  state.message = text;
  state.messageTimer = duration;
}
function revivePlayer(reason) {
  state.playerLives -= 1;
  state.playerHp = 100;
  state.playerArmor = 65;
  state.alert = 0;
  state.distraction = 90;
  state.shake = 18;
  player.x = player.lastSafeX;
  player.y = player.lastSafeY;
  player.mode = "Jalan";
  bossLasers.length = 0;
  playerShots.length = 0;
  setMessage(`${reason} Sisa nyawa ARYA: ${state.playerLives}/${state.playerMaxLives}. Armor darurat aktif.`, 520);
}
function damagePlayer(amount, reason) {
  let remainingDamage = amount;
  const armorHit = Math.min(state.playerArmor, remainingDamage);
  state.playerArmor = clamp(state.playerArmor - armorHit, 0, 100);
  remainingDamage -= armorHit;
  if (remainingDamage > 0) state.playerHp = clamp(state.playerHp - remainingDamage, 0, 100);
  state.shake = Math.max(state.shake, 14);
  if (state.playerHp <= 0) {
    if (state.playerLives > 1) {
      revivePlayer(`${reason} HP ARYA habis.`);
    } else {
      state.playerLives = 0;
      state.ending = "mati";
      state.paused = false;
      bossLasers.length = 0;
      playerShots.length = 0;
      setMessage("ARYA tertangkap dan ditahan. Operasi GARUDA terhenti.", 900);
    }
  } else {
    const armorText = armorHit > 0 ? ` Armor menyerap ${armorHit} damage.` : "";
    setMessage(`${reason}${armorText} Armor ${state.playerArmor}/100, HP ${state.playerHp}/100.`);
  }
  saveGame();
  updateHud();
}
function addEvidence(name) {
  if (state.evidence.includes(name)) return;
  state.evidence.push(name);
  state.reputation = clamp(state.reputation + 5, 0, 100);
  setMessage(`Bukti diamankan: ${name}`);
  saveGame();
  updateHud();
}
function addInventory(name) {
  if (state.inventory.includes(name)) return;
  state.inventory.push(name);
  setMessage(`Item diperoleh: ${name}`);
  saveGame();
  updateHud();
}
function triggerDoorTransition(label, accent = "#2ee89b") {
  state.transition = {
    timer: 46,
    duration: 46,
    label,
    accent
  };
}
function showCorruptionBriefing() {
  showDialog("ARYA", [
    "Korupsi bukan cuma orang mengambil uang negara. Korupsi adalah ketika kepercayaan rakyat dicuri sedikit demi sedikit sampai pelayanan publik rusak.",
    "Kalau dana sekolah dikorupsi, ruang kelas tidak selesai, buku kurang, guru terlambat dibayar, dan masa depan anak-anak dipotong sebelum mereka sempat memilih.",
    "Kalau dana kesehatan dikorupsi, obat hilang, alat klinik rusak, pasien menunggu terlalu lama, dan keluarga miskin membayar harga paling mahal.",
    "Kalau proyek jalan, pelabuhan, atau bantuan rakyat dikorupsi, harga kebutuhan naik, pekerjaan hilang, keselamatan turun, dan kota terlihat megah tapi rapuh dari dalam.",
    "Korupsi juga membuat hukum bisa dibeli. Saksi takut bicara, media ditekan, data publik disembunyikan, lalu orang jujur dianggap sendirian.",
    "Karena itu operasi GARUDA bukan hanya menangkap THE MINISTER. Kita mengumpulkan bukti, melindungi saksi, membuka data, dan mengembalikan hak rakyat."
  ]);
}
function currentMission() {
  return missions[state.mission] || missions[missions.length - 1];
}
function updateHud() {
  const mission = currentMission();
  ui.missionName.textContent = mission.name;
  ui.missionText.textContent = mission.text;
  ui.objectiveText.textContent = `Objective: ${mission.objective}`;
  ui.lessonText.textContent = mission.lesson;
  ui.repValue.textContent = String(state.reputation);
  ui.evidenceValue.textContent = `${state.evidence.length}/12`;
  ui.intelValue.textContent = String(state.intel);
  ui.modeValue.textContent = player.mode;
  ui.evidenceList.innerHTML = "";
  const items = state.evidence.length ? state.evidence : ["Belum ada bukti."];
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ui.evidenceList.appendChild(li);
  });
}
function readSaveData() {
  try {
    return localStorage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
}
function writeSaveData(data) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    setMessage("Save gagal ditulis. Storage browser penuh atau diblokir.", 420);
    return false;
  }
}
function removeSaveData() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    setMessage("Save tidak bisa dihapus karena storage browser diblokir.", 420);
  }
}
function refreshContinueButton() {
  ui.continueButton.disabled = !readSaveData();
}
function clearModalPanels() {
  ui.pausePanel.classList.add("hidden");
  ui.hackPanel.classList.add("hidden");
  ui.dialogPanel.classList.add("hidden");
  ui.choicePanel.classList.add("hidden");
  state.paused = false;
  state.dialog = null;
  state.hack = null;
}
function resetWorldEntities() {
  terminals.forEach((terminal) => (terminal.active = true));
  pickups.forEach((pickup) => (pickup.active = true));
  cameras.forEach((camera) => (camera.disabled = false));
}
function saveGame() {
  if (!state.running) return;
  const data = {
    mission: state.mission,
    reputation: state.reputation,
    intel: state.intel,
    evidence: state.evidence,
    inventory: state.inventory,
    completedNpc: state.completedNpc,
    pickups: pickups.map((p) => ({ id: p.id, active: p.active })),
    terminals: terminals.map((t) => ({ id: t.id, active: t.active })),
    cameras: cameras.map((c) => ({ id: c.id, disabled: c.disabled })),
    player: { x: player.x, y: player.y },
    location: currentLocation(),
    outsideX: state.outsideX,
    outsideY: state.outsideY,
    bossHp: state.bossHp,
    bossDefeated: state.bossDefeated,
    playerLives: state.playerLives,
    playerArmor: state.playerArmor,
    playerHp: state.playerHp,
    ending: state.ending
  };
  if (writeSaveData(data)) refreshContinueButton();
}
function loadGame() {
  const raw = readSaveData();
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    clearModalPanels();
    resetWorldEntities();
    state.mission = safeNumber(data.mission, 0, 0, missions.length - 1);
    state.reputation = safeNumber(data.reputation, 50, 0, 100);
    state.intel = safeNumber(data.intel, 1, 0, 5);
    state.alert = 0;
    state.distraction = 0;
    state.shake = 0;
    state.transition = null;
    state.evidence = Array.isArray(data.evidence) ? data.evidence.filter((item) => typeof item === "string") : [];
    state.inventory = Array.isArray(data.inventory) ? data.inventory.filter((item) => typeof item === "string") : [];
    state.completedNpc = Array.isArray(data.completedNpc) ? data.completedNpc.filter((item) => typeof item === "string") : [];
    state.ending = data.ending ?? null;
    if (!["baik", "buruk", "mati", null].includes(state.ending)) state.ending = null;
    player.x = safeNumber(data.player?.x, SAFE_SPAWN.x, 14, W - 14);
    player.y = safeNumber(data.player?.y, SAFE_SPAWN.y, 24, H - 18);
    player.lastSafeX = player.x;
    player.lastSafeY = player.y;
    state.location = interiors[data.location] || data.location === "outside" ? data.location : "outside";
    state.outsideX = safeNumber(data.outsideX, player.x, 14, W - 14);
    state.outsideY = safeNumber(data.outsideY, player.y, 24, H - 18);
    state.bossDefeated = data.bossDefeated === true;
    state.bossHp = state.bossDefeated ? 0 : safeNumber(data.bossHp, state.bossMaxHp, 0, state.bossMaxHp);
    if (!state.bossDefeated && data.bossHp === 140) state.bossHp = state.bossMaxHp;
    state.playerLives = safeNumber(data.playerLives, state.playerMaxLives, 0, state.playerMaxLives);
    state.playerArmor = safeNumber(data.playerArmor, 100, 0, 100);
    state.playerHp = safeNumber(data.playerHp, 100, 0, 100);
    boss.x = boss.baseX;
    boss.y = boss.baseY;
    boss.phase = 0;
    boss.facing = -1;
    player.mode = "Jalan";
    player.stealth = false;
    player.stamina = 100;
    player.moving = false;
    player.walkPhase = 0;
    playerShots.length = 0;
    bossLasers.length = 0;
    if (playerIsInsideSolid()) movePlayerToSafeSpawn();
    data.pickups?.forEach((saved) => {
      const pickup = pickups.find((p) => p.id === saved.id);
      if (pickup && typeof saved.active === "boolean") pickup.active = saved.active;
    });
    data.terminals?.forEach((saved) => {
      const terminal = terminals.find((t) => t.id === saved.id);
      if (terminal && typeof saved.active === "boolean") terminal.active = saved.active;
    });
    data.cameras?.forEach((saved) => {
      const camera = cameras.find((c) => c.id === saved.id);
      if (camera && typeof saved.disabled === "boolean") camera.disabled = saved.disabled;
    });
    state.running = true;
    ui.startScreen.classList.add("hidden");
    setMessage("Save dimuat. Operasi GARUDA dilanjutkan.");
    updateHud();
    refreshContinueButton();
    return true;
  } catch {
    removeSaveData();
    refreshContinueButton();
    return false;
  }
}
function resetWorld() {
  state.running = true;
  state.paused = false;
  clearModalPanels();
  state.mission = 0;
  state.reputation = 50;
  state.intel = 1;
  state.alert = 0;
  state.evidence = [];
  state.inventory = [];
  state.completedNpc = [];
  state.ending = null;
  state.distraction = 0;
  state.transition = null;
  state.bossHp = state.bossMaxHp;
  state.bossDefeated = false;
  state.bossAttackCooldown = 0;
  state.attackCooldown = 0;
  state.slashTimer = 0;
  state.playerLives = state.playerMaxLives;
  state.playerArmor = 100;
  state.playerHp = 100;
  state.location = "outside";
  state.outsideX = SAFE_SPAWN.x;
  state.outsideY = SAFE_SPAWN.y;
  boss.x = boss.baseX;
  boss.y = boss.baseY;
  boss.phase = 0;
  boss.facing = -1;
  playerShots.length = 0;
  bossLasers.length = 0;
  player.x = SAFE_SPAWN.x;
  player.y = SAFE_SPAWN.y;
  player.lastSafeX = SAFE_SPAWN.x;
  player.lastSafeY = SAFE_SPAWN.y;
  player.mode = "Jalan";
  player.stamina = 100;
  player.caught = 0;
  player.moving = false;
  player.walkPhase = 0;
  resetWorldEntities();
  ui.startScreen.classList.add("hidden");
  setMessage("Operasi GARUDA dimulai. Temui NARA atau langsung menuju objective hijau.");
  showCorruptionBriefing();
  saveGame();
  updateHud();
}
function showDialog(speaker, lines) {
  state.paused = true;
  state.dialog = { speaker, lines };
  state.dialogIndex = 0;
  ui.dialogSpeaker.textContent = speaker;
  ui.dialogText.textContent = lines[0];
  ui.dialogPanel.classList.remove("hidden");
  playVoiceSound(speaker);
}
function nextDialog() {
  if (!state.dialog) return;
  playButtonSound();
  state.dialogIndex += 1;
  if (state.dialogIndex >= state.dialog.lines.length) {
    ui.dialogPanel.classList.add("hidden");
    state.dialog = null;
    state.paused = false;
    return;
  }
  ui.dialogText.textContent = state.dialog.lines[state.dialogIndex];
  playVoiceSound(state.dialog.speaker);
}
function bossVisible() {
  return currentLocation() === boss.location && !state.bossDefeated;
}
function bossAwake() {
  return bossVisible() && bossCanBeDefeated();
}
function bossFinalPhase() {
  return bossAwake() && state.bossHp <= state.bossMaxHp * 0.42;
}
function bossPhaseName() {
  return bossFinalPhase() ? "TAHAP 2: AMUK SISTEM" : "TAHAP 1: LASER";
}
function drawBossRageFire(now) {
  if (!bossFinalPhase()) return;
  for (let i = 0; i < 18; i += 1) {
    const angle = i * 0.72 + now / 380;
    const wave = Math.sin(now / 95 + i) * 8;
    const radius = 38 + (i % 5) * 7 + wave;
    const x = boss.x + Math.cos(angle) * radius;
    const y = boss.y - 12 + Math.sin(angle) * (radius * 0.72);
    const height = 18 + Math.sin(now / 70 + i * 1.7) * 7;
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 209, 102, 0.66)" : i % 3 === 1 ? "rgba(255, 92, 32, 0.58)" : "rgba(255, 59, 95, 0.5)";
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x + 8, y + 8);
    ctx.lineTo(x, y + 3);
    ctx.lineTo(x - 8, y + 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(255, 92, 32, 0.44)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(boss.x, boss.y - 10, 70 + Math.sin(now / 90) * 6, 0, Math.PI * 2);
  ctx.stroke();
}
function nearestNpc() {
  return npcs.find((npc) => inCurrentLocation(npc) && dist(player.x, player.y, npc.x, npc.y) < 44);
}
function nearestBoss() {
  if (!bossVisible()) return null;
  return dist(player.x, player.y, boss.x, boss.y) < 58 ? boss : null;
}
function nearestPickup() {
  return pickups.find((pickup) => pickup.active && inCurrentLocation(pickup) && dist(player.x, player.y, pickup.x, pickup.y) < 34);
}
function nearestTerminal() {
  const mission = currentMission();
  return terminals.find((terminal) => terminal.active && terminal.id === mission.target && inCurrentLocation(terminal) && dist(player.x, player.y, terminal.x, terminal.y) < 48);
}
function enterBuilding(district) {
  state.outsideX = player.x;
  state.outsideY = player.y;
  state.location = district.id;
  player.mode = "Jalan";
  player.x = W / 2;
  player.y = interiors[district.id].exitY - 48;
  player.lastSafeX = player.x;
  player.lastSafeY = player.y;
  triggerDoorTransition(`Memasuki ${district.name}`, district.accent);
  setMessage(`Masuk ke ${interiors[district.id].name}. Tekan E di pintu bawah untuk keluar.`);
  saveGame();
  updateHud();
}
function exitBuilding() {
  const district = districts.find((item) => item.id === currentLocation());
  if (!district) return;
  state.location = "outside";
  player.x = district.doorX;
  player.y = Math.min(H - 20, district.doorY + 38);
  state.outsideX = player.x;
  state.outsideY = player.y;
  player.lastSafeX = player.x;
  player.lastSafeY = player.y;
  triggerDoorTransition(`Keluar dari ${district.name}`, district.accent);
  setMessage(`Keluar dari ${district.name}. Jalan kota terbuka lagi.`);
  saveGame();
  updateHud();
}
function interact() {
  const interior = activeInterior();
  if (interior && dist(player.x, player.y, interior.exitX, interior.exitY) < 46) {
    exitBuilding();
    return;
  }

  const door = nearestDoor();
  if (door) {
    enterBuilding(door);
    return;
  }

  const pickup = nearestPickup();
  if (pickup) {
    pickup.active = false;
    addEvidence(pickup.name);
    return;
  }

  const npc = nearestNpc();
  if (npc) {
    if (!state.completedNpc.includes(npc.id)) {
      state.completedNpc.push(npc.id);
      if (npc.gives) {
        if (npc.optional) addEvidence(npc.gives);
        else addInventory(npc.gives);
      }
      if (npc.id === "nara") state.intel = clamp(state.intel + 2, 0, 5);
      if (npc.id === "saksi-bank") addEvidence("Kesaksian aliran dana");
    }
    showDialog(npc.name, npc.dialog);
    saveGame();
    updateHud();
    return;
  }

  const nearBoss = nearestBoss();
  if (nearBoss) {
    showDialog(nearBoss.name, nearBoss.dialog);
    setMessage("THE MINISTER muncul di Atrium Tower. Hadapi dia lewat terminal PUBLIKASI.");
    return;
  }

  const terminal = nearestTerminal();
  if (terminal) {
    startHack();
    return;
  }

  setMessage("Tidak ada objek interaksi di dekat ARYA.");
}
function missionBlockedReason() {
  const mission = currentMission();
  if (mission.needsNpc && !state.completedNpc.includes(mission.needsNpc)) {
    return "Cari dan bicara dengan saksi bank dulu.";
  }
  if (mission.needsItem && !state.inventory.includes(mission.needsItem)) {
    return "Pergi ke Hotel Garuda City dan bicara dengan NARA untuk mengambil alat sadap dulu.";
  }
  if (mission.needsCameraOff) {
    const cam = cameras.find((c) => c.id === mission.needsCameraOff);
    if (cam && !cam.disabled) return "Matikan kamera pelabuhan memakai Drone Mode.";
  }
  return "";
}
function makeHackChallenge(type) {
  if (type === "password") {
    const options = ["RAKYAT", "JUJUR", "GARUDA", "MERDEKA"];
    const answer = currentMission().id === "uang" ? "RAKYAT" : options[Math.floor(Math.random() * options.length)];
    return {
      title: "Pecahkan Password",
      note: "Gunakan petunjuk dialog dan ketik password.",
      prompt: answer.split("").map((char, index) => (index % 2 ? "_" : char)).join(" "),
      answer
    };
  }
  if (type === "sequence") {
    const answer = Array.from({ length: 5 }, () => Math.floor(Math.random() * 9) + 1).join("");
    return {
      title: "Sinkronisasi Kargo",
      note: "Salin urutan angka sebelum alarm meningkat.",
      prompt: answer.split("").join(" - "),
      answer
    };
  }
  const answer = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    title: "Cocokkan Kode",
    note: "Ketik kode hijau persis seperti tampilan.",
    prompt: answer,
    answer
  };
}
function startHack() {
  const terminal = nearestTerminal();
  if (!terminal) {
    setMessage("Dekati terminal misi untuk membuka hacking.");
    return;
  }
  const blocked = missionBlockedReason();
  if (blocked) {
    setMessage(blocked);
    return;
  }
  playButtonSound();
  const challenge = makeHackChallenge(terminal.type);
  state.hack = { terminalId: terminal.id, answer: challenge.answer };
  state.paused = true;
  ui.hackTitle.textContent = challenge.title;
  ui.hackNote.textContent = challenge.note;
  ui.hackPrompt.textContent = challenge.prompt;
  ui.hackInput.value = "";
  ui.hackPanel.classList.remove("hidden");
  ui.hackInput.focus();
}
function cancelHack() {
  ui.hackPanel.classList.add("hidden");
  state.hack = null;
  state.paused = false;
}
function completeHack() {
  if (!state.hack) return;
  const terminal = terminals.find((t) => t.id === state.hack.terminalId);
  const input = ui.hackInput.value.trim().toUpperCase().replaceAll(" ", "");
  if (input !== state.hack.answer) {
    state.alert = clamp(state.alert + 28, 0, 100);
    state.reputation = clamp(state.reputation - 3, 0, 100);
    setMessage("Kode salah. Sistem keamanan menaikkan alert.");
    playHackSound(false);
    updateHud();
    return;
  }

  terminal.active = false;
  playHackSound(true);
  addEvidence(currentMission().reward);
  ui.hackPanel.classList.add("hidden");
  state.hack = null;
  state.paused = false;

  if (state.mission < missions.length - 1) {
    state.mission += 1;
    state.intel = clamp(state.intel + 1, 0, 5);
    setMessage("Misi selesai. Objective baru diterima dari GARUDA.");
    showDialog("NARA", [`Bagus, ARYA. ${currentMission().name} aktif.`, currentMission().objective]);
  } else {
    if (state.bossDefeated) {
      showFinalChoice();
    } else {
      state.bossHp = state.bossMaxHp;
      setMessage("Perisai digital boss terbuka. Bidik THE MINISTER dan tekan F untuk menembakkan pistol laser.");
      showDialog("THE MINISTER", [
        "Terminal publik sudah menyala, tapi aku masih berdiri di depan kebenaran.",
        "Kalahkan aku, atau bukti itu tak akan pernah dipercaya rakyat."
      ]);
    }
  }
  saveGame();
  updateHud();
}
function showFinalChoice() {
  state.paused = true;
  ui.choiceText.textContent = "THE MINISTER tumbang, tapi korupsi tidak hilang hanya karena satu tokoh jatuh. Jaringan lama menawarkan jalan mudah: hapus sebagian bukti, biarkan pelaku besar selamat, dan rakyat tetap tidak tahu. Pilihan jujur lebih berat: publikasikan semua bukti, lindungi saksi, dan paksa sistem berubah bersama rakyat.";
  ui.choicePanel.classList.remove("hidden");
}
function chooseEnding(honest) {
  ui.choicePanel.classList.add("hidden");
  state.paused = false;
  if (honest) {
    state.reputation = clamp(state.reputation + 25, 0, 100);
    state.ending = "baik";
    setMessage("ENDING BAIK: Bukti dipublikasikan. Bersama hapus korupsi di Indonesia.", 900);
  } else {
    state.reputation = clamp(state.reputation - 45, 0, 100);
    state.ending = "buruk";
    setMessage("ENDING BURUK: Indonesia jatuh. THE MINISTER berkuasa dan kota kembali padam.", 900);
  }
  saveGame();
  updateHud();
}
function bossCanBeDefeated() {
  const finalTerminal = terminals.find((item) => item.id === "minister-server");
  return state.mission >= missions.length - 1 && finalTerminal && !finalTerminal.active;
}
function fireLaserPistol() {
  if (!bossVisible()) {
    setMessage("Boss belum ada di dekat ARYA.");
    return;
  }
  if (!bossAwake()) {
    setMessage("Retas terminal PUBLIKASI di Tower Garuda dulu. THE MINISTER belum bisa dilawan.");
    return;
  }
  if (player.mode !== "Jalan") {
    setMessage("Pistol laser hanya bisa dipakai saat ARYA berjalan.");
    return;
  }
  if (state.attackCooldown > 0) return;

  const aimX = boss.x - player.x;
  const aimY = boss.y - player.y;
  const aimLen = Math.hypot(aimX, aimY) || 1;
  const dirX = aimLen < 430 ? aimX / aimLen : player.facing;
  const dirY = aimLen < 430 ? aimY / aimLen : 0;
  playerShots.push({
    x: player.x + dirX * 18,
    y: player.y - 14 + dirY * 18,
    dx: dirX,
    dy: dirY,
    life: 48,
    damage: bossCanBeDefeated() ? 14 : 8,
    trail: []
  });
  state.attackCooldown = 18;
  state.slashTimer = 10;
  state.alert = clamp(state.alert + 4, 0, 100);
  playShootSound();
}
function defeatBoss() {
  state.bossDefeated = true;
  addEvidence("THE MINISTER dikalahkan");
  state.reputation = clamp(state.reputation + 15, 0, 100);
  bossLasers.length = 0;
  playerShots.length = 0;
  setMessage("THE MINISTER tumbang. Saatnya memilih: publikasikan bukti atau diam.");
  showFinalChoice();
}
function updatePlayerShots() {
  for (let i = playerShots.length - 1; i >= 0; i -= 1) {
    const shot = playerShots[i];
    shot.trail.push({ x: shot.x, y: shot.y });
    if (shot.trail.length > 5) shot.trail.shift();
    shot.x += shot.dx * 13;
    shot.y += shot.dy * 13;
    shot.life -= 1;
    const hitBoss = bossVisible() && dist(shot.x, shot.y, boss.x, boss.y - 12) < 34;
    if (hitBoss) {
      const finalReady = bossCanBeDefeated();
      state.bossHp = finalReady
        ? clamp(state.bossHp - shot.damage, 0, state.bossMaxHp)
        : clamp(state.bossHp - shot.damage, 1, state.bossMaxHp);
      state.shake = 6;
      playerShots.splice(i, 1);
      if (!finalReady) {
        setMessage("Laser mengenai boss, tapi terminal PUBLIKASI harus dibuka dulu untuk menjatuhkannya.");
      } else {
        setMessage(`Pistol laser ARYA mengenai THE MINISTER. HP: ${state.bossHp}/${state.bossMaxHp}.`);
      }
      if (state.bossHp <= 0) defeatBoss();
      saveGame();
      updateHud();
      continue;
    }
    if (shot.life <= 0 || shot.x < -20 || shot.x > W + 20 || shot.y < -20 || shot.y > H + 20) {
      playerShots.splice(i, 1);
    }
  }
}
function useDistraction() {
  if (state.intel <= 0) {
    setMessage("Intel NARA habis. Temui NARA untuk dukungan tambahan.");
    return;
  }
  state.intel -= 1;
  state.distraction = 260;
  state.alert = clamp(state.alert - 35, 0, 100);
  setMessage("Distraksi drone NARA aktif. Penjaga terganggu sementara.");
  saveGame();
  updateHud();
}
function tryDisableCamera() {
  if (player.mode !== "Drone") return;
  const camera = cameras.find((c) => !c.disabled && inCurrentLocation(c) && dist(player.x, player.y, c.x, c.y) < 38);
  if (!camera) return;
  camera.disabled = true;
  state.reputation = clamp(state.reputation + 3, 0, 100);
  setMessage("Kamera berhasil dimatikan oleh drone NARA.");
  saveGame();
  updateHud();
}
function updatePlayer() {
  const stealthHeld = keys.has("Shift");
  player.stealth = stealthHeld && player.stamina > 0 && player.mode === "Jalan";

  let speed = player.speed;
  if (player.stealth) speed *= 0.52;
  if (player.mode === "Motor") speed *= 1.9;
  if (player.mode === "Drone") speed *= 1.25;

  let vx = 0;
  let vy = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) vx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) vx += 1;
  if (keys.has("ArrowUp") || keys.has("w")) vy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) vy += 1;

  player.moving = Boolean(vx || vy);
  if (player.moving) {
    const len = Math.hypot(vx, vy);
    const nextX = player.x + (vx / len) * speed;
    const nextY = player.y + (vy / len) * speed;
    const resolved = resolveOutsideBuildings(nextX, nextY);
    player.x = resolved.x;
    player.y = resolved.y;
    player.facing = vx < 0 ? -1 : vx > 0 ? 1 : player.facing;
    player.walkPhase += player.stealth ? 0.12 : player.mode === "Motor" ? 0.34 : 0.2;
  } else {
    player.walkPhase *= 0.82;
  }

  if (player.stealth) player.stamina = clamp(player.stamina - 0.42, 0, 100);
  else player.stamina = clamp(player.stamina + 0.22, 0, 100);

  if (activeInterior()) {
    player.x = clamp(player.x, 96, W - 96);
    player.y = clamp(player.y, 116, H - 34);
  } else {
    player.x = clamp(player.x, 14, W - 14);
    player.y = clamp(player.y, 24, H - 18);
  }
  if (state.alert < 45) {
    player.lastSafeX = player.x;
    player.lastSafeY = player.y;
  }
  tryDisableCamera();
}
function updateThreats() {
  if (state.distraction > 0) state.distraction -= 1;
  guards.filter(inCurrentLocation).forEach((guard) => {
    guard.phase += state.distraction > 0 ? 0.004 : 0.018;
    const wave = Math.sin(guard.phase) * guard.range;
    guard.x = guard.baseX + guard.dx * wave;
    guard.y = guard.baseY + guard.dy * wave;
    const radius = player.stealth ? 34 : player.mode === "Motor" ? 94 : player.mode === "Drone" ? 44 : 62;
    if (dist(player.x, player.y, guard.x, guard.y) < radius && state.distraction <= 0) {
      state.alert += player.stealth ? 0.28 : player.mode === "Motor" ? 1.45 : 0.92;
    }
  });

  cameras.filter(inCurrentLocation).forEach((camera) => {
    if (camera.disabled) return;
    camera.angle += camera.speed;
    const beamX = camera.x + Math.cos(camera.angle) * 92;
    const beamY = camera.y + Math.sin(camera.angle) * 92;
    if (dist(player.x, player.y, beamX, beamY) < (player.stealth ? 26 : 44) && state.distraction <= 0) {
      state.alert += player.mode === "Drone" ? 0.16 : 0.8;
    }
  });

  state.alert = clamp(state.alert - 0.18, 0, 105);
  if (state.alert >= 100) {
    player.caught += 1;
    state.reputation = clamp(state.reputation - 8, 0, 100);
    state.alert = 15;
    state.shake = 18;
    player.x = player.lastSafeX;
    player.y = player.lastSafeY;
    damagePlayer(player.mode === "Motor" ? 28 : player.stealth ? 16 : 22, "Tertangkap patroli. GARUDA menarik ARYA ke checkpoint aman.");
  }
}
function updateBossFight() {
  if (state.attackCooldown > 0) state.attackCooldown -= 1;
  if (state.slashTimer > 0) state.slashTimer -= 1;
  if (state.bossAttackCooldown > 0) state.bossAttackCooldown -= 1;
  updatePlayerShots();
  if (!bossVisible()) return;
  if (!bossAwake()) {
    bossLasers.length = 0;
    boss.phase += 0.01;
    boss.x += (boss.baseX - boss.x) * 0.05;
    boss.y += (boss.baseY - boss.y) * 0.05;
    boss.facing = player.x < boss.x ? -1 : 1;
    return;
  }

  const finalPhase = bossFinalPhase();
  boss.phase += finalPhase ? 0.044 : 0.025;
  const targetX = boss.baseX + Math.sin(boss.phase) * (finalPhase ? 246 : 188);
  const targetY = boss.baseY + Math.cos(boss.phase * (finalPhase ? 1.16 : 0.74)) * (finalPhase ? 108 : 78);
  boss.x += (targetX - boss.x) * (finalPhase ? 0.058 : 0.035);
  boss.y += (targetY - boss.y) * (finalPhase ? 0.055 : 0.035);
  boss.x = clamp(boss.x, 156, W - 156);
  boss.y = clamp(boss.y, 180, H - 112);
  boss.facing = player.x < boss.x ? -1 : 1;

  const gap = dist(player.x, player.y, boss.x, boss.y);
  if (state.bossAttackCooldown <= 0) {
    state.bossAttackCooldown = finalPhase ? 58 : 104;
    const aim = Math.atan2(player.y - boss.y, player.x - boss.x);
    bossLasers.push({
      x: boss.x,
      y: boss.y - 16,
      angle: aim,
      length: finalPhase ? 650 : 560,
      charge: finalPhase ? 24 : 36,
      active: finalPhase ? 38 : 32,
      width: finalPhase ? 18 : 15,
      damage: finalPhase ? 26 : 18,
      hit: false
    });
    if (finalPhase) {
      bossLasers.push({ x: boss.x, y: boss.y - 16, angle: aim + 0.46, length: 610, charge: 34, active: 30, width: 13, damage: 22, hit: false });
      bossLasers.push({ x: boss.x, y: boss.y - 16, angle: aim - 0.46, length: 610, charge: 34, active: 30, width: 13, damage: 22, hit: false });
      if (state.bossHp <= state.bossMaxHp * 0.24) {
        bossLasers.push({ x: boss.x, y: boss.y - 16, angle: aim + Math.PI / 2, length: 480, charge: 42, active: 28, width: 12, damage: 20, hit: false });
      }
    }
    setMessage(finalPhase ? "TAHAP 2! THE MINISTER mengamuk. Hindari pola multi-laser merah." : "TAHAP 1: THE MINISTER mengunci target dengan laser.");
  }
  if (gap < (finalPhase ? 84 : 68)) {
    const pushX = (player.x - boss.x) / (gap || 1);
    const pushY = (player.y - boss.y) / (gap || 1);
    player.x += pushX * (finalPhase ? 3.6 : 2.4);
    player.y += pushY * (finalPhase ? 3.6 : 2.4);
    player.x = clamp(player.x, 96, W - 96);
    player.y = clamp(player.y, 116, H - 34);
  }

  for (let i = bossLasers.length - 1; i >= 0; i -= 1) {
    const laser = bossLasers[i];
    if (laser.charge > 0) {
      laser.charge -= 1;
      laser.x = boss.x;
      laser.y = boss.y - 16;
    } else if (laser.active > 0) {
      laser.active -= 1;
      const endX = laser.x + Math.cos(laser.angle) * laser.length;
      const endY = laser.y + Math.sin(laser.angle) * laser.length;
      const distance = pointToSegmentDistance(player.x, player.y - 8, laser.x, laser.y, endX, endY);
      if (!laser.hit && distance < laser.width + collisionRadius()) {
        laser.hit = true;
        state.alert = clamp(state.alert + 14, 0, 100);
        damagePlayer(player.stealth ? Math.ceil(laser.damage * 0.6) : laser.damage, "ARYA terkena laser korupsi.");
      }
    } else {
      bossLasers.splice(i, 1);
    }
  }

}
function drawPixelRect(x, y, w, h, color, glow) {
  if (glow) {
    ctx.fillStyle = glow;
    ctx.fillRect(Math.round(x - 2), Math.round(y - 2), Math.round(w + 4), Math.round(h + 4));
  }
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function drawText(text, x, y, color = "#e9f6ff", size = 12, align = "left") {
  ctx.fillStyle = color;
  ctx.font = `${size}px Consolas, monospace`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}
function drawFloatingLabel(text, x, y, color = "#2ee89b", width = 148) {
  const left = clamp(x - width / 2, 18, W - width - 18);
  const top = clamp(y - 20, 92, H - 74);
  ctx.fillStyle = "rgba(5, 7, 11, 0.78)";
  ctx.fillRect(left, top, width, 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 0.5, top + 0.5, width, 24);
  drawText(text, left + width / 2, top + 16, color, 11, "center");
}
function drawWrappedText(text, x, y, maxWidth, lineHeight, color = "#e9f6ff", size = 16, align = "center") {
  ctx.fillStyle = color;
  ctx.font = `${size}px Segoe UI, Arial`;
  ctx.textAlign = align;
  const words = text.split(" ");
  let line = "";
  let offset = 0;
  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word;
    const lastWord = index === words.length - 1;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + offset);
      line = word;
      offset += lineHeight;
    } else {
      line = testLine;
    }
    if (lastWord && line) ctx.fillText(line, x, y + offset);
  });
  ctx.textAlign = "left";
  return offset + lineHeight;
}
function drawGarudaLogo(x, y, scale = 1, color = "#ffd166", glow = "rgba(255, 209, 102, 0.26)") {
  const sx = (value) => Math.round(value * scale);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, sx(40), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(5, 7, 11, 0.72)";
  ctx.beginPath();
  ctx.arc(0, 0, sx(29), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, sx(3));
  ctx.beginPath();
  ctx.arc(0, 0, sx(31), 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, sx(-27));
  ctx.lineTo(sx(-8), sx(-8));
  ctx.lineTo(sx(-31), sx(-18));
  ctx.lineTo(sx(-20), sx(-2));
  ctx.lineTo(sx(-39), sx(4));
  ctx.lineTo(sx(-15), sx(11));
  ctx.lineTo(sx(-8), sx(21));
  ctx.lineTo(0, sx(29));
  ctx.lineTo(sx(8), sx(21));
  ctx.lineTo(sx(15), sx(11));
  ctx.lineTo(sx(39), sx(4));
  ctx.lineTo(sx(20), sx(-2));
  ctx.lineTo(sx(31), sx(-18));
  ctx.lineTo(sx(8), sx(-8));
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 209, 102, 0.12)";
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.88;
  ctx.fillRect(sx(-5), sx(-13), sx(10), sx(26));
  ctx.fillRect(sx(-22), sx(-2), sx(15), sx(5));
  ctx.fillRect(sx(7), sx(-2), sx(15), sx(5));
  ctx.fillRect(sx(-14), sx(10), sx(28), sx(4));
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#05070b";
  ctx.fillRect(sx(-4), sx(-18), sx(8), sx(5));
  ctx.fillStyle = "#ff3b5f";
  ctx.fillRect(sx(-2), sx(-16), sx(4), sx(2));
  ctx.restore();
}
function drawCharacterSprite(x, y, skin, options = {}) {
  const now = performance.now();
  const facing = options.facing || 1;
  const phase = options.phase ?? now / 180;
  const moving = options.moving ?? true;
  const scale = options.scale || 1;
  const hostile = options.hostile || false;
  const bob = moving ? Math.sin(phase) * 2.2 * scale : Math.sin(now / 280) * 0.7 * scale;
  const stride = moving ? Math.sin(phase) * 4.8 * scale : 0;
  const arm = moving ? Math.cos(phase) * 3.4 * scale : 0;
  const sx = (value) => Math.round(value * scale);
  const bodyW = sx(20);
  const bodyH = sx(34);
  const px = Math.round(x);
  const py = Math.round(y + bob);

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(px - sx(14), Math.round(y + sx(17)), sx(28), sx(6));
  if (moving) {
    ctx.fillStyle = hostile ? "rgba(255, 59, 95, 0.16)" : `${skin.visor}24`;
    ctx.fillRect(px - sx(18 * facing), Math.round(y + sx(14)), sx(10), sx(3));
    ctx.fillRect(px - sx(23 * facing), Math.round(y + sx(18)), sx(16), sx(2));
  }

  if (options.aura) {
    ctx.strokeStyle = options.aura;
    ctx.lineWidth = sx(2);
    ctx.globalAlpha = 0.46 + Math.sin(now / 160) * 0.12;
    ctx.beginPath();
    ctx.arc(px, py - sx(7), sx(28), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = skin.skin;
  ctx.fillRect(px - sx(4), py - sx(18), sx(8), sx(5));
  drawPixelRect(px - bodyW / 2, py - sx(15), bodyW, bodyH, skin.coat, options.glow || "rgba(41, 199, 255, 0.16)");
  ctx.fillStyle = "rgba(233, 246, 255, 0.13)";
  ctx.fillRect(px - sx(8), py - sx(14), sx(16), sx(3));
  ctx.fillStyle = "rgba(5, 7, 11, 0.34)";
  ctx.fillRect(px - sx(9), py + sx(8), sx(18), sx(4));
  ctx.fillStyle = skin.armor;
  ctx.fillRect(px - sx(7), py - sx(10), sx(14), sx(21));
  ctx.fillStyle = skin.visor;
  ctx.globalAlpha = 0.28;
  ctx.fillRect(px - sx(9), py - sx(12), sx(18), sx(2));
  ctx.fillRect(px - sx(2), py - sx(8), sx(4), sx(18));
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.fillRect(px - sx(3), py - sx(8), sx(2), sx(17));
  ctx.fillStyle = skin.visor;
  ctx.fillRect(px - sx(5), py - sx(5), sx(10), sx(2));
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(px - sx(7), py - sx(10), sx(3), sx(17));
  ctx.fillStyle = skin.scaffold || "rgba(233, 246, 255, 0.12)";
  ctx.fillRect(px - sx(5), py - sx(8), sx(10), sx(2));
  ctx.fillStyle = skin.scarf;
  ctx.fillRect(px - sx(12), py - sx(17), sx(24), sx(5));
  ctx.fillRect(px - sx(4 * facing), py - sx(15), sx(20 * facing), sx(3));
  ctx.fillRect(px - sx(2 * facing), py - sx(12), sx(15 * facing), sx(2));
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  ctx.fillRect(px - sx(9), py - sx(17), sx(6), sx(2));

  ctx.fillStyle = skin.coat;
  ctx.fillRect(px - sx(15), py - sx(14), sx(7), sx(5));
  ctx.fillRect(px + sx(8), py - sx(14), sx(7), sx(5));
  ctx.fillRect(px - sx(16), py - sx(11) + Math.round(arm), sx(6), sx(20));
  ctx.fillRect(px + sx(10), py - sx(11) - Math.round(arm), sx(6), sx(20));
  ctx.fillStyle = skin.armor;
  ctx.fillRect(px - sx(17), py - sx(9) + Math.round(arm), sx(4), sx(7));
  ctx.fillRect(px + sx(13), py - sx(9) - Math.round(arm), sx(4), sx(7));
  ctx.fillStyle = skin.scaffolding || "#060a10";
  ctx.fillRect(px - sx(16), py + sx(9) + Math.round(arm), sx(6), sx(4));
  ctx.fillRect(px + sx(10), py + sx(9) - Math.round(arm), sx(6), sx(4));
  ctx.fillStyle = skin.skin;
  ctx.fillRect(px - sx(17), py + sx(12) + Math.round(arm), sx(5), sx(5));
  ctx.fillRect(px + sx(12), py + sx(12) - Math.round(arm), sx(5), sx(5));

  ctx.fillStyle = skin.skin;
  ctx.fillRect(px - sx(8), py - sx(29), sx(16), sx(12));
  ctx.fillRect(px - sx(10), py - sx(25), sx(2), sx(5));
  ctx.fillRect(px + sx(8), py - sx(25), sx(2), sx(5));
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.fillRect(px - sx(5), py - sx(27), sx(4), sx(3));
  ctx.fillStyle = skin.hair;
  ctx.fillRect(px - sx(9), py - sx(32), sx(18), sx(5));
  ctx.fillRect(px - sx(9), py - sx(27), sx(4), sx(8));
  ctx.fillRect(px + sx(6), py - sx(26), sx(3), sx(6));
  ctx.fillStyle = skin.visor;
  ctx.fillRect(px - sx(6), py - sx(24), sx(13), sx(3));
  ctx.fillStyle = hostile ? "rgba(255, 59, 95, 0.32)" : `${skin.visor}55`;
  ctx.fillRect(px - sx(8), py - sx(25), sx(17), sx(1));
  ctx.fillStyle = "#05070b";
  ctx.fillRect(px - sx(5), py - sx(21), sx(3), sx(2));
  ctx.fillRect(px + sx(3), py - sx(21), sx(3), sx(2));
  ctx.fillStyle = hostile ? "#ff3b5f" : skin.visor;
  ctx.fillRect(px + sx(5 * facing), py - sx(21), sx(4), sx(3));

  ctx.fillStyle = "#070a10";
  ctx.fillRect(px - sx(8), py + sx(16) + Math.round(stride), sx(6), sx(12));
  ctx.fillRect(px + sx(2), py + sx(16) - Math.round(stride), sx(6), sx(12));
  ctx.fillStyle = skin.armor;
  ctx.fillRect(px - sx(10), py + sx(26) + Math.round(stride), sx(10), sx(4));
  ctx.fillRect(px + sx(1), py + sx(26) - Math.round(stride), sx(10), sx(4));
  ctx.fillStyle = hostile ? "#ff3b5f" : skin.visor;
  ctx.fillRect(px - sx(8), py + sx(19) + Math.round(stride), sx(4), sx(2));
  ctx.fillRect(px + sx(4), py + sx(19) - Math.round(stride), sx(4), sx(2));
  ctx.fillStyle = skin.scarf;
  ctx.fillRect(px - sx(6 * facing), py - sx(17), sx(14), sx(3));
  ctx.fillRect(px - sx(2 * facing), py - sx(14), sx(12), sx(3));
}
function drawBoss() {
  if (currentLocation() === boss.location && state.bossDefeated) {
    drawText("THE MINISTER TUMBANG", boss.x, boss.y - 26, "#2ee89b", 14, "center");
    drawText("Bukti siap dipublikasikan", boss.x, boss.y - 4, "#e9f6ff", 11, "center");
    return;
  }
  if (!bossVisible()) return;
  const now = performance.now();
  const awake = bossAwake();
  const finalPhase = bossFinalPhase();
  const aura = (finalPhase ? 52 : 38) + Math.sin(now / (finalPhase ? 90 : 180)) * (finalPhase ? 9 : 5);
  ctx.fillStyle = finalPhase ? "rgba(255, 59, 95, 0.14)" : awake ? "rgba(255, 209, 102, 0.08)" : "rgba(41, 199, 255, 0.06)";
  ctx.beginPath();
  ctx.arc(boss.x, boss.y - 8, aura, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = finalPhase ? "rgba(255, 59, 95, 0.72)" : awake ? "rgba(255, 59, 95, 0.38)" : "rgba(41, 199, 255, 0.28)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(boss.x, boss.y - 8, aura + 10, 0, Math.PI * 2);
  ctx.stroke();
  drawBossRageFire(now);

  drawCharacterSprite(boss.x, boss.y, {
    coat: "#14090d",
    armor: "#3a1620",
    scarf: "#ffd166",
    visor: "#ff3b5f",
    skin: "#f4e4c4",
    hair: "#05070b"
  }, {
    scale: 1.38,
    moving: awake,
    phase: boss.phase * (finalPhase ? 13 : 8),
    facing: boss.facing,
    hostile: awake,
    aura: finalPhase ? "rgba(255, 59, 95, 0.72)" : awake ? "rgba(255, 209, 102, 0.62)" : "rgba(41, 199, 255, 0.28)",
    glow: finalPhase ? "rgba(255, 59, 95, 0.42)" : awake ? "rgba(255, 59, 95, 0.28)" : "rgba(41, 199, 255, 0.18)"
  });

  ctx.fillStyle = "#ffd166";
  ctx.fillRect(boss.x - 15, boss.y - 48, 30, 6);
  ctx.fillStyle = "#05070b";
  ctx.fillRect(boss.x - 9, boss.y - 46, 18, 3);
  ctx.fillStyle = "#241015";
  ctx.fillRect(boss.x - 56, boss.y - 84, 112, 8);
  ctx.fillStyle = finalPhase ? "#ffd166" : awake ? "#ff3b5f" : "#45586c";
  ctx.fillRect(boss.x - 56, boss.y - 84, (state.bossHp / state.bossMaxHp) * 112, 8);
  ctx.strokeStyle = "#ffd166";
  ctx.strokeRect(boss.x - 56.5, boss.y - 84.5, 113, 9);
  if (awake) drawText(bossPhaseName(), boss.x, boss.y - 92, finalPhase ? "#ffd166" : "#ff9aaa", 10, "center");
  if (awake && state.slashTimer > 0) {
    ctx.strokeStyle = "rgba(46, 232, 155, 0.85)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(boss.x - 42, boss.y - 42);
    ctx.lineTo(boss.x + 48, boss.y + 18);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 209, 102, 0.75)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boss.x + 40, boss.y - 38);
    ctx.lineTo(boss.x - 38, boss.y + 22);
    ctx.stroke();
  }
  drawText("THE MINISTER", boss.x, boss.y - 64, "#ffd166", 12, "center");
  if (!awake) {
    drawText("TERKUNCI: RETAS PUBLIKASI", boss.x, boss.y + 44, "#29c7ff", 11, "center");
  }
}
function drawFutureSkyLayer() {
  if (currentLocation() !== "outside") return;
  const now = performance.now();
  const scan = Math.floor(now / 34) % W;

  ctx.strokeStyle = "rgba(41, 199, 255, 0.2)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(54, 178);
  ctx.lineTo(306, 132);
  ctx.lineTo(572, 164);
  ctx.lineTo(866, 118);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 209, 102, 0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(46, 188);
  ctx.lineTo(306, 142);
  ctx.lineTo(574, 174);
  ctx.lineTo(876, 128);
  ctx.stroke();

  for (let i = 0; i < 7; i += 1) {
    const x = (now / (18 + i * 2) + i * 151) % (W + 120) - 60;
    const y = 116 + (i % 3) * 28 + Math.sin(now / 600 + i) * 5;
    const accent = i % 3 === 0 ? "#29c7ff" : i % 3 === 1 ? "#ff3b5f" : "#ffd166";
    ctx.fillStyle = `${accent}33`;
    ctx.fillRect(x - 16, y + 7, 32, 3);
    drawPixelRect(x - 18, y, 36, 10, "rgba(8, 15, 28, 0.82)", `${accent}22`);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.72;
    ctx.fillRect(x - 12, y + 3, 8, 2);
    ctx.fillRect(x + 5, y + 3, 8, 2);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = "rgba(41, 199, 255, 0.1)";
  ctx.fillRect(scan - 36, 84, 72, 2);
  ctx.fillStyle = "rgba(255, 59, 95, 0.12)";
  ctx.fillRect(W - scan - 24, 336, 48, 2);

  const holoPanels = [
    { x: 116, y: 130, w: 74, h: 32, color: "#29c7ff", text: "2045" },
    { x: 430, y: 190, w: 82, h: 30, color: "#2ee89b", text: "OPEN" },
    { x: 708, y: 174, w: 86, h: 34, color: "#b88cff", text: "SKYWAY" }
  ];
  holoPanels.forEach((panel, index) => {
    const flicker = 0.32 + Math.sin(now / 220 + index) * 0.12;
    ctx.globalAlpha = flicker;
    ctx.strokeStyle = panel.color;
    ctx.strokeRect(panel.x + 0.5, panel.y + 0.5, panel.w, panel.h);
    ctx.fillStyle = panel.color;
    ctx.fillRect(panel.x + 8, panel.y + 8, panel.w - 16, 3);
    ctx.globalAlpha = 0.82;
    drawText(panel.text, panel.x + panel.w / 2, panel.y + 24, panel.color, 10, "center");
    ctx.globalAlpha = 1;
  });
}
function drawCityProps() {
  if (currentLocation() !== "outside") return;
  cityProps.forEach((prop, index) => {
    const pulse = 0.45 + Math.sin(performance.now() / 240 + index) * 0.16;
    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.fillRect(prop.x + 4, prop.y + prop.h, prop.w, 6);
    drawPixelRect(prop.x, prop.y, prop.w, prop.h, prop.color, `${prop.accent}18`);
    ctx.fillStyle = prop.accent;
    ctx.globalAlpha = pulse;
    if (prop.type === "billboard") {
      ctx.fillRect(prop.x + 8, prop.y + 8, prop.w - 16, 4);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 25, prop.accent, 8, "center");
    } else if (prop.type === "newsstand") {
      ctx.fillRect(prop.x + 6, prop.y - 7, prop.w - 12, 7);
      ctx.fillStyle = "rgba(233, 246, 255, 0.18)";
      ctx.fillRect(prop.x + 10, prop.y + 9, 14, 16);
      ctx.fillRect(prop.x + 30, prop.y + 9, 18, 16);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 31, prop.accent, 8, "center");
    } else if (prop.type === "foodcart") {
      ctx.fillRect(prop.x + 8, prop.y - 8, prop.w - 16, 8);
      ctx.fillRect(prop.x + 12, prop.y + 8, prop.w - 24, 5);
      ctx.fillStyle = "#05070b";
      ctx.fillRect(prop.x + 10, prop.y + 23, 8, 7);
      ctx.fillRect(prop.x + prop.w - 18, prop.y + 23, 8, 7);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 20, prop.accent, 8, "center");
    } else if (prop.type === "metro") {
      ctx.fillRect(prop.x + prop.w / 2 - 3, prop.y - 18, 6, 18);
      ctx.fillRect(prop.x + 10, prop.y + 10, prop.w - 20, 5);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 31, prop.accent, 10, "center");
    } else if (prop.type === "hologram") {
      ctx.strokeStyle = prop.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(prop.x + prop.w / 2, prop.y + 16, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillRect(prop.x + 21, prop.y + 7, 6, 28);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 42, prop.accent, 9, "center");
    } else if (prop.type === "fountain") {
      ctx.strokeStyle = prop.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(prop.x + prop.w / 2, prop.y + 15, 18, 0.1, Math.PI - 0.1);
      ctx.stroke();
      for (let i = 0; i < 3; i += 1) {
        ctx.fillRect(prop.x + 14 + i * 9, prop.y + 18 - i * 4, 4, 10 + i * 4);
      }
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 32, prop.accent, 8, "center");
    } else if (prop.type === "taxi" || prop.type === "sportsCar" || prop.type === "policeVan" || prop.type === "ojek") {
      ctx.fillRect(prop.x + 8, prop.y + 7, prop.w - 16, 8);
      ctx.fillStyle = "#05070b";
      ctx.fillRect(prop.x + 12, prop.y + 4, prop.type === "ojek" ? 12 : 18, 7);
      ctx.fillRect(prop.x + prop.w - 24, prop.y + 4, 12, 7);
      ctx.fillRect(prop.x + 8, prop.y + 17, 10, 5);
      ctx.fillRect(prop.x + prop.w - 18, prop.y + 17, 10, 5);
      ctx.fillStyle = prop.accent;
      if (prop.type === "policeVan") {
        ctx.fillRect(prop.x + 25, prop.y + 3, 20, 4);
        ctx.fillStyle = "#29c7ff";
        ctx.fillRect(prop.x + 24, prop.y + 2, 8, 3);
        ctx.fillStyle = "#ff3b5f";
        ctx.fillRect(prop.x + 36, prop.y + 2, 8, 3);
      }
      if (prop.type === "ojek") ctx.fillRect(prop.x + 24, prop.y - 4, 11, 12);
      drawText(prop.label, prop.x + prop.w / 2, prop.y - 2, prop.accent, 8, "center");
    } else if (prop.type === "garudaSign") {
      drawGarudaLogo(prop.x + prop.w / 2, prop.y + 16, 0.28, prop.accent, `${prop.accent}22`);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + prop.h - 5, prop.accent, 8, "center");
    } else if (prop.type === "hotelSign") {
      drawGarudaLogo(prop.x + 18, prop.y + 17, 0.16, "#ffd166", "rgba(255, 209, 102, 0.12)");
      ctx.fillRect(prop.x + 34, prop.y + 8, prop.w - 42, 5);
      ctx.fillRect(prop.x + 34, prop.y + 20, prop.w - 42, 5);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + prop.h - 4, prop.accent, 8, "center");
    } else if (prop.type === "atm") {
      ctx.fillStyle = "#05070b";
      ctx.fillRect(prop.x + 9, prop.y + 7, prop.w - 18, 16);
      ctx.fillStyle = prop.accent;
      ctx.fillRect(prop.x + 14, prop.y + 12, prop.w - 28, 3);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 32, prop.accent, 8, "center");
    } else if (prop.type === "barrier") {
      for (let x = prop.x + 6; x < prop.x + prop.w - 8; x += 18) ctx.fillRect(x, prop.y + 5, 10, 4);
    } else if (prop.type === "park") {
      ctx.fillRect(prop.x + 16, prop.y + 8, 14, 14);
      ctx.fillRect(prop.x + 52, prop.y + 12, 18, 13);
      drawText(prop.label, prop.x + prop.w / 2, prop.y + 34, prop.accent, 9, "center");
    } else if (prop.type === "towerRelay") {
      ctx.fillRect(prop.x + 15, prop.y - 20, 4, 22);
      ctx.strokeStyle = prop.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(prop.x + 17, prop.y - 12, 16, -0.75, 0.75);
      ctx.stroke();
    } else if (prop.type === "lamp") {
      ctx.fillRect(prop.x + 5, prop.y - 24, 3, 24);
      ctx.fillRect(prop.x - 4, prop.y - 26, 20, 4);
      ctx.fillStyle = `${prop.accent}44`;
      ctx.fillRect(prop.x - 12, prop.y - 18, 36, 20);
    } else {
      ctx.fillRect(prop.x + 8, prop.y + 6, prop.w - 16, 3);
      if (prop.label) drawText(prop.label, prop.x + prop.w / 2, prop.y + prop.h - 8, prop.accent, 9, "center");
    }
    ctx.globalAlpha = 1;
  });
}
function drawCityCrowd() {
  if (currentLocation() !== "outside") return;
  cityCrowd.forEach((person, index) => {
    const wave = Math.sin(performance.now() * person.speed + index) * person.path;
    const x = person.x + wave;
    const y = person.y + Math.cos(performance.now() * person.speed * 0.7 + index) * 6;
    const skin = npcSkins[person.skin] || npcSkins["warga-desa"];
    drawCharacterSprite(x, y, skin, {
      scale: 0.72,
      moving: true,
      phase: performance.now() / 240 + index,
      facing: wave < 0 ? -1 : 1,
      aura: "rgba(233, 246, 255, 0.08)",
      glow: `${skin.visor}18`
    });
    drawText(person.label, x, y + 26, skin.visor, 7, "center");
  });
}
function drawInteriorCrowd() {
  const room = currentLocation();
  const people = interiorCrowd.filter((person) => person.location === room);
  people.forEach((person, index) => {
    const wave = Math.sin(performance.now() * person.speed + index * 1.7) * person.path;
    const x = person.axis === "x" ? person.x + wave : person.x + Math.cos(performance.now() * person.speed + index) * 8;
    const y = person.axis === "y" ? person.y + wave : person.y + Math.cos(performance.now() * person.speed * 0.8 + index) * 7;
    const skin = npcSkins[person.skin] || npcSkins["warga-desa"];
    drawCharacterSprite(x, y, skin, {
      scale: 0.76,
      moving: true,
      phase: performance.now() / 220 + index * 2,
      facing: wave < 0 ? -1 : 1,
      aura: `${skin.visor}18`,
      glow: `${skin.visor}20`
    });
    drawText(person.label, x, y + 28, skin.visor, 8, "center");
  });
}
function drawDistrictDetails(district) {
  const pulse = 0.3 + Math.sin(performance.now() / 300 + district.x) * 0.12;
  ctx.fillStyle = district.accent;
  ctx.globalAlpha = 0.22 + pulse;
  ctx.fillRect(district.x + 10, district.y + district.h - 12, district.w - 20, 3);
  ctx.globalAlpha = 1;
  drawGarudaLogo(district.x + district.w - 34, district.y + 64, district.w < 90 ? 0.22 : 0.28, district.accent, `${district.accent}20`);

  if (district.id === "gov") {
    ctx.fillStyle = "rgba(41, 199, 255, 0.18)";
    ctx.fillRect(district.x + 20, district.y + 52, district.w - 74, 10);
    ctx.fillStyle = "rgba(233, 246, 255, 0.16)";
    for (let x = district.x + 28; x < district.x + district.w - 72; x += 28) {
      ctx.fillRect(x, district.y + 76, 12, 34);
    }
    drawText("CIVIC CORE", district.x + 76, district.y + 128, district.accent, 11, "center");
  }
  if (district.id === "bank") {
    ctx.fillStyle = "rgba(255, 59, 95, 0.2)";
    ctx.fillRect(district.x + 24, district.y + 50, district.w - 84, 8);
    ctx.strokeStyle = district.accent;
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.strokeRect(district.x + 32 + i * 32, district.y + 78, 18, 26);
    }
    drawText("GLOBAL BANK", district.x + 82, district.y + 126, district.accent, 11, "center");
  }
  if (district.id === "elite") {
    ctx.fillStyle = "rgba(184, 140, 255, 0.2)";
    ctx.fillRect(district.x + 22, district.y + 44, district.w - 68, 80);
    ctx.fillStyle = "rgba(233, 246, 255, 0.18)";
    ctx.fillRect(district.x + 38, district.y + 62, 36, 44);
    ctx.fillRect(district.x + 88, district.y + 62, 28, 44);
    drawText("SKY RESIDENCE", district.x + 78, district.y + 136, district.accent, 10, "center");
  }

  if (district.id === "tower") {
    ctx.fillStyle = "#05070b";
    ctx.fillRect(district.x + district.w / 2 - 24, district.y - 34, 48, 34);
    ctx.fillStyle = district.accent;
    ctx.fillRect(district.x + district.w / 2 - 3, district.y - 58, 6, 58);
    ctx.fillRect(district.x + district.w / 2 - 32, district.y + 26, 64, 7);
    drawGarudaLogo(district.x + district.w / 2, district.y + 66, 0.34, district.accent, "rgba(255, 209, 102, 0.16)");
    drawText("GARUDA", district.x + district.w / 2, district.y + 104, district.accent, 13, "center");
  }
  if (district.id === "port") {
    ctx.strokeStyle = district.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(district.x + 28, district.y + 28);
    ctx.lineTo(district.x + 84, district.y - 10);
    ctx.lineTo(district.x + 150, district.y - 10);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 209, 102, 0.28)";
    ctx.fillRect(district.x + 32, district.y + district.h - 42, 44, 30);
    ctx.fillRect(district.x + 82, district.y + district.h - 34, 38, 22);
    drawText("FREEPORT", district.x + 198, district.y + 122, district.accent, 12, "center");
  }
  if (district.id === "clinic") {
    ctx.fillStyle = district.accent;
    ctx.fillRect(district.x + district.w / 2 - 14, district.y + 48, 28, 8);
    ctx.fillRect(district.x + district.w / 2 - 4, district.y + 38, 8, 28);
    drawText("24H", district.x + district.w / 2, district.y + 92, district.accent, 11, "center");
  }
  if (district.id === "media") {
    ctx.strokeStyle = district.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(district.x + district.w / 2, district.y + 38, 20, -0.4, 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(district.x + district.w / 2, district.y + 38, 30, -0.35, 0.35);
    ctx.stroke();
    drawText("ON", district.x + district.w / 2, district.y + 62, district.accent, 12, "center");
  }
  if (district.id === "village") {
    ctx.fillStyle = "rgba(41, 199, 255, 0.22)";
    ctx.fillRect(district.x + 22, district.y + 40, district.w - 44, 8);
    ctx.fillStyle = "rgba(255, 59, 95, 0.24)";
    ctx.fillRect(district.x + 26, district.y + 66, district.w - 52, 5);
    drawGarudaLogo(district.x + district.w / 2, district.y + 100, 0.36, "#ffd166", "rgba(255, 209, 102, 0.18)");
    drawText("HOTEL", district.x + district.w / 2, district.y + 142, district.accent, 14, "center");
    ctx.fillStyle = "rgba(233, 246, 255, 0.12)";
    for (let x = district.x + 28; x < district.x + district.w - 34; x += 32) {
      ctx.fillRect(x, district.y + district.h - 62, 14, 18);
    }
  }
  if (district.id === "mafia") {
    ctx.fillStyle = "rgba(255, 59, 95, 0.18)";
    ctx.fillRect(district.x + 24, district.y + 48, district.w - 70, 12);
    ctx.fillRect(district.x + 34, district.y + 82, district.w - 92, 44);
    ctx.strokeStyle = district.accent;
    ctx.strokeRect(district.x + 42.5, district.y + 90.5, district.w - 108, 28);
    drawText("BLACK MARKET", district.x + 92, district.y + 148, district.accent, 11, "center");
  }
}
function drawMap() {
  const interior = activeInterior();
  if (interior) {
    drawInterior(interior);
    return;
  }

  ctx.fillStyle = "#070a10";
  ctx.fillRect(0, 0, W, H);

  const night = ctx.createLinearGradient(0, 0, 0, H);
  night.addColorStop(0, "#07111f");
  night.addColorStop(0.48, "#09131d");
  night.addColorStop(1, "#05070b");
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(41, 199, 255, 0.12)";
  ctx.fillRect(0, 0, W, 82);
  ctx.fillStyle = "rgba(255, 209, 102, 0.08)";
  ctx.beginPath();
  ctx.arc(886, 56, 34, 0, Math.PI * 2);
  ctx.fill();
  backgroundBuildings.forEach((building, index) => {
    ctx.fillStyle = building.color;
    ctx.fillRect(building.x, building.y, building.w, building.h);
    ctx.fillStyle = "rgba(233, 246, 255, 0.08)";
    ctx.fillRect(building.x + 4, building.y + 6, building.w - 8, 2);
    for (let y = building.y + 14; y < building.y + building.h - 10; y += 18) {
      for (let x = building.x + 8; x < building.x + building.w - 8; x += 17) {
        const lit = (x + y + Math.floor(performance.now() / 360) + index) % 5 === 0;
        ctx.fillStyle = lit ? building.accent : "rgba(233, 246, 255, 0.13)";
        ctx.fillRect(x, y, 7, 7);
      }
    }
    ctx.fillStyle = building.accent;
    ctx.globalAlpha = 0.34;
    ctx.fillRect(building.x + building.w - 8, building.y - 8, 4, 8);
    ctx.globalAlpha = 1;
  });
  drawFutureSkyLayer();

  ctx.strokeStyle = "rgba(41, 199, 255, 0.11)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#26384c";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(0, 268);
  ctx.lineTo(W, 268);
  ctx.moveTo(342, 0);
  ctx.lineTo(342, H);
  ctx.moveTo(642, 0);
  ctx.lineTo(642, H);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 209, 102, 0.55)";
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 18]);
  ctx.beginPath();
  ctx.moveTo(0, 268);
  ctx.lineTo(W, 268);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(41, 199, 255, 0.24)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.moveTo(0, 244);
  ctx.lineTo(W, 244);
  ctx.moveTo(0, 292);
  ctx.lineTo(W, 292);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(233, 246, 255, 0.2)";
  for (let x = 366; x < 626; x += 24) ctx.fillRect(x, 258, 12, 3);
  for (let y = 24; y < H; y += 24) ctx.fillRect(336, y, 12, 3);
  ctx.strokeStyle = "rgba(184, 140, 255, 0.26)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(258, 204);
  ctx.lineTo(760, 204);
  ctx.stroke();

  districts.forEach((district) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
    ctx.fillRect(district.x + 8, district.y + district.h, district.w, 10);
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(district.x + 4, district.y - 7, district.w - 8, 7);
    ctx.fillStyle = district.color;
    ctx.fillRect(district.x, district.y, district.w, district.h);
    ctx.fillStyle = district.accent;
    ctx.globalAlpha = 0.18;
    ctx.fillRect(district.x + 6, district.y + 6, 4, district.h - 18);
    ctx.fillRect(district.x + district.w - 10, district.y + 8, 4, district.h - 20);
    ctx.globalAlpha = 0.55;
    ctx.fillRect(district.x + district.w / 2 - 2, district.y - 24, 4, 24);
    ctx.fillRect(district.x + district.w / 2 - 18, district.y - 12, 36, 3);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(233, 246, 255, 0.17)";
    ctx.strokeRect(district.x + 0.5, district.y + 0.5, district.w, district.h);
    ctx.fillStyle = "rgba(5, 7, 11, 0.26)";
    ctx.fillRect(district.x + 8, district.y + 28, district.w - 16, 4);
    drawText(district.name, district.x + 8, district.y + 20, "#9bb2c6", district.w < 82 ? 9 : 12);
    for (let i = 0; i < district.w - 20; i += 28) {
      const lit = (i + district.x + Math.floor(performance.now() / 260)) % 4 === 0;
      ctx.fillStyle = lit ? district.accent : "rgba(233, 246, 255, 0.15)";
      ctx.fillRect(district.x + 12 + i, district.y + 44, 14, 12);
      ctx.fillStyle = lit ? "#ff3b5f" : "rgba(233, 246, 255, 0.1)";
      ctx.fillRect(district.x + 16 + i, district.y + 82, 10, 18);
    }
    ctx.fillStyle = district.accent;
    ctx.globalAlpha = 0.42;
    ctx.fillRect(district.x + district.w - 14, district.y - 14, 5, 14);
    ctx.fillRect(district.x + 10, district.y + district.h - 12, district.w - 20, 3);
    ctx.globalAlpha = 1;
    drawDistrictDetails(district);
    drawPixelRect(district.doorX - 15, district.doorY - 22, 30, 24, "#05070b", `rgba(255, 209, 102, 0.22)`);
    drawText("PINTU", district.doorX - 19, district.doorY + 18, district.accent, 10);
  });
  drawCityProps();
  drawCityCrowd();

  for (let i = 0; i < 25; i += 1) {
    const x = (i * 83 + Math.floor(performance.now() / 32)) % W;
    ctx.fillStyle = i % 2 ? "rgba(41, 199, 255, 0.32)" : "rgba(255, 59, 95, 0.26)";
    ctx.fillRect(x, 263 + (i % 3) * 6, 18, 3);
  }
}
function drawInterior(interior) {
  ctx.fillStyle = interior.wall;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 160, 60, W / 2, 160, 520);
  glow.addColorStop(0, `${interior.accent}33`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#05070b";
  ctx.fillRect(72, 86, W - 144, H - 122);
  ctx.fillStyle = interior.floor;
  ctx.fillRect(96, 110, W - 192, H - 158);

  ctx.strokeStyle = "rgba(233, 246, 255, 0.09)";
  ctx.lineWidth = 1;
  for (let x = 112; x < W - 112; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 110);
    ctx.lineTo(x, H - 48);
    ctx.stroke();
  }
  for (let y = 132; y < H - 52; y += 44) {
    ctx.beginPath();
    ctx.moveTo(96, y);
    ctx.lineTo(W - 96, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(233, 246, 255, 0.12)";
  for (let x = 144; x < W - 160; x += 104) {
    ctx.fillRect(x, 96, 42, 10);
    ctx.fillStyle = interior.accent;
    ctx.fillRect(x + 6, 98, 8, 6);
    ctx.fillStyle = "rgba(233, 246, 255, 0.12)";
  }

  ctx.fillStyle = "rgba(5, 7, 11, 0.5)";
  ctx.fillRect(178, 218, 178, 48);
  ctx.fillRect(650, 218, 178, 48);
  ctx.fillRect(178, 394, 178, 48);
  ctx.fillRect(650, 394, 178, 48);
  ctx.fillStyle = "rgba(233, 246, 255, 0.12)";
  ctx.fillRect(190, 226, 154, 7);
  ctx.fillRect(662, 226, 154, 7);
  ctx.fillRect(190, 402, 154, 7);
  ctx.fillRect(662, 402, 154, 7);

  ctx.fillStyle = "rgba(233, 246, 255, 0.1)";
  ctx.fillRect(430, 144, 164, 70);
  ctx.fillStyle = "#05070b";
  ctx.fillRect(438, 152, 148, 54);
  ctx.fillStyle = interior.accent;
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 7; i += 1) {
    ctx.fillRect(452 + i * 18, 190 - (i % 3) * 9, 10, 8 + (i % 4) * 6);
  }
  ctx.globalAlpha = 1;

  const room = currentLocation();
  drawGarudaLogo(148, 158, 0.42, interior.accent, `${interior.accent}18`);
  drawGarudaLogo(W - 148, 158, 0.42, interior.accent, `${interior.accent}18`);
  ctx.fillStyle = "rgba(5, 7, 11, 0.48)";
  ctx.fillRect(126, 472, 176, 34);
  ctx.fillRect(W - 302, 472, 176, 34);
  ctx.fillStyle = interior.accent;
  ctx.globalAlpha = 0.42;
  ctx.fillRect(138, 482, 152, 4);
  ctx.fillRect(W - 290, 482, 152, 4);
  ctx.globalAlpha = 1;

  if (room === "gov") {
    drawText("PUBLIC RECORD", 512, 254, interior.accent, 15, "center");
    ctx.fillStyle = "rgba(41, 199, 255, 0.14)";
    for (let x = 226; x <= 744; x += 86) ctx.fillRect(x, 306, 58, 78);
  }
  if (room === "bank") {
    drawText("SECURE LEDGER", 512, 254, interior.accent, 15, "center");
    ctx.fillStyle = "rgba(255, 59, 95, 0.15)";
    for (let i = 0; i < 5; i += 1) ctx.fillRect(262 + i * 106, 306, 56, 60);
    ctx.strokeStyle = interior.accent;
    ctx.strokeRect(452.5, 312.5, 120, 86);
  }
  if (room === "elite") {
    drawText("PRIVATE LOUNGE", 512, 254, interior.accent, 15, "center");
    ctx.fillStyle = "rgba(184, 140, 255, 0.16)";
    ctx.fillRect(210, 300, 180, 74);
    ctx.fillRect(634, 300, 180, 74);
    ctx.fillStyle = "rgba(255, 209, 102, 0.2)";
    ctx.fillRect(486, 320, 52, 52);
  }
  if (room === "port") {
    drawText("CARGO CONTROL", 512, 254, interior.accent, 15, "center");
    ctx.fillStyle = "rgba(255, 209, 102, 0.22)";
    for (let i = 0; i < 6; i += 1) ctx.fillRect(210 + i * 94, 326 + (i % 2) * 24, 64, 36);
  }
  if (room === "mafia") {
    drawText("SHADOW EXCHANGE", 512, 254, interior.accent, 15, "center");
    ctx.fillStyle = "rgba(255, 59, 95, 0.16)";
    ctx.fillRect(248, 304, 194, 74);
    ctx.fillRect(584, 304, 194, 74);
    ctx.strokeStyle = interior.accent;
    ctx.strokeRect(296.5, 322.5, 98, 34);
    ctx.strokeRect(632.5, 322.5, 98, 34);
  }

  if (currentLocation() === "clinic") {
    drawText("+", 500, 292, interior.accent, 40, "center");
    ctx.fillStyle = "rgba(46, 232, 155, 0.12)";
    ctx.fillRect(462, 310, 100, 42);
    ctx.fillRect(214, 322, 176, 44);
    ctx.fillRect(634, 322, 176, 44);
    drawText("EMERGENCY", 512, 254, interior.accent, 15, "center");
  }
  if (currentLocation() === "media") {
    ctx.fillStyle = "rgba(41, 199, 255, 0.14)";
    ctx.fillRect(244, 164, 180, 94);
    drawText("LIVE", 318, 214, interior.accent, 24, "center");
    drawText("NEWSROOM", 512, 254, interior.accent, 15, "center");
    ctx.fillStyle = "rgba(233, 246, 255, 0.12)";
    ctx.fillRect(560, 302, 210, 64);
    ctx.fillRect(250, 322, 138, 44);
  }
  if (currentLocation() === "tower") {
    ctx.fillStyle = "rgba(255, 209, 102, 0.12)";
    ctx.fillRect(404, 252, 216, 74);
    ctx.fillStyle = "rgba(255, 59, 95, 0.18)";
    ctx.fillRect(448, 208, 128, 118);
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(512, 214);
    ctx.lineTo(478, 252);
    ctx.lineTo(512, 242);
    ctx.lineTo(546, 252);
    ctx.closePath();
    ctx.stroke();
    drawGarudaLogo(512, 258, 0.82, "#ffd166", "rgba(255, 59, 95, 0.18)");
    drawText("MINISTER", 512, 348, "#ffd166", 13, "center");
  }
  if (currentLocation() === "village") {
    ctx.fillStyle = "rgba(41, 199, 255, 0.18)";
    ctx.fillRect(182, 164, 230, 74);
    ctx.fillStyle = "rgba(5, 7, 11, 0.58)";
    ctx.fillRect(198, 184, 198, 32);
    drawText("RECEPTION", 296, 206, "#29c7ff", 15, "center");
    drawGarudaLogo(296, 154, 0.42, "#ffd166", "rgba(255, 209, 102, 0.18)");

    ctx.fillStyle = "rgba(255, 209, 102, 0.16)";
    ctx.fillRect(612, 150, 198, 78);
    ctx.fillStyle = "rgba(5, 7, 11, 0.56)";
    ctx.fillRect(632, 166, 158, 42);
    drawText("GARUDA SUITE", 711, 192, "#ffd166", 14, "center");

    const sofaColors = ["#17293a", "#1d1531", "#112827"];
    sofaColors.forEach((color, index) => {
      const x = 206 + index * 214;
      const y = 360 + (index % 2) * 22;
      drawPixelRect(x, y, 126, 34, color, "rgba(41, 199, 255, 0.18)");
      ctx.fillStyle = "rgba(233, 246, 255, 0.12)";
      ctx.fillRect(x + 10, y + 8, 44, 8);
      ctx.fillRect(x + 66, y + 8, 44, 8);
    });

    ctx.fillStyle = "rgba(46, 232, 155, 0.16)";
    ctx.fillRect(442, 252, 138, 46);
    ctx.fillStyle = "#05070b";
    ctx.fillRect(458, 262, 106, 22);
    drawText("SAFE FLOOR", 511, 278, "#2ee89b", 12, "center");

    ctx.fillStyle = "rgba(255, 209, 102, 0.18)";
    ctx.fillRect(672, 262, 120, 38);
    ctx.fillStyle = "#05070b";
    ctx.fillRect(688, 270, 88, 18);
    drawText("ALAT SADAP", 732, 284, "#ffd166", 10, "center");
    ctx.fillStyle = "rgba(46, 232, 155, 0.2)";
    ctx.fillRect(702, 308, 58, 8);
    ctx.fillRect(724, 290, 14, 26);

    ctx.fillStyle = "rgba(41, 199, 255, 0.16)";
    ctx.fillRect(366, 318, 280, 28);
    ctx.fillStyle = "rgba(233, 246, 255, 0.14)";
    for (let x = 384; x <= 614; x += 46) {
      ctx.fillRect(x, 326, 22, 10);
      ctx.fillRect(x + 8, 342, 6, 18);
    }

    for (let i = 0; i < 5; i += 1) {
      const x = 166 + i * 164;
      ctx.fillStyle = i % 2 ? "#ff3b5f" : "#29c7ff";
      ctx.globalAlpha = 0.36;
      ctx.fillRect(x, 124, 46, 6);
      ctx.fillRect(x + 20, 128, 6, 54);
      ctx.globalAlpha = 1;
    }
  }

  drawInteriorCrowd();

  drawPixelRect(interior.exitX - 28, interior.exitY - 18, 56, 26, "#05070b", "rgba(46, 232, 155, 0.24)");
  drawText("KELUAR", interior.exitX - 22, interior.exitY + 23, "#2ee89b", 11);

  ctx.fillStyle = "rgba(5, 7, 11, 0.62)";
  ctx.fillRect(20, 96, 270, 36);
  drawText(interior.name, 34, 119, interior.accent, 14);
}
function drawTerminals() {
  const mission = currentMission();
  terminals.forEach((terminal) => {
    if (!inCurrentLocation(terminal)) return;
    const activeMission = terminal.active && terminal.id === mission.target;
    ctx.globalAlpha = terminal.active ? 1 : 0.28;
    drawPixelRect(
      terminal.x - 14,
      terminal.y - 14,
      28,
      28,
      activeMission ? "#2ee89b" : "#45586c",
      activeMission ? "rgba(46, 232, 155, 0.35)" : "rgba(69, 88, 108, 0.2)"
    );
    ctx.fillStyle = "#06110d";
    ctx.fillRect(terminal.x - 8, terminal.y - 6, 16, 11);
    drawText(terminal.label, terminal.x - 18, terminal.y - 22, "#e9f6ff", 10);
    ctx.globalAlpha = 1;
  });
}
function drawNpcsAndPickups() {
  npcs.forEach((npc) => {
    if (!inCurrentLocation(npc)) return;
    const skin = npcSkins[npc.id] || {
      coat: "#111820",
      armor: npc.color,
      scarf: npc.color,
      visor: "#e9f6ff",
      skin: "#f1f7ff",
      hair: "#05070b"
    };
    drawCharacterSprite(npc.x, npc.y, skin, {
      moving: false,
      phase: performance.now() / 280 + npc.x,
      aura: `${npc.color}55`,
      glow: `${npc.color}30`
    });
    drawText(npc.name, npc.x, npc.y + 34, npc.color, 10, "center");
  });

  pickups.forEach((pickup) => {
    if (!pickup.active) return;
    if (!inCurrentLocation(pickup)) return;
    drawPixelRect(pickup.x - 8, pickup.y - 8, 16, 16, "#ffd166", "rgba(255, 209, 102, 0.32)");
    drawText("BUKTI", pickup.x - 18, pickup.y - 16, "#ffd166", 10);
  });
}
function drawThreats() {
  cameras.filter(inCurrentLocation).forEach((camera) => {
    if (!camera.disabled) {
      const beamX = camera.x + Math.cos(camera.angle) * 92;
      const beamY = camera.y + Math.sin(camera.angle) * 92;
      ctx.strokeStyle = "rgba(255, 59, 95, 0.23)";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(camera.x, camera.y);
      ctx.lineTo(beamX, beamY);
      ctx.stroke();
    }
    drawPixelRect(
      camera.x - 8,
      camera.y - 8,
      16,
      16,
      camera.disabled ? "#45586c" : "#ff3b5f",
      camera.disabled ? "rgba(69, 88, 108, 0.18)" : "rgba(255, 59, 95, 0.3)"
    );
  });

  guards.filter(inCurrentLocation).forEach((guard) => {
    const radius = state.distraction > 0 ? 26 : 58;
    ctx.fillStyle = state.distraction > 0 ? "rgba(255, 209, 102, 0.08)" : "rgba(255, 59, 95, 0.1)";
    ctx.beginPath();
    ctx.arc(guard.x, guard.y, radius, 0, Math.PI * 2);
    ctx.fill();
    drawCharacterSprite(guard.x, guard.y, guardSkins[guard.type] || guardSkins["Polisi Korup"], {
      moving: true,
      phase: guard.phase * 4,
      facing: guard.dx < 0 || guard.dy < 0 ? -1 : 1,
      hostile: true,
      aura: state.distraction > 0 ? "rgba(255, 209, 102, 0.28)" : "rgba(255, 59, 95, 0.34)",
      glow: "rgba(255, 59, 95, 0.24)"
    });
    drawText(guard.type, guard.x, guard.y + 34, "#ff9aaa", 9, "center");
  });
}
function drawProjectiles() {
  bossLasers.forEach((laser) => {
    const endX = laser.x + Math.cos(laser.angle) * laser.length;
    const endY = laser.y + Math.sin(laser.angle) * laser.length;
    if (laser.charge > 0) {
      const alpha = 0.2 + Math.sin(performance.now() / 55) * 0.12;
      const warning = laser.damage >= 22 ? "255, 59, 95" : "255, 209, 102";
      ctx.strokeStyle = `rgba(${warning}, ${alpha + (laser.damage >= 22 ? 0.08 : 0)})`;
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = laser.damage >= 22 ? "rgba(255, 59, 95, 0.38)" : "rgba(255, 209, 102, 0.32)";
      ctx.fillRect(laser.x - 7, laser.y - 7, 14, 14);
    } else {
      ctx.strokeStyle = laser.damage >= 22 ? "rgba(255, 209, 102, 0.24)" : "rgba(255, 59, 95, 0.22)";
      ctx.lineWidth = laser.width + 18;
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.strokeStyle = laser.damage >= 22 ? "rgba(255, 209, 102, 0.92)" : "rgba(255, 59, 95, 0.86)";
      ctx.lineWidth = laser.width;
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(laser.x, laser.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  });

  playerShots.forEach((shot) => {
    shot.trail.forEach((point, index) => {
      ctx.fillStyle = `rgba(41, 199, 255, ${0.12 + index * 0.12})`;
      ctx.fillRect(point.x - 8 + index, point.y - 2, 16 - index * 2, 4);
    });
    ctx.fillStyle = "rgba(41, 199, 255, 0.32)";
    ctx.fillRect(shot.x - 11, shot.y - 4, 22, 8);
    ctx.fillStyle = "#b9edff";
    ctx.fillRect(shot.x - 5, shot.y - 2, 10, 4);
  });
}
function drawPlayer() {
  const bob = Math.sin(performance.now() / 120) * 1.5;
  if (player.mode === "Motor") {
    const px = Math.round(player.x);
    const py = Math.round(player.y + bob);
    const dir = player.facing;
    const rear = px - dir * 31;
    const nose = px + dir * 31;
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(41, 199, 255, 0.2)" : "rgba(255, 209, 102, 0.16)";
      ctx.fillRect(Math.round(rear - dir * (8 + i * 14)), py + 8 + i, 22 - i * 3, 3);
    }
    ctx.fillStyle = "rgba(41, 199, 255, 0.14)";
    ctx.fillRect(px - 38, py + 16, 76, 5);
    ctx.fillStyle = "rgba(255, 209, 102, 0.1)";
    ctx.fillRect(px - 34, py + 20, 68, 3);
    drawPixelRect(px - 31, py - 10, 62, 20, vehicleSkin.body, "rgba(41, 199, 255, 0.42)");
    ctx.fillStyle = "rgba(233, 246, 255, 0.2)";
    ctx.fillRect(px - 25, py - 8, 50, 3);
    ctx.fillStyle = "rgba(255, 209, 102, 0.22)";
    ctx.fillRect(px - 18, py - 15, 36, 3);
    ctx.fillStyle = vehicleSkin.bodyDark;
    ctx.fillRect(px - 22, py - 7, 42, 8);
    ctx.fillRect(px - 28, py + 4, 56, 5);
    ctx.fillStyle = vehicleSkin.trim;
    ctx.fillRect(px - 28, py - 13, 22, 4);
    ctx.fillRect(px + 5, py - 13, 24, 4);
    ctx.fillRect(nose - dir * 5, py - 4, dir * 12, 5);
    ctx.fillStyle = vehicleSkin.glass;
    ctx.fillRect(px - 9, py - 23, 18, 10);
    ctx.fillStyle = "#101722";
    ctx.fillRect(px - 7, py - 21, 14, 11);
    ctx.fillStyle = characterSkin.skin;
    ctx.fillRect(px - 5, py - 28, 10, 7);
    ctx.fillStyle = characterSkin.hair;
    ctx.fillRect(px - 6, py - 31, 12, 4);
    ctx.fillStyle = characterSkin.scarf;
    ctx.fillRect(px - 12, py - 22, 24, 4);
    ctx.fillRect(px - dir * 2, py - 18, dir * 17, 3);
    ctx.fillStyle = vehicleSkin.tire;
    ctx.beginPath();
    ctx.arc(px - 20, py + 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + 20, py + 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b9edff";
    ctx.lineWidth = 2;
    for (const wheelX of [px - 20, px + 20]) {
      ctx.beginPath();
      ctx.arc(wheelX, py + 12, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(wheelX - 5, py + 12);
      ctx.lineTo(wheelX + 5, py + 12);
      ctx.moveTo(wheelX, py + 7);
      ctx.lineTo(wheelX, py + 17);
      ctx.stroke();
    }
    ctx.fillStyle = "#26384c";
    ctx.fillRect(px - 23, py + 9, 6, 6);
    ctx.fillRect(px + 17, py + 9, 6, 6);
    ctx.fillStyle = vehicleSkin.trim;
    ctx.fillRect(px - 24, py + 11, 8, 3);
    ctx.fillRect(px + 16, py + 11, 8, 3);
    ctx.fillStyle = vehicleSkin.energy;
    ctx.fillRect(nose - dir * 2, py - 2, dir * 12, 4);
    ctx.fillStyle = "rgba(185, 237, 255, 0.72)";
    ctx.fillRect(nose + dir * 5, py - 6, dir * 18, 3);
    ctx.fillStyle = "rgba(255, 59, 95, 0.42)";
    ctx.fillRect(rear - dir * 14, py - 3, 18, 6);
    ctx.fillStyle = "rgba(255, 59, 95, 0.22)";
    ctx.fillRect(rear - dir * 36, py - 1, 32, 4);
    ctx.strokeStyle = "rgba(255, 209, 102, 0.62)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px - 18, py - 16);
    ctx.lineTo(px, py - 30);
    ctx.lineTo(px + 18, py - 16);
    ctx.stroke();
    drawGarudaLogo(px, py - 2, 0.16, "#ffd166", "rgba(255, 209, 102, 0.12)");
    return;
  }
  if (player.mode === "Drone") {
    const spin = performance.now() / 75;
    const droneX = player.x;
    const droneY = player.y + bob;
    ctx.fillStyle = "rgba(41, 199, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(droneX - 8, droneY + 9);
    ctx.lineTo(droneX + 8, droneY + 9);
    ctx.lineTo(droneX + 34, droneY + 56);
    ctx.lineTo(droneX - 34, droneY + 56);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 209, 102, 0.38)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(droneX, droneY, 22 + Math.sin(performance.now() / 90) * 1.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(41, 199, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(droneX - 21, droneY - 16);
    ctx.lineTo(droneX + 21, droneY + 16);
    ctx.stroke();
    const rotors = [
      { x: droneX - 26, y: droneY - 18 },
      { x: droneX + 26, y: droneY + 18 }
    ];
    rotors.forEach((rotor, index) => {
      ctx.strokeStyle = "rgba(185, 237, 255, 0.58)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rotor.x, rotor.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.save();
      ctx.translate(rotor.x, rotor.y);
      ctx.rotate(spin + index);
      ctx.fillStyle = "rgba(41, 199, 255, 0.38)";
      ctx.fillRect(-12, -2, 24, 4);
      ctx.fillStyle = "rgba(255, 209, 102, 0.28)";
      ctx.fillRect(-2, -12, 4, 24);
      ctx.restore();
      ctx.fillStyle = "#05070b";
      ctx.fillRect(rotor.x - 3, rotor.y - 3, 6, 6);
    });
    drawPixelRect(droneX - 12, droneY - 9, 24, 18, "#ffd166", "rgba(255, 209, 102, 0.34)");
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fillRect(droneX - 8, droneY - 7, 16, 2);
    ctx.fillStyle = "#7a4b14";
    ctx.fillRect(droneX - 8, droneY + 3, 16, 3);
    ctx.fillStyle = "#05070b";
    ctx.fillRect(droneX - 5, droneY - 4, 10, 6);
    ctx.fillStyle = "#ff3b5f";
    ctx.fillRect(droneX - 3, droneY - 2, 6, 2);
    ctx.fillStyle = "#29c7ff";
    ctx.fillRect(droneX - 7, droneY + 8, 14, 3);
    ctx.fillStyle = "rgba(46, 232, 155, 0.55)";
    ctx.fillRect(droneX - 2, droneY + 12, 4, 8);
    ctx.fillStyle = "#29c7ff";
    ctx.fillRect(droneX - 28, droneY - 4, 14, 4);
    ctx.fillRect(droneX + 14, droneY, 14, 4);
    ctx.fillStyle = "rgba(41, 199, 255, 0.28)";
    ctx.fillRect(droneX - 31, droneY - 8, 19, 2);
    ctx.fillRect(droneX + 12, droneY + 8, 19, 2);
    drawGarudaLogo(droneX, droneY + 1, 0.09, "#ffd166", "rgba(255, 209, 102, 0.08)");
    return;
  }

  const neon = player.stealth ? characterSkin.stealth : characterSkin.visor;
  const skin = { ...characterSkin, visor: neon };
  if (player.moving) {
    ctx.fillStyle = player.stealth ? "rgba(46, 232, 155, 0.14)" : "rgba(41, 199, 255, 0.14)";
    ctx.fillRect(player.x - 15, player.y + 18, 9, 3);
    ctx.fillRect(player.x + 7, player.y + 18, 9, 3);
  }
  drawCharacterSprite(player.x, player.y, skin, {
    moving: player.moving,
    phase: player.walkPhase,
    facing: player.facing,
    aura: player.stealth ? "rgba(46, 232, 155, 0.38)" : "rgba(41, 199, 255, 0.18)",
    glow: player.stealth ? "rgba(46, 232, 155, 0.24)" : "rgba(41, 199, 255, 0.22)"
  });
  if (state.playerArmor > 0) {
    const armorPulse = 25 + Math.sin(performance.now() / 140) * 2;
    ctx.strokeStyle = state.playerArmor > 35 ? "rgba(255, 209, 102, 0.46)" : "rgba(255, 59, 95, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y - 6 + bob, armorPulse, -0.2, Math.PI * 1.35);
    ctx.stroke();
    ctx.fillStyle = state.playerArmor > 35 ? "rgba(255, 209, 102, 0.18)" : "rgba(255, 59, 95, 0.18)";
    ctx.fillRect(player.x - 13, player.y - 42 + bob, Math.max(4, state.playerArmor * 0.26), 3);
  }
  if (bossAwake()) {
    const dir = player.facing;
    ctx.fillStyle = "#05070b";
    ctx.fillRect(player.x + dir * 11, player.y - 12, dir * 17, 5);
    ctx.fillStyle = state.attackCooldown > 0 ? "#45586c" : "#29c7ff";
    ctx.fillRect(player.x + dir * 20, player.y - 13, dir * 9, 3);
    ctx.fillStyle = "rgba(41, 199, 255, 0.34)";
    ctx.fillRect(player.x + dir * 27, player.y - 14, dir * 7, 5);
  }
  if (player.stealth) {
    ctx.strokeStyle = "rgba(46, 232, 155, 0.36)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y - 5 + bob, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function drawObjectiveMarker() {
  const mission = currentMission();
  if (mission.needsItem && mission.itemNpc && !state.inventory.includes(mission.needsItem)) {
    const npcTarget = npcs.find((npc) => npc.id === mission.itemNpc);
    if (!npcTarget) return;
    if (!inCurrentLocation(npcTarget)) {
      if (currentLocation() === "outside") {
        const district = districts.find((item) => item.id === npcTarget.location);
        if (!district) return;
        const pulse = 8 + Math.sin(performance.now() / 160) * 3;
        ctx.strokeStyle = "#2ee89b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(district.doorX, district.doorY, 26 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        drawFloatingLabel("TEMUI NARA", district.doorX, district.doorY + 52, "#2ee89b", 132);
      }
      return;
    }
    const pulse = 10 + Math.sin(performance.now() / 160) * 4;
    ctx.strokeStyle = "#2ee89b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(npcTarget.x, npcTarget.y - 8, 30 + pulse, 0, Math.PI * 2);
    ctx.stroke();
    drawFloatingLabel("AMBIL ALAT SADAP", npcTarget.x, npcTarget.y - 40, "#2ee89b", 150);
    return;
  }
  const target = terminals.find((t) => t.id === mission.target && t.active);
  if (!target) return;
  if (!inCurrentLocation(target)) {
    if (currentLocation() === "outside") {
      const district = districts.find((item) => item.id === target.location);
      if (!district) return;
      const pulse = 8 + Math.sin(performance.now() / 160) * 3;
      ctx.strokeStyle = "#2ee89b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(district.doorX, district.doorY, 26 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      drawFloatingLabel("MASUK OBJECTIVE", district.doorX, district.doorY + 52, "#2ee89b", 154);
    }
    return;
  }
  const pulse = 10 + Math.sin(performance.now() / 160) * 4;
  ctx.strokeStyle = "#2ee89b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 28 + pulse, 0, Math.PI * 2);
  ctx.stroke();
  drawFloatingLabel("OBJECTIVE", target.x, target.y + 48, "#2ee89b", 116);
}
function drawTopUi() {
  ctx.fillStyle = "rgba(5, 7, 11, 0.76)";
  ctx.fillRect(16, 14, 358, 72);
  drawText(currentMission().name, 30, 38, "#ffd166", 15);
  drawText(currentMission().objective, 30, 61, "#e9f6ff", 12);
  drawText(activeInterior()?.name || "Jalan Kota Nusantara", 30, 80, "#9bb2c6", 11);

  ctx.fillStyle = "rgba(5, 7, 11, 0.76)";
  ctx.fillRect(782, 14, 220, 134);
  drawText("ALERT", 798, 36, "#9bb2c6", 12);
  ctx.fillStyle = "#25121a";
  ctx.fillRect(798, 45, 170, 9);
  ctx.fillStyle = "#ff3b5f";
  ctx.fillRect(798, 45, clamp(state.alert, 0, 100) * 1.7, 9);
  drawText("STAMINA", 798, 70, "#9bb2c6", 12);
  ctx.fillStyle = "#10231d";
  ctx.fillRect(866, 62, 102, 8);
  ctx.fillStyle = "#2ee89b";
  ctx.fillRect(866, 62, player.stamina * 1.02, 8);
  drawText("ARMOR", 798, 95, "#9bb2c6", 12);
  ctx.fillStyle = "#111827";
  ctx.fillRect(866, 87, 102, 8);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(866, 87, state.playerArmor * 1.02, 8);
  drawText("ARYA HP", 798, 120, "#9bb2c6", 12);
  ctx.fillStyle = "#111827";
  ctx.fillRect(866, 112, 102, 8);
  ctx.fillStyle = "#29c7ff";
  ctx.fillRect(866, 112, state.playerHp * 1.02, 8);
  drawText("NYAWA", 798, 140, "#9bb2c6", 12);
  drawText(`${state.playerLives}/${state.playerMaxLives}`, 928, 140, "#ffd166", 12);

  if (bossAwake()) {
    const finalPhase = bossFinalPhase();
    ctx.fillStyle = "rgba(5, 7, 11, 0.82)";
    ctx.fillRect(W / 2 - 170, 16, 340, 48);
    drawText(`BOSS: THE MINISTER - ${bossPhaseName()}`, W / 2 - 156, 36, finalPhase ? "#ff3b5f" : "#ffd166", 11);
    ctx.fillStyle = "#25121a";
    ctx.fillRect(W / 2 - 20, 45, 170, 9);
    ctx.fillStyle = finalPhase ? "#ffd166" : "#ff3b5f";
    ctx.fillRect(W / 2 - 20, 45, (state.bossHp / state.bossMaxHp) * 170, 9);
    drawText(`${state.bossHp}/${state.bossMaxHp}`, W / 2 + 86, 39, "#9bb2c6", 10, "center");
  }

  ctx.fillStyle = "rgba(5, 7, 11, 0.78)";
  ctx.fillRect(16, 516, 700, 42);
  drawText(state.message, 30, 542, "#e9f6ff", 14);

  const terminal = nearestTerminal();
  const door = nearestDoor();
  const interior = activeInterior();
  const npc = nearestNpc();
  const pickup = nearestPickup();
  let prompt = "";
  let promptColor = "#2ee89b";
  if (pickup) {
    prompt = "E: ambil bukti";
    promptColor = "#ffd166";
  } else if (npc) {
    prompt = "E: bicara";
  } else if (terminal) {
    prompt = "E/H: hack terminal";
  } else if (door) {
    prompt = "E: masuk gedung";
  } else if (interior && dist(player.x, player.y, interior.exitX, interior.exitY) < 46) {
    prompt = "E: keluar";
  } else if (bossAwake() && dist(player.x, player.y, boss.x, boss.y) < 430) {
    prompt = "F: pistol laser";
    promptColor = "#ffd166";
  }
  if (prompt) drawFloatingLabel(prompt, player.x, player.y - 48, promptColor, 158);
  if (player.mode === "Drone") {
    const camera = cameras.find((c) => !c.disabled && inCurrentLocation(c) && dist(player.x, player.y, c.x, c.y) < 38);
    if (camera && !prompt) drawFloatingLabel("kamera off", player.x, player.y - 48, "#ffd166", 132);
  }
}
function drawRoyalLeaderCeremony(x, y, scale = 1, compact = false) {
  const now = performance.now();
  const sx = (value) => Math.round(value * scale);
  const crownBob = Math.sin(now / 260) * sx(4);
  const rayPulse = 0.18 + Math.sin(now / 180) * 0.06;

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.fillStyle = "rgba(255, 209, 102, 0.08)";
  ctx.beginPath();
  ctx.arc(0, sx(-72), sx(compact ? 78 : 116), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 209, 102, ${rayPulse})`;
  ctx.lineWidth = Math.max(1, sx(2));
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12 + now / 1600;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * sx(26), sx(-70) + Math.sin(angle) * sx(18));
    ctx.lineTo(Math.cos(angle) * sx(110), sx(-70) + Math.sin(angle) * sx(70));
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(5, 7, 11, 0.72)";
  ctx.fillRect(sx(-120), sx(-64), sx(240), sx(102));
  ctx.fillStyle = "rgba(255, 209, 102, 0.16)";
  ctx.fillRect(sx(-108), sx(-54), sx(216), sx(12));
  ctx.fillRect(sx(-96), sx(22), sx(192), sx(16));
  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = Math.max(1, sx(2));
  for (let i = -2; i <= 2; i += 1) {
    const px = sx(i * 42);
    ctx.strokeRect(px - sx(10), sx(-40), sx(20), sx(64));
    ctx.fillStyle = "rgba(255, 209, 102, 0.22)";
    ctx.fillRect(px - sx(14), sx(-48), sx(28), sx(8));
    ctx.fillRect(px - sx(14), sx(22), sx(28), sx(8));
  }
  ctx.fillStyle = "rgba(46, 232, 155, 0.2)";
  ctx.fillRect(sx(-54), sx(36), sx(108), sx(18));
  ctx.fillStyle = "rgba(255, 209, 102, 0.18)";
  ctx.fillRect(sx(-34), sx(18), sx(68), sx(20));

  drawCharacterSprite(0, sx(38), {
    coat: "#101722",
    armor: "#244b66",
    scarf: "#ffd166",
    visor: "#29c7ff",
    skin: "#f1f7ff",
    hair: "#05070b"
  }, {
    scale: compact ? 0.58 * scale : 0.92 * scale,
    moving: false,
    aura: "rgba(255, 209, 102, 0.42)",
    glow: "rgba(46, 232, 155, 0.18)"
  });

  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.moveTo(sx(-18), sx(-24 + crownBob));
  ctx.lineTo(sx(-10), sx(-42 + crownBob));
  ctx.lineTo(sx(-2), sx(-26 + crownBob));
  ctx.lineTo(sx(8), sx(-46 + crownBob));
  ctx.lineTo(sx(16), sx(-24 + crownBob));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ff3b5f";
  ctx.fillRect(sx(-2), sx(-34 + crownBob), sx(4), sx(4));
  ctx.fillStyle = "#29c7ff";
  ctx.fillRect(sx(-9), sx(-30 + crownBob), sx(4), sx(4));
  ctx.fillRect(sx(7), sx(-30 + crownBob), sx(4), sx(4));

  for (let i = 0; i < 18; i += 1) {
    const px = sx(-110 + i * 13);
    const py = sx(-92 + ((i * 31 + Math.floor(now / 20)) % 92));
    ctx.fillStyle = i % 3 === 0 ? "#ffd166" : i % 3 === 1 ? "#2ee89b" : "#29c7ff";
    ctx.globalAlpha = 0.55;
    ctx.fillRect(px, py, sx(4), sx(4));
  }
  ctx.globalAlpha = 1;
  if (!compact) drawText("ARYA PEMIMPIN BARU", 0, sx(76), "#ffd166", sx(12), "center");
  ctx.restore();
}
function drawAryaOnRoyalThrone(x, y, scale = 1) {
  const now = performance.now();
  const sx = (value) => Math.round(value * scale);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  ctx.fillStyle = "rgba(255, 209, 102, 0.1)";
  ctx.beginPath();
  ctx.arc(0, sx(-54), sx(96), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 209, 102, 0.32)";
  ctx.lineWidth = Math.max(1, sx(3));
  ctx.strokeRect(sx(-74), sx(-92), sx(148), sx(156));
  ctx.fillStyle = "rgba(5, 7, 11, 0.78)";
  ctx.fillRect(sx(-66), sx(-84), sx(132), sx(144));
  ctx.fillStyle = "rgba(255, 209, 102, 0.2)";
  ctx.fillRect(sx(-58), sx(-76), sx(116), sx(16));
  ctx.fillRect(sx(-52), sx(26), sx(104), sx(34));
  ctx.fillStyle = "rgba(46, 232, 155, 0.18)";
  ctx.fillRect(sx(-46), sx(-42), sx(92), sx(56));
  drawGarudaLogo(0, sx(-50), 0.28 * scale, "#ffd166", "rgba(255, 209, 102, 0.1)");

  drawCharacterSprite(0, sx(4), {
    coat: "#101722",
    armor: "#244b66",
    scarf: "#ffd166",
    visor: "#29c7ff",
    skin: "#f1f7ff",
    hair: "#05070b"
  }, {
    scale: 0.82 * scale,
    moving: false,
    aura: "rgba(255, 209, 102, 0.42)",
    glow: "rgba(46, 232, 155, 0.18)"
  });

  const crownBob = Math.sin(now / 260) * sx(3);
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.moveTo(sx(-16), sx(-68 + crownBob));
  ctx.lineTo(sx(-8), sx(-86 + crownBob));
  ctx.lineTo(0, sx(-70 + crownBob));
  ctx.lineTo(sx(9), sx(-88 + crownBob));
  ctx.lineTo(sx(17), sx(-68 + crownBob));
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ff3b5f";
  ctx.fillRect(sx(-2), sx(-78 + crownBob), sx(4), sx(4));

  ctx.fillStyle = "rgba(5, 7, 11, 0.72)";
  ctx.fillRect(sx(-42), sx(38), sx(84), sx(16));
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(sx(-34), sx(36), sx(68), sx(4));
  drawText("ARYA DI TAKHTA RAKYAT", 0, sx(82), "#ffd166", sx(10), "center");
  ctx.restore();
}
function drawEndingOverlay() {
  if (!state.ending) return;
  const good = state.ending === "baik";
  const dead = state.ending === "mati";
  const now = performance.now();
  const pulse = 0.5 + Math.sin(now / 260) * 0.5;
  const sweep = (now / 28) % (W + 180) - 90;
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, good ? "#0b2b33" : dead ? "#120916" : "#210a14");
  sky.addColorStop(0.55, good ? "#123a31" : dead ? "#090712" : "#100711");
  sky.addColorStop(1, "#05070b");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  if (good) {
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 67 + now / 3) % (W + 80) - 40;
      const y = 46 + ((i * 41 + now / 5) % 318);
      ctx.fillStyle = i % 3 === 0 ? "#ffd166" : i % 3 === 1 ? "#2ee89b" : "#29c7ff";
      ctx.globalAlpha = 0.34 + (i % 5) * 0.06;
      ctx.fillRect(x, y, 5 + (i % 2) * 3, 10);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = `rgba(255, 209, 102, ${0.18 + pulse * 0.22})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i += 1) {
      const angle = i * 0.62 + now / 900;
      ctx.beginPath();
      ctx.moveTo(512, 230);
      ctx.lineTo(512 + Math.cos(angle) * 460, 230 + Math.sin(angle) * 220);
      ctx.stroke();
    }
  } else if (dead) {
    ctx.fillStyle = "rgba(184, 140, 255, 0.08)";
    for (let x = -80; x < W + 80; x += 72) {
      ctx.fillRect(x + (now / 35) % 72, 0, 18, H);
    }
    ctx.strokeStyle = "rgba(184, 140, 255, 0.18)";
    ctx.lineWidth = 5;
    for (let x = 78; x < W; x += 86) {
      ctx.beginPath();
      ctx.moveTo(x, 92);
      ctx.lineTo(x - 34, 466);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = "rgba(255, 59, 95, 0.28)";
    ctx.lineWidth = 18;
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.moveTo((i * 178 + sweep) % (W + 220) - 110, 0);
      ctx.lineTo((i * 178 + sweep + 190) % (W + 220) - 110, H);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255, 59, 95, ${0.06 + pulse * 0.08})`;
    ctx.fillRect(0, 0, W, H);
  }

  ctx.fillStyle = good ? "rgba(255, 209, 102, 0.18)" : dead ? "rgba(184, 140, 255, 0.13)" : "rgba(255, 59, 95, 0.16)";
  ctx.beginPath();
  ctx.arc(812, 112, good ? 62 : 42, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 18; i += 1) {
    const x = i * 62;
    const h = 56 + (i % 6) * 22;
    ctx.fillStyle = good ? "rgba(15, 51, 55, 0.76)" : dead ? "rgba(15, 15, 28, 0.82)" : "rgba(31, 16, 28, 0.82)";
    ctx.fillRect(x, 394 - h, 48, h);
    ctx.fillStyle = good ? "rgba(46, 232, 155, 0.35)" : dead ? "rgba(184, 140, 255, 0.22)" : "rgba(255, 59, 95, 0.26)";
    ctx.fillRect(x + 10, 360 - h, 7, 7);
    ctx.fillRect(x + 28, 380 - h, 7, 7);
  }
  ctx.fillStyle = good ? "rgba(46, 232, 155, 0.2)" : dead ? "rgba(69, 88, 108, 0.18)" : "rgba(255, 59, 95, 0.14)";
  ctx.fillRect(0, 394, W, 182);
  ctx.fillStyle = "rgba(5, 7, 11, 0.64)";
  ctx.fillRect(34, 28, 252, 48);
  ctx.strokeStyle = good ? "#2ee89b" : dead ? "#b88cff" : "#ff3b5f";
  ctx.lineWidth = 2;
  ctx.strokeRect(34.5, 28.5, 252, 48);
  ctx.fillStyle = good ? "#2ee89b" : dead ? "#b88cff" : "#ff3b5f";
  ctx.font = "900 22px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.fillText(good ? "GOOD ENDING" : dead ? "ENDING MATI" : "BAD ENDING", 160, 59);
  ctx.textAlign = "left";
  if (good) {
    ctx.fillStyle = "rgba(255, 209, 102, 0.14)";
    ctx.fillRect(0, 392, W, 8);
    ctx.fillStyle = "rgba(11, 42, 45, 0.88)";
    ctx.fillRect(80, 260, 864, 136);
    ctx.fillStyle = "rgba(255, 209, 102, 0.2)";
    ctx.fillRect(102, 244, 820, 18);
    ctx.fillRect(138, 216, 748, 18);
    ctx.fillStyle = "rgba(5, 7, 11, 0.48)";
    for (let x = 130; x <= 874; x += 78) {
      ctx.fillRect(x, 252, 30, 144);
      ctx.fillStyle = "rgba(255, 209, 102, 0.22)";
      ctx.fillRect(x - 8, 236, 46, 16);
      ctx.fillRect(x - 8, 376, 46, 18);
      ctx.fillStyle = "rgba(5, 7, 11, 0.48)";
    }
    ctx.strokeStyle = "rgba(255, 209, 102, 0.36)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 244, 88, Math.PI, 0);
    ctx.stroke();
    drawGarudaLogo(512, 226, 0.55, "#ffd166", "rgba(255, 209, 102, 0.16)");
    const citizens = [
      { x: 230, y: 420, skin: "warga-desa" },
      { x: 302, y: 434, skin: "saksi-bank" },
      { x: 372, y: 422, skin: "jurnalis-media" },
      { x: 636, y: 424, skin: "dokter-klinik" },
      { x: 704, y: 438, skin: "teknisi-port" }
    ];
    citizens.forEach((citizen, index) => {
      const skin = npcSkins[citizen.skin];
      drawCharacterSprite(citizen.x, citizen.y + Math.sin(now / 160 + index) * 3, skin, {
        scale: 0.72,
        moving: true,
        phase: now / 130 + index,
        aura: "rgba(46, 232, 155, 0.22)",
        glow: "rgba(46, 232, 155, 0.18)"
      });
    });
  }
  if (good) {
    ctx.fillStyle = "rgba(5, 7, 11, 0.68)";
    ctx.fillRect(714, 270, 178, 132);
    ctx.strokeStyle = "#2ee89b";
    ctx.lineWidth = 2;
    ctx.strokeRect(714.5, 270.5, 178, 132);
    ctx.fillStyle = "rgba(233, 246, 255, 0.16)";
    for (let x = 732; x < 878; x += 22) ctx.fillRect(x, 276, 6, 120);
    drawCharacterSprite(804, 360, {
      coat: "#14090d",
      armor: "#3a1620",
      scarf: "#45586c",
      visor: "#9bb2c6",
      skin: "#f4e4c4",
      hair: "#05070b"
    }, {
      scale: 0.92,
      moving: false,
      hostile: true,
      aura: "rgba(255, 209, 102, 0.18)",
      glow: "rgba(255, 59, 95, 0.12)"
    });
    drawText("THE MINISTER DIPENJARA", 803, 386, "#2ee89b", 12, "center");
    ctx.fillStyle = "rgba(46, 232, 155, 0.22)";
    ctx.fillRect(726, 238, 152 * pulse, 8);
    drawText("BUKTI TERBUKA", 803, 252, "#2ee89b", 11, "center");
  } else if (!dead) {
    ctx.fillStyle = "rgba(255, 59, 95, 0.14)";
    ctx.fillRect(690, 260, 226, 142);
    ctx.strokeStyle = "#ff3b5f";
    ctx.lineWidth = 2;
    ctx.strokeRect(690.5, 260.5, 226, 142);
    ctx.fillStyle = "rgba(5, 7, 11, 0.72)";
    ctx.fillRect(734, 326, 138, 48);
    drawCharacterSprite(804, 316, {
      coat: "#14090d",
      armor: "#4a1422",
      scarf: "#ffd166",
      visor: "#ff3b5f",
      skin: "#f4e4c4",
      hair: "#05070b"
    }, {
      scale: 0.82,
      moving: false,
      hostile: true,
      aura: "rgba(255, 209, 102, 0.34)",
      glow: "rgba(255, 59, 95, 0.2)"
    });
    drawGarudaLogo(804, 360, 0.28, "#ff3b5f", "rgba(255, 59, 95, 0.16)");
    drawText("THE MINISTER BERKUASA", 803, 388, "#ff9aaa", 12, "center");
    ctx.fillStyle = "rgba(255, 59, 95, 0.32)";
    for (let y = 236; y < 404; y += 22) ctx.fillRect(682, y, 244 * pulse, 5);
    drawText("BUKTI DIHAPUS", 803, 244, "#ff9aaa", 11, "center");
  } else {
    ctx.fillStyle = "rgba(184, 140, 255, 0.12)";
    ctx.fillRect(700, 268, 204, 134);
    ctx.strokeStyle = "#b88cff";
    ctx.lineWidth = 2;
    ctx.strokeRect(700.5, 268.5, 204, 134);
    ctx.fillStyle = "rgba(233, 246, 255, 0.18)";
    for (let x = 720; x < 888; x += 24) ctx.fillRect(x, 276, 7, 118);
    drawCharacterSprite(804, 356, {
      coat: "#111820",
      armor: "#26384c",
      scarf: "#45586c",
      visor: "#9bb2c6",
      skin: "#f1f7ff",
      hair: "#05070b"
    }, {
      scale: 0.82,
      moving: false,
      glow: "rgba(184, 140, 255, 0.14)"
    });
    drawText("ARYA DITAHAN", 803, 388, "#d9c8ff", 12, "center");
    ctx.strokeStyle = "rgba(184, 140, 255, 0.36)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(732, 238);
    ctx.lineTo(876, 238 + Math.sin(now / 180) * 16);
    ctx.stroke();
    drawText("OPERASI TERHENTI", 803, 244, "#d9c8ff", 11, "center");
  }

  ctx.fillStyle = "rgba(3, 5, 12, 0.72)";
  ctx.fillRect(128, 132, 768, 284);
  ctx.strokeStyle = good ? "#2ee89b" : "#ff3b5f";
  if (dead) ctx.strokeStyle = "#b88cff";
  ctx.lineWidth = 2;
  ctx.strokeRect(128.5, 132.5, 768, 284);
  if (good) {
    ctx.fillStyle = "rgba(5, 7, 11, 0.58)";
    ctx.fillRect(700, 146, 190, 88);
    ctx.strokeStyle = "#2ee89b";
    ctx.strokeRect(700.5, 146.5, 190, 88);
    drawAryaOnRoyalThrone(795, 196, 0.52);
    drawText("PIDATO ARYA", 795, 166, "#ffd166", 11, "center");
    drawText("MELAWAN KORUPSI", 795, 224, "#2ee89b", 9, "center");
  } else if (!dead) {
    ctx.fillStyle = "rgba(255, 59, 95, 0.14)";
    ctx.fillRect(738, 150, 128, 68);
    ctx.strokeStyle = "#ff3b5f";
    ctx.strokeRect(738.5, 150.5, 128, 68);
    drawGarudaLogo(802, 178, 0.35, "#ff3b5f", "rgba(255, 59, 95, 0.2)");
    drawText("NEGARA DIKUASAI", 802, 210, "#ff9aaa", 10, "center");
  } else {
    ctx.fillStyle = "rgba(5, 7, 11, 0.68)";
    ctx.fillRect(742, 148, 116, 70);
    ctx.strokeStyle = "#b88cff";
    ctx.strokeRect(742.5, 148.5, 116, 70);
    ctx.fillStyle = "rgba(233, 246, 255, 0.22)";
    for (let x = 754; x < 846; x += 18) ctx.fillRect(x, 154, 5, 58);
    drawText("SEL TAHANAN", 800, 204, "#d9c8ff", 11, "center");
  }

  ctx.fillStyle = good ? "#2ee89b" : dead ? "#b88cff" : "#ff3b5f";
  ctx.font = good ? "900 36px Segoe UI, Arial" : "900 44px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.fillText(good ? "ARYA PEMIMPIN BARU" : dead ? "ARYA DITANGKAP" : "INDONESIA JATUH", W / 2, 210);
  ctx.fillStyle = "#ffd166";
  ctx.font = "800 26px Segoe UI, Arial";
  ctx.fillText(good ? "THE MINISTER DIPENJARA, ARYA DIANGKAT" : dead ? "ARYA TERTANGKAP DAN DITAHAN" : "THE MINISTER BERKUASA", W / 2, 252);
  const endingText = good
    ? "Di atas takhta kerajaan Garuda, ARYA berbicara kepada rakyat: korupsi bukan sekadar uang hilang, tetapi masa depan yang dirampas. Jika korupsi dibiarkan, sekolah rusak, obat langka, jalan rapuh, harga naik, hukum dibeli, saksi dibungkam, dan rakyat dibuat takut. Karena itu bukti harus dibuka, pejabat korup dihukum, anggaran dikembalikan ke layanan publik, dan warga ikut mengawasi negara."
    : dead
      ? "ARYA kehabisan nyawa setelah tertangkap. Pasukan THE MINISTER menahannya di sel rahasia, menyita drone GARUDA, dan menekan saksi agar diam. Tanpa ARYA, operasi terhenti; ulangi misi dengan lebih hati-hati, jaga armor, gunakan stealth, dan matikan kamera sebelum alert penuh."
      : "Kesepakatan gelap membuat Indonesia jatuh ke tangan THE MINISTER. Bukti dihapus, media dibungkam, warga kota diawasi, dan gedung-gedung neon berubah menjadi simbol kekuasaan korup. Uang rakyat tetap mengalir ke rekening bayangan, hukum dibeli, dan rakyat dibuat takut untuk melawan.";
  const lessonText = good
    ? "Pidato ARYA: negara yang jujur lahir dari transparansi, perlindungan saksi, hukum yang adil, dan rakyat yang berani mengawasi kekuasaan."
    : dead
      ? "Penutup: keberanian harus ditemani strategi. Hindari deteksi, jaga armor dan nyawa, lalu bebaskan kembali operasi GARUDA."
      : "Penutup: saat bukti dikorbankan, negara jatuh ke tangan penguasa korup. Ulangi operasi dan pilih kepentingan rakyat.";
  drawWrappedText(endingText, W / 2, 286, 690, 22, "#e9f6ff", 15, "center");
  drawWrappedText(lessonText, W / 2, 374, 650, 20, "#9bb2c6", 14, "center");
  ctx.fillStyle = "#9bb2c6";
  ctx.font = "14px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.fillText("Tekan Reset Save di menu untuk memulai ulang operasi.", W / 2, 398);
  ctx.fillStyle = good ? "rgba(46, 232, 155, 0.12)" : dead ? "rgba(184, 140, 255, 0.12)" : "rgba(255, 59, 95, 0.12)";
  ctx.fillRect(166, 428, 692, 74);
  ctx.strokeStyle = good ? "#2ee89b" : dead ? "#b88cff" : "#ff3b5f";
  ctx.lineWidth = 2;
  ctx.strokeRect(166.5, 428.5, 692, 74);
  ctx.fillStyle = good ? "#2ee89b" : dead ? "#b88cff" : "#ff3b5f";
  ctx.font = "900 28px Segoe UI, Arial";
  ctx.fillText(good ? "TAMAT: RAKYAT MENANG" : dead ? "TAMAT: OPERASI GAGAL" : "TAMAT: KEGELAPAN MENANG", W / 2, 474);
  ctx.fillStyle = "rgba(3, 5, 12, 0.74)";
  ctx.fillRect(0, 0, 22, H);
  ctx.fillRect(W - 22, 0, 22, H);
  ctx.fillRect(0, 0, W, 18);
  ctx.fillRect(0, H - 18, W, 18);
  ctx.strokeStyle = good ? "#ffd166" : dead ? "#b88cff" : "#ff3b5f";
  ctx.lineWidth = 4;
  ctx.strokeRect(24.5, 20.5, W - 49, H - 41);
  ctx.textAlign = "left";
}
function updateTransition() {
  if (!state.transition) return;
  state.transition.timer -= 1;
  if (state.transition.timer <= 0) state.transition = null;
}
function drawDoorTransition() {
  if (!state.transition) return;
  const { timer, duration, label, accent } = state.transition;
  const t = timer / duration;
  const alpha = Math.sin(t * Math.PI);
  ctx.fillStyle = `rgba(3, 5, 12, ${0.18 + alpha * 0.54})`;
  ctx.fillRect(0, 0, W, H);

  const radius = 80 + (1 - t) * 260;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.22 + alpha * 0.48;
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, radius, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 18; i += 1) {
    const angle = i * 0.9 + performance.now() / 210;
    const px = W / 2 + Math.cos(angle) * (radius * 0.45 + (i % 4) * 22);
    const py = H / 2 + Math.sin(angle) * (radius * 0.25 + (i % 5) * 18);
    ctx.fillStyle = i % 2 ? accent : "#ffd166";
    ctx.fillRect(px, py, 6, 6);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(5, 7, 11, 0.82)";
  ctx.fillRect(W / 2 - 168, H / 2 - 28, 336, 56);
  drawText(label, W / 2, H / 2 + 6, accent, 16, "center");
}
function draw() {
  ctx.save();
  if (state.shake > 0) {
    state.shake -= 1;
    ctx.translate(Math.random() * 6 - 3, Math.random() * 6 - 3);
  }
  drawMap();
  drawObjectiveMarker();
  drawTerminals();
  drawNpcsAndPickups();
  drawThreats();
  drawProjectiles();
  drawBoss();
  drawPlayer();
  drawTopUi();
  drawEndingOverlay();
  drawDoorTransition();
  ctx.restore();
}
function loop() {
  updateTransition();
  if (state.running && !state.paused && !state.ending) {
    updatePlayer();
    updateThreats();
    updateBossFight();
    if (state.messageTimer > 0) state.messageTimer -= 1;
  }
  draw();
  requestAnimationFrame(loop);
}
function togglePause() {
  if (!state.running || state.dialog || state.hack || state.ending) return;
  state.paused = !state.paused;
  ui.pausePanel.classList.toggle("hidden", !state.paused);
  if (state.paused) saveGame();
}
window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (!event.repeat && ["e", "h", "f", "q", "m", "p", "b", " "].includes(key)) playButtonSound();
  keys.add(key);

  if (key === "p") togglePause();
  if (gameplayLocked()) return;
  if (key === "b") showCorruptionBriefing();
  if (key === "e") interact();
  if (key === "h") startHack();
  if (key === "f") fireLaserPistol();
  if (key === " ") useDistraction();
  if (key === "q") {
    player.mode = player.mode === "Drone" ? "Jalan" : "Drone";
    setMessage(player.mode === "Drone" ? "Drone Mode aktif. Dekati kamera untuk mematikannya." : "ARYA kembali ke Jalan Mode.");
    updateHud();
  }
  if (key === "m") {
    if (activeInterior() && player.mode !== "Motor") {
      setMessage("Motor hanya bisa dipakai di jalan luar gedung.");
      return;
    }
    player.mode = player.mode === "Motor" ? "Jalan" : "Motor";
    setMessage(player.mode === "Motor" ? "Motor futuristik aktif. Cepat, tapi mudah memicu alert." : "Motor dimatikan.");
    updateHud();
  }
});
window.addEventListener("keyup", (event) => {
  keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
});
ui.startButton.addEventListener("click", () => {
  playButtonSound();
  resetWorld();
});
ui.continueButton.addEventListener("click", () => {
  playButtonSound();
  if (!loadGame()) setMessage("Belum ada save. Mulai game baru dulu.");
});
ui.resetButton.addEventListener("click", () => {
  playButtonSound();
  removeSaveData();
  refreshContinueButton();
  setMessage("Save dihapus. Siap mulai operasi baru.");
});
ui.resumeButton.addEventListener("click", () => {
  playButtonSound();
  togglePause();
});
ui.saveButton.addEventListener("click", () => {
  playButtonSound();
  saveGame();
  setMessage("Game disimpan.");
});
ui.dialogNext.addEventListener("click", nextDialog);
ui.hackSubmit.addEventListener("click", () => {
  playButtonSound();
  completeHack();
});
ui.hackCancel.addEventListener("click", () => {
  playButtonSound();
  cancelHack();
});
ui.hackInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    playButtonSound();
    completeHack();
  }
  if (event.key === "Escape") {
    playButtonSound();
    cancelHack();
  }
});
ui.choiceHonest.addEventListener("click", () => {
  playButtonSound();
  chooseEnding(true);
});
ui.choiceDark.addEventListener("click", () => {
  playButtonSound();
  chooseEnding(false);
});
refreshContinueButton();
updateHud();
loop();
