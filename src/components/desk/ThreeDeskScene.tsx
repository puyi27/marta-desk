"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import {
  createWoodTexture,
  createCorkTexture,
  createVinylTexture,
  createPaperTexture,
  createBookPageTexture,
  updateClockCanvas,
} from "@/components/desk/threeUtils";

type InteractiveTarget =
  | "corkboard"
  | "dachshund"
  | "record_player"
  | "smart_clock"
  | "notepad"
  | "philosophy_book"
  | "gamer_drawer"
  | null;

const targetLabels: Record<
  string,
  { label: string; sublabel: string; badgePos: string }
> = {
  corkboard: {
    label: "Corcho de Recuerdos",
    sublabel: "3 fotos familiares",
    badgePos: "top-[18%] left-[12%]",
  },
  dachshund: {
    label: "Achuchar a Dora ❤️",
    sublabel: "Peluche teckel",
    badgePos: "top-[58%] left-[18%]",
  },
  record_player: {
    label: "80s playlist 🎵 ▶️",
    sublabel: "Tocadiscos vintage",
    badgePos: "top-[38%] left-[28%]",
  },
  smart_clock: {
    label: "Reloj Inteligente ⏰",
    sublabel: "Clic para alternar ambiente",
    badgePos: "top-[36%] left-[48%]",
  },
  notepad: {
    label: "Abrir bloc de notas ✍️",
    sublabel: "Apuntes y reflexiones",
    badgePos: "top-[62%] left-[48%]",
  },
  philosophy_book: {
    label: "TFM: Ortega y Gasset 📖",
    sublabel: "Estudios sobre el amor",
    badgePos: "top-[54%] left-[68%]",
  },
  gamer_drawer: {
    label: "Cajón Secreto 🎮",
    sublabel: "Mando DualSense",
    badgePos: "top-[78%] left-[48%]",
  },
};

