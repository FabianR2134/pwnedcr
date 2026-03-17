  import * as THREE from 'three';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  const PANEL_LABELS = ['01 · Red Team', '02 · Blue Team'];

  /* ── Panel 0: Torus Knot (Red Team) ───────────────────────────── */
  function initPanel0() {
    const canvas = document.getElementById('canvas-p0') as HTMLCanvasElement;
    if (!canvas) return;
    const w = canvas.parentElement!.clientWidth;
    const h = canvas.parentElement!.clientHeight;
    canvas.width = w; canvas.height = h;

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(50, w / h, 0.1, 60);
    cam.position.z = 5.5;
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setSize(w, h); r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(0x000000, 0);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.3, 0.38, 160, 20, 2, 3),
      new THREE.MeshBasicMaterial({ color: 0xe91e8c, wireframe: true, transparent: true, opacity: 0.85 }),
    );
    scene.add(knot);

    const knot2 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.8, 0.04, 80, 8, 3, 5),
      new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.4 }),
    );
    scene.add(knot2);

    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xe91e8c, transparent: true, opacity: 0.05, side: THREE.BackSide }),
    ));

    const pCount = 350;
    const pPos   = new Float32Array(pCount * 3);
    const pVel   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const phi = Math.random() * Math.PI * 2, theta = Math.random() * Math.PI * 2;
      const rad = 0.2 + Math.random() * 3;
      pPos[i*3] = rad * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = rad * Math.sin(phi) * Math.sin(theta);
      pPos[i*3+2] = rad * Math.cos(phi);
      pVel[i*3] = (Math.random() - 0.5) * 0.015;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.015;
      pVel[i*3+2] = (Math.random() - 0.5) * 0.015;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0xe91e8c, size: 0.03, transparent: true, opacity: 0.55 })));

    let mx = 0, my = 0;
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      my = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    });
    let visible = false;
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0.1 }).observe(canvas);

    function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      knot.rotation.x  += 0.006; knot.rotation.y  += 0.01;
      knot2.rotation.x -= 0.004; knot2.rotation.z += 0.006;
      const posArr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        posArr[i*3] += pVel[i*3]; posArr[i*3+1] += pVel[i*3+1]; posArr[i*3+2] += pVel[i*3+2];
        const len = Math.sqrt(posArr[i*3]**2 + posArr[i*3+1]**2 + posArr[i*3+2]**2);
        if (len > 4 || len < 0.5) { pVel[i*3]*=-1; pVel[i*3+1]*=-1; pVel[i*3+2]*=-1; }
      }
      pGeo.attributes.position.needsUpdate = true;
      knot.position.x += (mx * 0.5 - knot.position.x) * 0.04;
      knot.position.y += (-my * 0.5 - knot.position.y) * 0.04;
      r.render(scene, cam);
    }
    loop();
  }

  /* ── Panel 1: Octaedro escudo (Blue Team) ─────────────────────── */
  function initPanel1() {
    const canvas = document.getElementById('canvas-p1') as HTMLCanvasElement;
    if (!canvas) return;
    const w = canvas.parentElement!.clientWidth;
    const h = canvas.parentElement!.clientHeight;
    canvas.width = w; canvas.height = h;

    const scene = new THREE.Scene();
    const cam   = new THREE.PerspectiveCamera(50, w / h, 0.1, 60);
    cam.position.z = 5.5;
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    r.setSize(w, h); r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.setClearColor(0x000000, 0);

    // Octaedro central — más brillante para mayor visibilidad
    const oct = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.4, 1),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.95 }),
    );
    scene.add(oct);

    // Anillos orbitales
    const ringData = [
      { rx: 0,           ry: 0, rz: 0,            color: 0x00e5ff, op: 0.45 },
      { rx: Math.PI / 2, ry: 0, rz: 0,            color: 0x7c3aed, op: 0.35 },
      { rx: Math.PI / 4, ry: 0, rz: Math.PI / 3,  color: 0x00e5ff, op: 0.3  },
    ];
    const rings: THREE.Mesh[] = [];
    ringData.forEach(d => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.4, 0.016, 4, 100),
        new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: d.op }),
      );
      ring.rotation.set(d.rx, d.ry, d.rz);
      scene.add(ring);
      rings.push(ring);
    });

    // Electrones orbitales
    const electrons: THREE.Mesh[] = [];
    ringData.forEach(() => {
      const e = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
      );
      scene.add(e);
      electrons.push(e);
    });

    // Grid de defensa
    const grid = new THREE.GridHelper(12, 12, 0x00e5ff, 0x00e5ff);
    const gm = grid.material as THREE.Material;
    gm.transparent = true; gm.opacity = 0.07;
    grid.position.y = -3; grid.rotation.x = 0.3;
    scene.add(grid);

    // Glow interior
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.06 }),
    ));

    // Partículas de fondo
    const pCount = 280;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 12;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.03, transparent: true, opacity: 0.3 })));

    let visible = false;
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }, { threshold: 0.1 }).observe(canvas);

    function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      const t = performance.now() * 0.001;
      oct.rotation.x = t * 0.25;
      oct.rotation.y = t * 0.4;
      rings[0].rotation.z = t * 0.35;
      rings[1].rotation.x = -t * 0.3 + Math.PI / 2;
      rings[2].rotation.y = t * 0.2;
      electrons.forEach((e, i) => {
        const angle = t * (0.8 + i * 0.3), radius = 2.4;
        if (i === 0) e.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        if (i === 1) e.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        if (i === 2) e.position.set(0, Math.cos(angle) * radius * Math.cos(Math.PI/3), Math.sin(angle) * radius);
      });
      r.render(scene, cam);
    }
    loop();
  }

  /* ── Contadores animados ──────────────────────────────────────── */
  function animateCounters() {
    document.querySelectorAll<HTMLElement>('.ss-anim-num').forEach(el => {
      const target = parseInt(el.dataset.target || '0', 10);
      gsap.to({ v: 0 }, {
        v: target, duration: 1.5, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round((this as any).targets()[0].v).toString(); },
      });
    });
  }

  /* ── Scroll horizontal GSAP ──────────────────────────────────── */
  const section = document.getElementById('story-scroll')!;
  const track   = document.getElementById('ss-track')!;
  const dotBtns = document.querySelectorAll<HTMLElement>('.ss-dot-btn');
  const bar     = document.getElementById('ss-progress-bar');
  const labelEl = document.getElementById('ss-label-text');
  const veilEl  = document.getElementById('ss-transition-veil');

  const PANELS   = 2;
  const SCROLL_H = window.innerHeight * (PANELS - 1);
  let countersRun = false;

  if (section && track) {
    const contentEls = Array.from({length: PANELS}, (_, i) =>
      document.querySelector<HTMLElement>(`#sp-${i} .ss-content`));
    const visualEls = Array.from({length: PANELS}, (_, i) =>
      document.querySelector<HTMLElement>(`#sp-${i} .ss-visual`));

    gsap.to(track, {
      xPercent: -(100 * (PANELS - 1)),
      ease: 'none',
      onUpdate() {
        const p = this.progress();
        const floatPos = p * (PANELS - 1);
        const activeIdx = Math.min(PANELS - 1, Math.round(floatPos));

        dotBtns.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
        if (bar) bar.style.width = (p * 100) + '%';
        if (labelEl) labelEl.textContent = PANEL_LABELS[activeIdx];
        if (!countersRun && activeIdx >= 1) { countersRun = true; animateCounters(); }

        // Opacidad y parallax suave por panel
        for (let i = 0; i < PANELS; i++) {
          const offset = floatPos - i;
          const absOff = Math.abs(offset);
          const opacity = Math.max(0, 1 - absOff * 1.1);
          const dx = -offset * 24;
          const scale = 1 - Math.min(absOff * 0.035, 0.035);

          if (contentEls[i]) {
            contentEls[i]!.style.opacity = String(opacity);
            contentEls[i]!.style.transform = `translateX(${dx}px) scale(${scale})`;
          }
          if (visualEls[i]) {
            visualEls[i]!.style.opacity = String(Math.max(0, 1 - absOff * 1.3));
          }
        }

        // Velo de transición suave en el punto medio
        if (veilEl) veilEl.style.opacity = String(Math.sin((floatPos % 1) * Math.PI) * 0.1);
      },
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1.8,
        anticipatePin: 1,
        start: 'top top',
        end: `+=${SCROLL_H}`,
      },
    });

    setTimeout(() => {
      initPanel0();
      initPanel1();
    }, 200);
  }
