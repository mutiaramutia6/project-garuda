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
const keys = new Set();
const missions = [
  {
    id: "data",
    name: "Misi 1 - Data Hilang",
    text: "Masuk ke gedung pemerintahan dan curi data rahasia proyek fiktif.",
    objective: "Hack terminal DATA di Gedung Pemerintah.",
    lesson: "Korupsi data membuat publik sulit mengawasi penggunaan anggaran.",
    target: "data-server",
    reward: "Database proyek palsu"
  },
  {
    id: "uang",
    name: "Misi 2 - Uang Rakyat",
    text: "Ikuti aliran uang korupsi dari rekening bayangan ke markas mafia.",
    objective: "Bicara dengan saksi bank, lalu hack terminal BANK.",
    lesson: "Transparansi anggaran membantu rakyat melihat ke mana dana publik mengalir.",
    target: "bank-server",
    needsNpc: "saksi-bank",
    reward: "Jejak transfer dana rakyat"
  },
  {
    id: "sadap",
    name: "Misi 3 - Operasi Tengah Malam",
    text: "Pasang alat sadap di distrik elite tanpa memicu alarm.",
    objective: "Ambil alat sadap NARA, lalu pasang di rumah pejabat.",
    lesson: "Pelapor dan saksi harus dilindungi agar kejahatan jabatan bisa dibuka.",
    target: "sadap-point",
    needsItem: "Alat sadap NARA",
    reward: "Rekaman rapat rahasia"
  },
  {
    id: "pelabuhan",
    name: "Misi 4 - Mafia Pelabuhan",
    text: "Bongkar penyelundupan uang ilegal di pelabuhan gelap.",
    objective: "Disable kamera pelabuhan dengan drone, lalu hack KARGO.",
    lesson: "Korupsi memperlemah ekonomi dan membuat harga kebutuhan rakyat naik.",
    target: "cargo-server",
    needsCameraOff: "cam-port",
    reward: "Manifest kargo uang ilegal"
  },
  {
    id: "minister",
    name: "Misi Final - The Minister",
    text: "Masuk ke tower utama, kalahkan sistem hacker gelap, dan bongkar semuanya.",
    objective: "Kumpulkan minimal 7 bukti, lalu hack terminal PUBLIKASI.",
    lesson: "Integritas berarti memilih kepentingan rakyat meski ada risiko.",
    target: "minister-server",
    minEvidence: 7,
    reward: "Identitas THE MINISTER"
  }
];
const districts = [
  { id: "gov", x: 24, y: 28, w: 240, h: 140, name: "Gedung Pemerintah", color: "#17293a", accent: "#29c7ff", doorX: 142, doorY: 170 },
  { id: "bank", x: 300, y: 34, w: 218, h: 142, name: "Jakarta Futuristik", color: "#142536", accent: "#ff3b5f", doorX: 410, doorY: 178 },
  { id: "elite", x: 552, y: 30, w: 170, h: 150, name: "Distrik Elite", color: "#221b35", accent: "#b88cff", doorX: 638, doorY: 182 },
  { id: "tower", x: 764, y: 38, w: 220, h: 154, name: "Tower Garuda Hitam", color: "#241421", accent: "#ffd166", doorX: 874, doorY: 194 },
  { id: "port", x: 34, y: 324, w: 284, h: 174, name: "Pelabuhan Gelap", color: "#10232f", accent: "#29c7ff", doorX: 178, doorY: 500 },
  { id: "village", x: 356, y: 320, w: 250, h: 178, name: "Desa Rusak", color: "#24251b", accent: "#2ee89b", doorX: 482, doorY: 500 },
  { id: "mafia", x: 660, y: 318, w: 236, h: 180, name: "Markas Mafia", color: "#271920", accent: "#ff3b5f", doorX: 778, doorY: 500 },
  { id: "clinic", x: 922, y: 320, w: 78, h: 178, name: "Klinik Publik", color: "#132a2a", accent: "#2ee89b", doorX: 962, doorY: 500 },
  { id: "media", x: 928, y: 214, w: 72, h: 86, name: "Media", color: "#1a2536", accent: "#29c7ff", doorX: 964, doorY: 300 }
];
const interiors = {
  gov: { name: "Lobi Gedung Pemerintah", wall: "#14263a", floor: "#0c1724", accent: "#29c7ff", exitX: 512, exitY: 530 },
  bank: { name: "Ruang Arsip Bank Kota", wall: "#172231", floor: "#0d1925", accent: "#ff3b5f", exitX: 512, exitY: 530 },
  elite: { name: "Apartemen Distrik Elite", wall: "#211a35", floor: "#140f24", accent: "#b88cff", exitX: 512, exitY: 530 },
  tower: { name: "Atrium Tower Garuda Hitam", wall: "#251321", floor: "#160a14", accent: "#ffd166", exitX: 512, exitY: 530 },
  port: { name: "Gudang Pelabuhan Gelap", wall: "#102838", floor: "#07151e", accent: "#29c7ff", exitX: 512, exitY: 530 },
  village: { name: "Balai Desa Rusak", wall: "#23261b", floor: "#11150e", accent: "#2ee89b", exitX: 512, exitY: 530 },
  mafia: { name: "Ruang Bawah Markas Mafia", wall: "#271820", floor: "#170b10", accent: "#ff3b5f", exitX: 512, exitY: 530 },
  clinic: { name: "Klinik Publik Darurat", wall: "#112827", floor: "#0a1718", accent: "#2ee89b", exitX: 512, exitY: 530 },
  media: { name: "Studio Media Independen", wall: "#142235", floor: "#0b1421", accent: "#29c7ff", exitX: 512, exitY: 530 }
};
const backgroundBuildings = [
  { x: 4, y: 32, w: 48, h: 78, color: "rgba(12, 25, 39, 0.66)", accent: "#29c7ff" },
  { x: 78, y: 18, w: 38, h: 92, color: "rgba(19, 31, 48, 0.62)", accent: "#ffd166" },
  { x: 210, y: 46, w: 58, h: 64, color: "rgba(22, 28, 45, 0.6)", accent: "#b88cff" },
  { x: 534, y: 24, w: 44, h: 88, color: "rgba(17, 32, 48, 0.64)", accent: "#2ee89b" },
  { x: 704, y: 12, w: 50, h: 102, color: "rgba(27, 24, 42, 0.62)", accent: "#ff3b5f" },
  { x: 928, y: 34, w: 60, h: 80, color: "rgba(18, 36, 47, 0.62)", accent: "#29c7ff" },
  { x: 8, y: 282, w: 60, h: 36, color: "rgba(13, 31, 38, 0.66)", accent: "#29c7ff" },
  { x: 320, y: 300, w: 42, h: 58, color: "rgba(20, 29, 36, 0.68)", accent: "#ffd166" },
  { x: 608, y: 286, w: 52, h: 52, color: "rgba(27, 22, 39, 0.65)", accent: "#b88cff" },
  { x: 904, y: 300, w: 34, h: 48, color: "rgba(14, 30, 32, 0.7)", accent: "#2ee89b" }
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
    x: 390,
    y: 430,
    name: "NARA",
    color: "#2ee89b",
    gives: "Alat sadap NARA",
    dialog: [
      "ARYA, aku siapkan drone sniper dan alat sadap. Gunakan diam-diam.",
      "Kalau kamera terlalu rapat, masuk Drone Mode lalu dekati kamera untuk mematikannya.",
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
    x: 486,
    y: 434,
    name: "Warga Desa",
    color: "#29c7ff",
    gives: "Foto sekolah rusak",
    optional: true,
    dialog: [
      "Sekolah kami tak selesai dibangun, tapi laporannya tertulis rampung.",
      "Ambil foto ini. Biar kota tahu dampaknya nyata."
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
  x: 112,
  y: 468,
  lastSafeX: 112,
  lastSafeY: 468,
  speed: 2.35,
  mode: "Jalan",
  stealth: false,
  stamina: 100,
  caught: 0,
  facing: 1
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
  location: "outside",
  outsideX: 112,
  outsideY: 468
};
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
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
function nearestDoor() {
  if (currentLocation() !== "outside") return null;
  return districts.find((district) => dist(player.x, player.y, district.doorX, district.doorY) < 42);
}
function setMessage(text, duration = 260) {
  state.message = text;
  state.messageTimer = duration;
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
    ending: state.ending
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    state.mission = data.mission ?? 0;
    state.reputation = data.reputation ?? 50;
    state.intel = data.intel ?? 1;
    state.evidence = data.evidence ?? [];
    state.inventory = data.inventory ?? [];
    state.completedNpc = data.completedNpc ?? [];
    state.ending = data.ending ?? null;
    player.x = data.player?.x ?? 112;
    player.y = data.player?.y ?? 468;
    player.lastSafeX = player.x;
    player.lastSafeY = player.y;
    state.location = data.location ?? "outside";
    state.outsideX = data.outsideX ?? player.x;
    state.outsideY = data.outsideY ?? player.y;
    data.pickups?.forEach((saved) => {
      const pickup = pickups.find((p) => p.id === saved.id);
      if (pickup) pickup.active = saved.active;
    });
    data.terminals?.forEach((saved) => {
      const terminal = terminals.find((t) => t.id === saved.id);
      if (terminal) terminal.active = saved.active;
    });
    data.cameras?.forEach((saved) => {
      const camera = cameras.find((c) => c.id === saved.id);
      if (camera) camera.disabled = saved.disabled;
    });
    state.running = true;
    ui.startScreen.classList.add("hidden");
    setMessage("Save dimuat. Operasi GARUDA dilanjutkan.");
    updateHud();
    return true;
  } catch {
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}
function resetWorld() {
  state.running = true;
  state.paused = false;
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
  state.location = "outside";
  state.outsideX = 112;
  state.outsideY = 468;
  player.x = 112;
  player.y = 468;
  player.lastSafeX = 112;
  player.lastSafeY = 468;
  player.mode = "Jalan";
  player.stamina = 100;
  player.caught = 0;
  terminals.forEach((t) => (t.active = true));
  pickups.forEach((p) => (p.active = true));
  cameras.forEach((c) => (c.disabled = false));
  ui.startScreen.classList.add("hidden");
  ui.pausePanel.classList.add("hidden");
  setMessage("Operasi GARUDA dimulai. Temui NARA atau langsung menuju objective hijau.");
  showDialog("NARA", [
    "Tahun 2045. Dana pembangunan hilang, kota rusak, dan jaringan korup menguasai negeri.",
    "Kita GARUDA. Kamu ARYA, investigator digital terbaik yang masih berani jujur.",
    "Kumpulkan bukti, lindungi saksi, dan jangan biarkan THE MINISTER menghapus jejak."
  ]);
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
}
function nextDialog() {
  if (!state.dialog) return;
  state.dialogIndex += 1;
  if (state.dialogIndex >= state.dialog.lines.length) {
    ui.dialogPanel.classList.add("hidden");
    state.dialog = null;
    state.paused = false;
    return;
  }
  ui.dialogText.textContent = state.dialog.lines[state.dialogIndex];
}
function nearestNpc() {
  return npcs.find((npc) => inCurrentLocation(npc) && dist(player.x, player.y, npc.x, npc.y) < 44);
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
    return "Ambil alat sadap dari NARA dulu.";
  }
  if (mission.needsCameraOff) {
    const cam = cameras.find((c) => c.id === mission.needsCameraOff);
    if (cam && !cam.disabled) return "Matikan kamera pelabuhan memakai Drone Mode.";
  }
  if (mission.minEvidence && state.evidence.length < mission.minEvidence) {
    return `Butuh minimal ${mission.minEvidence} bukti. Bukti saat ini: ${state.evidence.length}.`;
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
    updateHud();
    return;
  }

  terminal.active = false;
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
    showFinalChoice();
  }
  saveGame();
  updateHud();
}
function showFinalChoice() {
  state.paused = true;
  ui.choiceText.textContent = "THE MINISTER membuka topeng emas Garuda hitam dan menawarkan kesepakatan: hapus sebagian bukti, reputasimu aman, tapi rakyat tetap tidak tahu. Pilih akhir Operasi GARUDA.";
  ui.choicePanel.classList.remove("hidden");
}
function chooseEnding(honest) {
  ui.choicePanel.classList.add("hidden");
  state.paused = false;
  if (honest) {
    state.reputation = clamp(state.reputation + 25, 0, 100);
    state.ending = "baik";
    setMessage("ENDING BAIK: Bukti dipublikasikan. THE MINISTER ditangkap. Indonesia mulai pulih.", 900);
  } else {
    state.reputation = clamp(state.reputation - 45, 0, 100);
    state.ending = "buruk";
    setMessage("ENDING BURUK: Kesepakatan gelap diterima. Korupsi menang dan kota kembali padam.", 900);
  }
  saveGame();
  updateHud();
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

  if (vx || vy) {
    const len = Math.hypot(vx, vy);
    player.x += (vx / len) * speed;
    player.y += (vy / len) * speed;
    player.facing = vx < 0 ? -1 : vx > 0 ? 1 : player.facing;
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
    setMessage("Terdeteksi. GARUDA menarik ARYA ke checkpoint aman. Reputasi turun.");
    saveGame();
    updateHud();
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

  districts.forEach((district) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.26)";
    ctx.fillRect(district.x + 8, district.y + district.h, district.w, 10);
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.fillRect(district.x + 4, district.y - 7, district.w - 8, 7);
    ctx.fillStyle = district.color;
    ctx.fillRect(district.x, district.y, district.w, district.h);
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
    drawPixelRect(district.doorX - 15, district.doorY - 22, 30, 24, "#05070b", `rgba(255, 209, 102, 0.22)`);
    drawText("PINTU", district.doorX - 19, district.doorY + 18, district.accent, 10);
    if (dist(player.x, player.y, district.doorX, district.doorY) < 42) {
      drawText("E: masuk", district.doorX - 28, district.doorY + 34, "#2ee89b", 12);
    }
  });

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

  if (currentLocation() === "clinic") {
    drawText("+", 500, 292, interior.accent, 40, "center");
    ctx.fillStyle = "rgba(46, 232, 155, 0.12)";
    ctx.fillRect(462, 310, 100, 42);
  }
  if (currentLocation() === "media") {
    ctx.fillStyle = "rgba(41, 199, 255, 0.14)";
    ctx.fillRect(244, 164, 180, 94);
    drawText("LIVE", 318, 214, interior.accent, 24, "center");
  }

  drawPixelRect(interior.exitX - 28, interior.exitY - 18, 56, 26, "#05070b", "rgba(46, 232, 155, 0.24)");
  drawText("KELUAR", interior.exitX - 22, interior.exitY + 23, "#2ee89b", 11);
  if (dist(player.x, player.y, interior.exitX, interior.exitY) < 46) {
    drawText("E: keluar gedung", interior.exitX - 52, interior.exitY - 32, "#2ee89b", 13);
  }

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
    drawPixelRect(npc.x - 8, npc.y - 16, 16, 28, npc.color, "rgba(255, 255, 255, 0.1)");
    ctx.fillStyle = "#05070b";
    ctx.fillRect(npc.x - 5, npc.y - 9, 10, 5);
    if (dist(player.x, player.y, npc.x, npc.y) < 44) drawText("E: bicara", npc.x - 28, npc.y - 28, "#2ee89b", 12);
  });

  pickups.forEach((pickup) => {
    if (!pickup.active) return;
    if (!inCurrentLocation(pickup)) return;
    drawPixelRect(pickup.x - 8, pickup.y - 8, 16, 16, "#ffd166", "rgba(255, 209, 102, 0.32)");
    drawText("BUKTI", pickup.x - 18, pickup.y - 16, "#ffd166", 10);
    if (dist(player.x, player.y, pickup.x, pickup.y) < 34) drawText("E: ambil bukti", pickup.x - 42, pickup.y - 28, "#2ee89b", 12);
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
    drawPixelRect(guard.x - 9, guard.y - 14, 18, 28, "#ff3b5f", "rgba(255, 59, 95, 0.26)");
    ctx.fillStyle = "#101722";
    ctx.fillRect(guard.x - 5, guard.y - 8, 10, 6);
  });
}
function drawPlayer() {
  const bob = Math.sin(performance.now() / 120) * 1.5;
  if (player.mode === "Motor") {
    drawPixelRect(player.x - 20, player.y - 9 + bob, 40, 18, "#29c7ff", "rgba(41, 199, 255, 0.32)");
    ctx.fillStyle = "#05070b";
    ctx.fillRect(player.x - 15, player.y + 8 + bob, 8, 8);
    ctx.fillRect(player.x + 7, player.y + 8 + bob, 8, 8);
    ctx.fillStyle = "#ff3b5f";
    ctx.fillRect(player.x - player.facing * 24, player.y - 3 + bob, 9, 4);
    return;
  }
  if (player.mode === "Drone") {
    drawPixelRect(player.x - 12, player.y - 12 + bob, 24, 24, "#ffd166", "rgba(255, 209, 102, 0.35)");
    ctx.fillStyle = "#05070b";
    ctx.fillRect(player.x - 3, player.y - 3 + bob, 6, 6);
    ctx.fillStyle = "#29c7ff";
    ctx.fillRect(player.x - 18, player.y - 2 + bob, 8, 4);
    ctx.fillRect(player.x + 10, player.y - 2 + bob, 8, 4);
    return;
  }

  const neon = player.stealth ? characterSkin.stealth : characterSkin.visor;
  const dir = player.facing;
  drawPixelRect(player.x - 11, player.y - 15 + bob, 22, 31, characterSkin.coat, "rgba(41, 199, 255, 0.22)");
  ctx.fillStyle = characterSkin.armor;
  ctx.fillRect(player.x - 8, player.y - 11 + bob, 16, 18);
  ctx.fillStyle = characterSkin.scarf;
  ctx.fillRect(player.x - 10, player.y - 16 + bob, 20, 5);
  ctx.fillStyle = neon;
  ctx.fillRect(player.x - 8, player.y - 4 + bob, 16, 3);
  ctx.fillStyle = characterSkin.skin;
  ctx.fillRect(player.x - 6, player.y - 25 + bob, 12, 9);
  ctx.fillStyle = characterSkin.hair;
  ctx.fillRect(player.x - 7, player.y - 28 + bob, 14, 5);
  ctx.fillRect(player.x - 7, player.y - 24 + bob, 4, 8);
  ctx.fillStyle = neon;
  ctx.fillRect(player.x - 5, player.y - 22 + bob, 10, 2);
  ctx.fillStyle = "#0a0f16";
  ctx.fillRect(player.x - 15 * dir, player.y - 2 + bob, 6 * dir, 4);
  ctx.fillRect(player.x - 7, player.y + 13 + bob, 5, 8);
  ctx.fillRect(player.x + 2, player.y + 13 + bob, 5, 8);
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
      drawText("MASUK UNTUK OBJECTIVE", district.doorX - 70, district.doorY + 54, "#2ee89b", 11);
    }
    return;
  }
  const pulse = 10 + Math.sin(performance.now() / 160) * 4;
  ctx.strokeStyle = "#2ee89b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 28 + pulse, 0, Math.PI * 2);
  ctx.stroke();
  drawText("OBJECTIVE", target.x - 36, target.y + 46, "#2ee89b", 11);
}
function drawTopUi() {
  ctx.fillStyle = "rgba(5, 7, 11, 0.76)";
  ctx.fillRect(16, 14, 358, 72);
  drawText(currentMission().name, 30, 38, "#ffd166", 15);
  drawText(currentMission().objective, 30, 61, "#e9f6ff", 12);
  drawText(activeInterior()?.name || "Jalan Kota Nusantara", 30, 80, "#9bb2c6", 11);

  ctx.fillStyle = "rgba(5, 7, 11, 0.76)";
  ctx.fillRect(782, 14, 220, 72);
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

  ctx.fillStyle = "rgba(5, 7, 11, 0.78)";
  ctx.fillRect(16, 516, 700, 42);
  drawText(state.message, 30, 542, "#e9f6ff", 14);

  const terminal = nearestTerminal();
  if (terminal) drawText("E/H: hack terminal", player.x - 58, player.y - 42, "#2ee89b", 13);
  const door = nearestDoor();
  if (door) drawText("E: masuk gedung", player.x - 54, player.y - 42, "#2ee89b", 13);
  const interior = activeInterior();
  if (interior && dist(player.x, player.y, interior.exitX, interior.exitY) < 46) {
    drawText("E: keluar", player.x - 34, player.y - 42, "#2ee89b", 13);
  }
  if (player.mode === "Drone") {
    const camera = cameras.find((c) => !c.disabled && inCurrentLocation(c) && dist(player.x, player.y, c.x, c.y) < 38);
    if (camera) drawText("kamera off", player.x - 34, player.y - 42, "#ffd166", 13);
  }
}
function drawEndingOverlay() {
  if (!state.ending) return;
  ctx.fillStyle = "rgba(3, 5, 12, 0.62)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = state.ending === "baik" ? "#2ee89b" : "#ff3b5f";
  ctx.font = "900 44px Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.fillText(state.ending === "baik" ? "INDONESIA PULIH" : "KORUPSI MENANG", W / 2, 248);
  ctx.fillStyle = "#e9f6ff";
  ctx.font = "18px Segoe UI, Arial";
  ctx.fillText("Tekan Reset Save di menu untuk memulai ulang operasi.", W / 2, 286);
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
  keys.add(key);

  if (key === "p") togglePause();
  if (!state.running || state.paused) return;
  if (key === "e") interact();
  if (key === "h") startHack();
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
ui.startButton.addEventListener("click", resetWorld);
ui.continueButton.addEventListener("click", () => {
  if (!loadGame()) setMessage("Belum ada save. Mulai game baru dulu.");
});
ui.resetButton.addEventListener("click", () => {
  localStorage.removeItem(SAVE_KEY);
  setMessage("Save dihapus. Siap mulai operasi baru.");
});
ui.resumeButton.addEventListener("click", togglePause);
ui.saveButton.addEventListener("click", () => {
  saveGame();
  setMessage("Game disimpan.");
});
ui.dialogNext.addEventListener("click", nextDialog);
ui.hackSubmit.addEventListener("click", completeHack);
ui.hackCancel.addEventListener("click", cancelHack);
ui.hackInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") completeHack();
  if (event.key === "Escape") cancelHack();
});
ui.choiceHonest.addEventListener("click", () => chooseEnding(true));
ui.choiceDark.addEventListener("click", () => chooseEnding(false));
if (!localStorage.getItem(SAVE_KEY)) {
  ui.continueButton.disabled = true;
}
updateHud();
loop();