export default function ThreeDeskScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { setActiveModal, themeMode, setThemeMode, weatherData, setSelectedPhotoId } =
    useDeskStore();
  const {
    playHoverTick,
    playSquish,
    playBookOpen,
    startVinyl,
  } = useAudioStore();

  const [hoveredTarget, setHoveredTarget] = useState<InteractiveTarget>(null);

  const themeModeRef = useRef(themeMode);
  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  const weatherDataRef = useRef(weatherData);
  useEffect(() => {
    weatherDataRef.current = weatherData;
  }, [weatherData]);

  const handleInteract = useCallback(
    (target: InteractiveTarget) => {
      if (!target) return;

      if (target === "dachshund") {
        playSquish();
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { x: 0.22, y: 0.62 },
          colors: ["#ff4081", "#e91e63", "#f48fb1", "#ff80ab", "#ff1744"],
        });
        fetch("/api/miss-you", { method: "POST" }).catch(() => {});
        toast.success("Achuchón enviado al móvil de Ángel ❤️");
      } else if (target === "record_player") {
        playBookOpen();
        startVinyl();
        setActiveModal("music");
      } else if (target === "philosophy_book") {
        playBookOpen();
        setActiveModal("philosophy");
      } else if (target === "notepad") {
        playBookOpen();
        setActiveModal("notepad");
      } else if (target === "corkboard") {
        playBookOpen();
        setSelectedPhotoId("photo-dora");
        setActiveModal("corkboard");
      } else if (target === "gamer_drawer") {
        playHoverTick();
        setActiveModal("gamer");
      } else if (target === "smart_clock") {
        playHoverTick();
        const modes: Array<"day" | "sunset" | "night" | "auto"> = [
          "day",
          "sunset",
          "night",
          "auto",
        ];
        const nextIdx = (modes.indexOf(themeModeRef.current) + 1) % modes.length;
        setThemeMode(modes[nextIdx]);
      }
    },
    [
      playSquish,
      playBookOpen,
      startVinyl,
      setActiveModal,
      setSelectedPhotoId,
      playHoverTick,
      setThemeMode,
    ]
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#9bc5e8");

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 3.25, 5.4);
    camera.lookAt(0, 1.35, 0.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fff6e0", 1.4);
    sunLight.position.set(6, 6, 2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const deskLampLight = new THREE.SpotLight("#ffb866", 0.6, 12, Math.PI / 4, 0.45, 1.2);
    deskLampLight.position.set(-2.2, 3.2, -0.3);
    const lampTarget = new THREE.Object3D();
    lampTarget.position.set(-1.0, 1.35, 0.4);
    scene.add(lampTarget);
    deskLampLight.target = lampTarget;
    deskLampLight.castShadow = true;
    scene.add(deskLampLight);

    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({ color: "#2d241e", roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    const backWallGeo = new THREE.PlaneGeometry(16, 10);
    const backWallMat = new THREE.MeshStandardMaterial({ color: "#ede6db", roughness: 0.9 });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 4, -2.0);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWallGeo = new THREE.PlaneGeometry(12, 10);
    const leftWallMat = new THREE.MeshStandardMaterial({ color: "#e4ddd1", roughness: 0.9 });
    const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.5, 4, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const windowGroup = new THREE.Group();
    windowGroup.position.set(1.9, 3.2, -1.98);

    const frameOuterMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4 });
    const frameInnerMat = new THREE.MeshStandardMaterial({ color: "#f0ece4", roughness: 0.5 });

    const frameOuterGeo = new THREE.BoxGeometry(3.2, 2.4, 0.08);
    const frameOuter = new THREE.Mesh(frameOuterGeo, frameOuterMat);
    windowGroup.add(frameOuter);

    const glassGeo = new THREE.PlaneGeometry(3.0, 2.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#cce8ff",
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = 0.01;
    windowGroup.add(glass);

    const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 0.1), frameInnerMat);
    windowGroup.add(mullionV);

    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.1), frameInnerMat);
    windowGroup.add(mullionH);

    const outdoorGroup = new THREE.Group();
    outdoorGroup.position.set(0, 0, -2.5);

    const hillMat = new THREE.MeshStandardMaterial({ color: "#5a8c43", roughness: 0.9 });
    const hill1 = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), hillMat);
    hill1.position.set(-2, -5, -4);
    outdoorGroup.add(hill1);

    const hill2 = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16), new THREE.MeshStandardMaterial({ color: "#487a32", roughness: 0.9 }));
    hill2.position.set(3, -5.5, -6);
    outdoorGroup.add(hill2);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#fff5cc" })
    );
    sunMesh.position.set(2.8, 3.2, -8);
    outdoorGroup.add(sunMesh);

    windowGroup.add(outdoorGroup);
    scene.add(windowGroup);

    const woodTexture = createWoodTexture();
    const deskMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.55,
      metalness: 0.05,
    });

    const deskTopGeo = new THREE.BoxGeometry(5.4, 0.14, 2.5);
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, 1.35, 0.1);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    scene.add(deskTop);

    const legGeo = new THREE.CylinderGeometry(0.045, 0.035, 1.35, 12);
    const legPositions = [
      [-2.5, 0.675, -1.0],
      [2.5, 0.675, -1.0],
      [-2.5, 0.675, 1.1],
      [2.5, 0.675, 1.1],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      scene.add(leg);
    });

    const matGeo = new THREE.BoxGeometry(2.4, 0.008, 1.3);
    const matMat = new THREE.MeshStandardMaterial({ color: "#1e2129", roughness: 0.85 });
    const deskMatMesh = new THREE.Mesh(matGeo, matMat);
    deskMatMesh.position.set(0.1, 1.425, 0.15);
    deskMatMesh.receiveShadow = true;
    scene.add(deskMatMesh);

    const interactiveMeshes: Record<string, THREE.Object3D> = {};

    const corkGroup = new THREE.Group();
    corkGroup.position.set(-3.45, 2.8, -0.6);
    corkGroup.rotation.y = Math.PI / 2;

    const corkFrameMat = new THREE.MeshStandardMaterial({ color: "#614126", roughness: 0.7 });
    const corkFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.05), corkFrameMat);
    corkFrame.castShadow = true;
    corkGroup.add(corkFrame);

    const corkTexture = createCorkTexture();
    const corkInner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.48, 2.08),
      new THREE.MeshStandardMaterial({ map: corkTexture, roughness: 0.9 })
    );
    corkInner.position.z = 0.026;
    corkGroup.add(corkInner);

    const textureLoader = new THREE.TextureLoader();
    const photoConfigs = [
      { src: "/images/corkboard/dora.jpg", x: -0.32, y: 0.45, rot: -0.06 },
      { src: "/images/corkboard/primos.jpg", x: 0.32, y: 0.42, rot: 0.05 },
      { src: "/images/corkboard/cristo.jpg", x: 0.0, y: -0.4, rot: -0.02 },
    ];

    photoConfigs.forEach((cfg) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(cfg.x, cfg.y, 0.035);
      pGroup.rotation.z = cfg.rot;

      const pBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.62, 0.008),
        new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4 })
      );
      pGroup.add(pBase);

      const pTex = textureLoader.load(cfg.src);
      const pImg = new THREE.Mesh(
        new THREE.PlaneGeometry(0.44, 0.44),
        new THREE.MeshBasicMaterial({ map: pTex })
      );
      pImg.position.set(0, 0.045, 0.005);
      pGroup.add(pImg);

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 10, 10),
        new THREE.MeshStandardMaterial({ color: "#d9383a", metalness: 0.7, roughness: 0.2 })
      );
      pin.position.set(0, 0.27, 0.015);
      pGroup.add(pin);

      corkGroup.add(pGroup);
    });

    scene.add(corkGroup);
    interactiveMeshes.corkboard = corkGroup;

    const dachshundGroup = new THREE.Group();
    dachshundGroup.position.set(-2.0, 1.42, 0.55);
    dachshundGroup.rotation.y = 0.4;

    const dogBrownMat = new THREE.MeshStandardMaterial({ color: "#8a532e", roughness: 0.85 });
    const dogDarkMat = new THREE.MeshStandardMaterial({ color: "#3d2212", roughness: 0.9 });
    const dogNoseMat = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.3 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.48, 14), dogBrownMat);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.12;
    body.castShadow = true;
    dachshundGroup.add(body);

    const headGroup = new THREE.Group();
    headGroup.position.set(0.24, 0.2, 0);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 14), dogBrownMat);
    head.castShadow = true;
    headGroup.add(head);

    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.18, 12), dogBrownMat);
    snout.rotation.z = -Math.PI / 2;
    snout.position.set(0.12, -0.02, 0);
    headGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), dogNoseMat);
    nose.position.set(0.21, -0.02, 0);
    headGroup.add(nose);

    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.07), dogDarkMat);
    earL.position.set(0.02, -0.04, 0.12);
    earL.rotation.x = 0.2;
    headGroup.add(earL);

    const earR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.07), dogDarkMat);
    earR.position.set(0.02, -0.04, -0.12);
    earR.rotation.x = -0.2;
    headGroup.add(earR);

    dachshundGroup.add(headGroup);

    const legPositionsDora = [
      [0.15, 0.04, 0.1],
      [0.15, 0.04, -0.1],
      [-0.15, 0.04, 0.1],
      [-0.15, 0.04, -0.1],
    ];
    legPositionsDora.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.09, 10), dogBrownMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      dachshundGroup.add(leg);
    });

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.15, 8), dogBrownMat);
    tail.rotation.z = -Math.PI / 4;
    tail.position.set(-0.28, 0.18, 0);
    dachshundGroup.add(tail);

    scene.add(dachshundGroup);
    interactiveMeshes.dachshund = dachshundGroup;

    const rpGroup = new THREE.Group();
    rpGroup.position.set(-1.3, 1.42, -0.2);
    rpGroup.rotation.y = 0.15;

    const caseMat = new THREE.MeshStandardMaterial({ color: "#2e5c46", roughness: 0.65 });
    const brassMat = new THREE.MeshStandardMaterial({ color: "#e0b04a", metalness: 0.8, roughness: 0.3 });

    const caseBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.64), caseMat);
    caseBase.position.y = 0.06;
    caseBase.castShadow = true;
    rpGroup.add(caseBase);

    const caseLid = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 0.64), caseMat);
    caseLid.position.set(0, 0.38, -0.28);
    caseLid.rotation.x = Math.PI / 3;
    caseLid.castShadow = true;
    rpGroup.add(caseLid);

    const platter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32),
      new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.4, roughness: 0.5 })
    );
    platter.position.set(-0.06, 0.13, 0);
    rpGroup.add(platter);

    const vinylTex = createVinylTexture();
    const vinylDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.005, 32),
      new THREE.MeshStandardMaterial({ map: vinylTex, roughness: 0.4 })
    );
    vinylDisc.position.set(-0.06, 0.145, 0);
    rpGroup.add(vinylDisc);

    const tonearm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.24, 8), brassMat);
    tonearm.rotation.z = Math.PI / 2;
    tonearm.rotation.y = -0.5;
    tonearm.position.set(0.18, 0.16, 0.08);
    rpGroup.add(tonearm);

    scene.add(rpGroup);
    interactiveMeshes.record_player = rpGroup;

    const clockGroup = new THREE.Group();
    clockGroup.position.set(0.1, 1.42, -0.45);

    const clockCaseMat = new THREE.MeshStandardMaterial({ color: "#11141c", roughness: 0.4 });
    const clockBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.26, 0.16), clockCaseMat);
    clockBody.position.y = 0.13;
    clockBody.castShadow = true;
    clockGroup.add(clockBody);

    const clockCanvas = document.createElement("canvas");
    clockCanvas.width = 512;
    clockCanvas.height = 192;
    const clockTexture = new THREE.CanvasTexture(clockCanvas);

    const screenMat = new THREE.MeshBasicMaterial({ map: clockTexture });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.22), screenMat);
    screenMesh.position.set(0, 0.13, 0.082);
    clockGroup.add(screenMesh);

    scene.add(clockGroup);
    interactiveMeshes.smart_clock = clockGroup;

    const notepadGroup = new THREE.Group();
    notepadGroup.position.set(0.08, 1.42, 0.48);
    notepadGroup.rotation.y = -0.15;

    const paperTex = createPaperTexture();
    const padBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.02, 0.62),
      new THREE.MeshStandardMaterial({ map: paperTex, roughness: 0.9 })
    );
    padBase.position.y = 0.01;
    padBase.castShadow = true;
    notepadGroup.add(padBase);

    const coilMat = new THREE.MeshStandardMaterial({ color: "#333333", metalness: 0.8, roughness: 0.3 });
    for (let c = -0.21; c <= 0.21; c += 0.045) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.005, 8, 16), coilMat);
      ring.position.set(c, 0.025, -0.3);
      notepadGroup.add(ring);
    }

    scene.add(notepadGroup);
    interactiveMeshes.notepad = notepadGroup;

    const bookGroup = new THREE.Group();
    bookGroup.position.set(1.15, 1.42, 0.18);
    bookGroup.rotation.y = 0.08;

    const bookPageTex = createBookPageTexture();
    const pageMat = new THREE.MeshStandardMaterial({ map: bookPageTex, roughness: 0.85 });
    const bookCoverMat = new THREE.MeshStandardMaterial({ color: "#4a1c1a", roughness: 0.6 });

    const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.58), pageMat);
    leftPage.position.set(-0.21, 0.015, 0);
    leftPage.rotation.z = 0.04;
    leftPage.castShadow = true;
    bookGroup.add(leftPage);

    const rightPage = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.58), pageMat);
    rightPage.position.set(0.21, 0.015, 0);
    rightPage.rotation.z = -0.04;
    rightPage.castShadow = true;
    bookGroup.add(rightPage);

    const ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.005, 0.64),
      new THREE.MeshStandardMaterial({ color: "#c92a2a", roughness: 0.4 })
    );
    ribbon.position.set(0, 0.028, 0.03);
    bookGroup.add(ribbon);

    scene.add(bookGroup);
    interactiveMeshes.philosophy_book = bookGroup;

    const drawerGroup = new THREE.Group();
    drawerGroup.position.set(0, 1.05, 0.95);

    const drawerBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.22, 0.04),
      new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.6 })
    );
    drawerBox.position.y = 0.11;
    drawerGroup.add(drawerBox);

    const drawerHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12),
      brassMat
    );
    drawerHandle.rotation.z = Math.PI / 2;
    drawerHandle.position.set(0, 0.11, 0.03);
    drawerGroup.add(drawerHandle);

    const controllerGroup = new THREE.Group();
    controllerGroup.position.set(0, 0.08, 0.12);
    controllerGroup.scale.set(0.65, 0.65, 0.65);

    const ctrlBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.05, 0.18),
      new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 })
    );
    controllerGroup.add(ctrlBody);

    const ctrlBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.01, 0.02),
      new THREE.MeshBasicMaterial({ color: "#38bdf8" })
    );
    ctrlBar.position.set(0, 0.026, -0.06);
    controllerGroup.add(ctrlBar);

    drawerGroup.add(controllerGroup);
    scene.add(drawerGroup);
    interactiveMeshes.gamer_drawer = drawerGroup;

    const lampGroup = new THREE.Group();
    lampGroup.position.set(-2.2, 1.42, -0.5);

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 20), brassMat);
    lampGroup.add(lampBase);

    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 12), brassMat);
    lampPole.position.set(0, 0.6, 0);
    lampGroup.add(lampPole);

    const lampHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.28, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: "#222222", roughness: 0.4 })
    );
    lampHead.rotation.x = Math.PI / 2 + 0.3;
    lampHead.position.set(0.18, 1.15, 0.15);
    lampGroup.add(lampHead);

    scene.add(lampGroup);

    const mugGroup = new THREE.Group();
    mugGroup.position.set(1.9, 1.42, 0.65);

    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.08, 0.18, 20),
      new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.2 })
    );
    mug.position.y = 0.09;
    mug.castShadow = true;
    mugGroup.add(mug);

    const coffeeSurface = new THREE.Mesh(
      new THREE.CircleGeometry(0.08, 16),
      new THREE.MeshStandardMaterial({ color: "#2c1a0e", roughness: 0.3 })
    );
    coffeeSurface.rotation.x = -Math.PI / 2;
    coffeeSurface.position.y = 0.17;
    mugGroup.add(coffeeSurface);

    scene.add(mugGroup);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = () => {
      raycaster.setFromCamera(mouse, camera);
      const testObjects = Object.values(interactiveMeshes);
      const intersects = raycaster.intersectObjects(testObjects, true);

      if (intersects.length > 0) {
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && rootObj.parent && rootObj.parent !== scene) {
          rootObj = rootObj.parent;
        }

        const foundKey = Object.keys(interactiveMeshes).find(
          (k) => interactiveMeshes[k] === rootObj
        ) as InteractiveTarget;

        if (foundKey) {
          handleInteract(foundKey);
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    let animationId: number;
    let clockTicker = 0;
    let lastHovered: string | null = null;
    let squishTime = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      clockTicker++;
      if (clockTicker % 30 === 0) {
        const now = new Date();
        const t = weatherDataRef.current?.temp ?? 6;
        const c = weatherDataRef.current?.condition ?? "despejado";
        updateClockCanvas(
          clockCanvas,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          t,
          c
        );
        clockTexture.needsUpdate = true;
      }

      const mode = themeModeRef.current;
      if (mode === "night") {
        scene.background = new THREE.Color("#0c0f18");
        ambientLight.color.set("#1a2238");
        ambientLight.intensity = 0.45;
        sunLight.color.set("#4a6090");
        sunLight.intensity = 0.25;
        deskLampLight.intensity = 2.4;
      } else if (mode === "sunset") {
        scene.background = new THREE.Color("#df784b");
        ambientLight.color.set("#ffb080");
        ambientLight.intensity = 0.65;
        sunLight.color.set("#ff7a30");
        sunLight.intensity = 2.0;
        deskLampLight.intensity = 1.0;
      } else {
        scene.background = new THREE.Color("#9bc5e8");
        ambientLight.color.set("#ffffff");
        ambientLight.intensity = 0.85;
        sunLight.color.set("#fff6e0");
        sunLight.intensity = 1.4;
        deskLampLight.intensity = 0.3;
      }

      vinylDisc.rotation.y += 0.02;

      raycaster.setFromCamera(mouse, camera);
      const testObjects = Object.values(interactiveMeshes);
      const intersects = raycaster.intersectObjects(testObjects, true);

      let currentHoverKey: InteractiveTarget = null;
      if (intersects.length > 0) {
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && rootObj.parent && rootObj.parent !== scene) {
          rootObj = rootObj.parent;
        }
        currentHoverKey = (Object.keys(interactiveMeshes).find(
          (k) => interactiveMeshes[k] === rootObj
        ) as InteractiveTarget) ?? null;
      }

      if (currentHoverKey !== lastHovered) {
        lastHovered = currentHoverKey;
        setHoveredTarget(currentHoverKey);
        if (currentHoverKey) {
          container.style.cursor = "pointer";
          playHoverTick();
        } else {
          container.style.cursor = "default";
        }
      }

      if (currentHoverKey === "gamer_drawer") {
        drawerGroup.position.z = THREE.MathUtils.lerp(drawerGroup.position.z, 1.25, 0.1);
      } else {
        drawerGroup.position.z = THREE.MathUtils.lerp(drawerGroup.position.z, 0.95, 0.1);
      }

      if (currentHoverKey === "dachshund") {
        squishTime += 0.1;
        dachshundGroup.scale.set(
          1 + Math.sin(squishTime) * 0.04,
          1 - Math.sin(squishTime) * 0.04,
          1 + Math.sin(squishTime) * 0.04
        );
      } else {
        dachshundGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [handleInteract, playHoverTick]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      <div ref={mountRef} className="w-full h-full" />

      {hoveredTarget && targetLabels[hoveredTarget] && (
        <div
          className={`absolute ${targetLabels[hoveredTarget].badgePos} pointer-events-none z-30 transition-all duration-300 transform -translate-x-1/2`}
        >
          <div className="backdrop-blur-md bg-white/95 text-zinc-900 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl border border-white/60 flex items-center gap-2 select-none animate-in fade-in zoom-in-95 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{targetLabels[hoveredTarget].label}</span>
            <span className="text-[10px] text-zinc-500 font-normal">
              · {targetLabels[hoveredTarget].sublabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
