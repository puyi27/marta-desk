import * as THREE from "three";

export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#a8744f";
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 1024;
    const h = Math.random() * 4 + 1;
    ctx.fillStyle = i % 2 === 0 ? "rgba(80, 48, 25, 0.12)" : "rgba(200, 150, 110, 0.1)";
    ctx.fillRect(0, y, 1024, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createCorkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#c89d6c";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 3 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(120, 80, 40, 0.25)" : "rgba(240, 200, 150, 0.25)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

export function createVinylTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#111113";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#222226";
  ctx.lineWidth = 1.5;
  for (let r = 50; r < 240; r += 4) {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#c89432";
  ctx.beginPath();
  ctx.arc(256, 256, 75, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0a0a0c";
  ctx.beginPath();
  ctx.arc(256, 256, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("80s HITS", 256, 245);
  ctx.font = "10px sans-serif";
  ctx.fillText("Marta's Lofi", 256, 275);

  return new THREE.CanvasTexture(canvas);
}

export function createPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#fbf8ef";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#e8e1d2";
  ctx.lineWidth = 1.5;
  for (let y = 40; y < 512; y += 24) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(482, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#f0c8c8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 0);
  ctx.lineTo(70, 512);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export function createBookPageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f5f0e3";
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "#332a22";
  ctx.font = "bold 18px serif";
  ctx.fillText("Estudios sobre el amor", 50, 60);

  ctx.font = "italic 11px serif";
  ctx.fillText("José Ortega y Gasset", 50, 80);

  ctx.fillStyle = "#554a3e";
  ctx.font = "9px serif";
  const lines = [
    "El amor es un ímpetu centrífugo que proyecta",
    "hacia el ser amado la atención más cálida.",
    "No es mero deseo; el deseo quiere poseer,",
    "mas el amor anhela la existencia del otro.",
    "",
    "Capítulo II: La cristalización y el alma.",
    "Cuando el alma se encanta de una presencia,",
    "cada detalle de la vida adquiere relieve.",
    "Así contemplamos el mundo que construimos.",
  ];

  lines.forEach((line, idx) => {
    ctx.fillText(line, 50, 120 + idx * 20);
  });

  return new THREE.CanvasTexture(canvas);
}

export function updateClockCanvas(
  canvas: HTMLCanvasElement,
  hours: number,
  minutes: number,
  seconds: number,
  temp: number,
  condition: string
): void {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 84px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${hh}:${mm}`, canvas.width / 2 - 25, 115);

  ctx.font = "bold 38px monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText(ss, canvas.width / 2 + 130, 110);

  ctx.font = "bold 26px sans-serif";
  ctx.fillStyle = "#10b981";
  ctx.fillText(`${temp}°C · ${condition.toUpperCase()}`, canvas.width / 2, 165);
}
