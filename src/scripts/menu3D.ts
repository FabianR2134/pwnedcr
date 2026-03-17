  import * as THREE from 'three';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  /* ── Nav items ───────────────────────────────────────────────── */
  const NAV_ITEMS = [
    { label: 'INICIO',   sub: '→ home',           href: '/',            col: 0x00e5ff, hex: '#00e5ff' },
    { label: 'CHARLAS',  sub: '28 talks',          href: '/charlas',     col: 0xe91e8c, hex: '#e91e8c' },
    { label: 'TALLERES', sub: '8 workshops',       href: '/talleres',    col: 0x00ff88, hex: '#00ff88' },
    { label: 'FAQ',      sub: 'preguntas',         href: '/faq',         col: 0x7c3aed, hex: '#7c3aed' },
    { label: 'SPONSORS', sub: 'patrocinadores',    href: '/#sponsors',   col: 0xffaa00, hex: '#ffaa00' },
    { label: 'REGISTRO', sub: 'es gratis →',       href: 'https://app.tickettailor.com/events/pwnedcr/1848884', col: 0x00ff88, hex: '#00ff88' },
  ];

  const NODE_POS = [
    new THREE.Vector3( 0,    1.2,  2.5 ),  // INICIO
    new THREE.Vector3( 3.8,  1.8,  0   ),  // CHARLAS
    new THREE.Vector3( 3.8, -1.8, -0.5 ),  // TALLERES
    new THREE.Vector3(-3.8,  1.2, -0.5 ),  // FAQ
    new THREE.Vector3(-3.2, -1.8,  0.5 ),  // SPONSORS
    new THREE.Vector3( 0.5, -2.8,  1.5 ),  // REGISTRO
  ];

  const CONNECTIONS: [number, number][] = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[2,5],[3,4],[4,5],[1,4],
  ];

  /* ── DOM ─────────────────────────────────────────────────────── */
  const wrap      = document.getElementById('m3d-wrap')!;
  const canvas    = document.getElementById('m3d-canvas') as HTMLCanvasElement;
  const labelsCtn = document.getElementById('m3d-labels')!;
  const crosshair = document.getElementById('m3d-crosshair')!;
  const tooltip   = document.getElementById('m3d-tooltip')!;
  const ttName    = document.getElementById('m3d-tooltip-name')!;
  const ttSub     = document.getElementById('m3d-tooltip-sub')!;
  const modeEl    = document.getElementById('m3d-mode')!;

  /* ── Three.js state ──────────────────────────────────────────── */
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let nodeMeshes: THREE.Mesh[]     = [];
  let nodeGlows:  THREE.Mesh[]     = [];
  let connLines:  THREE.Line[]     = [];
  let labelEls:   HTMLElement[]    = [];
  let particles:  THREE.Points;

  /* ── Orbit state ─────────────────────────────────────────────── */
  const RADIUS   = 10;
  let theta      = 0.3;
  let phi        = 1.3;
  let isDragging = false;
  let dragStart  = { x: 0, y: 0 };
  let dragDelta  = { x: 0, y: 0 };
  const DRAG_THRESH = 4; // px — below this distance = click, not drag

  /* ── Raycasting ──────────────────────────────────────────────── */
  const mouse    = new THREE.Vector2(-999, -999);
  const raycaster = new THREE.Raycaster();
  let hoveredNode = -1;

  /* ── Build scene ─────────────────────────────────────────────── */
  function build() {
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;

    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
    updateCameraPos();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* Background particles */
    const pCount = 400;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.022, transparent: true, opacity: 0.22 }));
    scene.add(particles);

    /* Grid floor */
    const grid = new THREE.GridHelper(22, 22, 0x0d0025, 0x0d0025);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    grid.position.y = -4.5;
    scene.add(grid);

    /* Nav nodes */
    nodeMeshes = []; nodeGlows = []; labelEls = [];
    labelsCtn.innerHTML = '';

    NAV_ITEMS.forEach((item, i) => {
      const pos = NODE_POS[i];

      // Wireframe icosahedron
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.32, 0),
        new THREE.MeshBasicMaterial({ color: item.col, wireframe: true, transparent: true, opacity: 0.88 }),
      );
      mesh.position.copy(pos);
      mesh.userData = { index: i, href: item.href };
      scene.add(mesh);
      nodeMeshes.push(mesh);

      // Glow halo
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 10, 10),
        new THREE.MeshBasicMaterial({ color: item.col, transparent: true, opacity: 0.0, side: THREE.BackSide }),
      );
      glow.position.copy(pos);
      scene.add(glow);
      nodeGlows.push(glow);

      // Solid core dot
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 6, 6),
        new THREE.MeshBasicMaterial({ color: item.col }),
      );
      core.position.copy(pos);
      scene.add(core);

      // HTML label
      const el = document.createElement('div');
      el.className = 'm3d-node-label';
      el.style.setProperty('--c', item.hex);
      el.innerHTML = `
        <span class="nl-tick"></span>
        <span class="nl-name">${item.label}</span>
        <span class="nl-sub">${item.sub}</span>
      `;
      labelsCtn.appendChild(el);
      labelEls.push(el);
    });

    /* Connection lines */
    connLines = [];
    CONNECTIONS.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([NODE_POS[a].clone(), NODE_POS[b].clone()]);
      const mat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.1 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      connLines.push(line);
    });
  }

  function updateCameraPos() {
    camera.position.x = RADIUS * Math.sin(phi) * Math.cos(theta);
    camera.position.y = RADIUS * Math.cos(phi);
    camera.position.z = RADIUS * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
  }

  /* ── Render loop ─────────────────────────────────────────────── */
  let visible = false;
  let raf     = 0;

  function renderLoop() {
    raf = requestAnimationFrame(renderLoop);
    if (!visible) return;

    const t = performance.now() * 0.001;

    // Auto-rotate when not dragging
    if (!isDragging) {
      theta += 0.003;
      updateCameraPos();
    }

    // Rotate nodes
    nodeMeshes.forEach((m, i) => {
      m.rotation.x += 0.005 + i * 0.0008;
      m.rotation.y += 0.008 - i * 0.0004;
    });

    // Pulse connection lines
    connLines.forEach((l, i) => {
      (l.material as THREE.LineBasicMaterial).opacity =
        0.07 + 0.07 * Math.sin(t * 1.2 + i * 0.9);
    });

    // Slowly rotate particle cloud
    particles.rotation.y = t * 0.018;

    // Update HTML labels via 3D→screen projection
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    nodeMeshes.forEach((mesh, i) => {
      const p3 = mesh.position.clone().project(camera);
      const sx = ( p3.x * 0.5 + 0.5) * W;
      const sy = (-p3.y * 0.5 + 0.5) * H;
      const depth  = (p3.z + 1) * 0.5;
      const scale  = Math.max(0.6, 0.7 + depth * 0.5);
      const el     = labelEls[i];
      if (!el) return;
      el.style.left      = sx + 'px';
      el.style.top       = sy + 'px';
      el.style.transform = `translate(-50%, -145%) scale(${scale})`;
      el.style.zIndex    = String(Math.round(depth * 100));
      el.style.opacity   = p3.z > 0.95 ? '0.1' : String(0.45 + depth * 0.55);
    });

    renderer.render(scene, camera);
  }

  /* ── Raycasting helpers ──────────────────────────────────────── */
  function doRaycast() {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(nodeMeshes);
    const prev = hoveredNode;
    hoveredNode = hits.length > 0 ? (hits[0].object.userData as any).index : -1;

    if (prev !== hoveredNode) {
      if (prev >= 0) {
        gsap.to((nodeGlows[prev].material  as THREE.MeshBasicMaterial), { opacity: 0.0, duration: 0.25 });
        gsap.to((nodeMeshes[prev].material as THREE.MeshBasicMaterial), { opacity: 0.88, duration: 0.25 });
        labelEls[prev]?.classList.remove('active');
      }
      if (hoveredNode >= 0) {
        gsap.to((nodeGlows[hoveredNode].material  as THREE.MeshBasicMaterial), { opacity: 0.22, duration: 0.2 });
        gsap.to((nodeMeshes[hoveredNode].material as THREE.MeshBasicMaterial), { opacity: 1, duration: 0.2 });
        labelEls[hoveredNode]?.classList.add('active');
        ttName.textContent = NAV_ITEMS[hoveredNode].label;
        ttSub.textContent  = NAV_ITEMS[hoveredNode].sub;
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      // Position crosshair + tooltip on hovered node
      if (hoveredNode >= 0) {
        const p3 = nodeMeshes[hoveredNode].position.clone().project(camera);
        const W = wrap.clientWidth, H = wrap.clientHeight;
        const sx = ( p3.x * 0.5 + 0.5) * W;
        const sy = (-p3.y * 0.5 + 0.5) * H;
        crosshair.style.left = sx + 'px';
        crosshair.style.top  = sy + 'px';
        crosshair.classList.add('visible');
        tooltip.style.left = (sx + 18) + 'px';
        tooltip.style.top  = (sy - 30) + 'px';
        tooltip.classList.add('visible');
      } else {
        crosshair.classList.remove('visible');
        tooltip.classList.remove('visible');
      }
    }
  }

  /* ── Pointer events (drag + hover + click) ───────────────────── */
  canvas.addEventListener('pointerdown', (e) => {
    isDragging  = true;
    dragStart   = { x: e.clientX, y: e.clientY };
    dragDelta   = { x: 0, y: 0 };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    modeEl.textContent  = '// ROTATING';
  });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
    mouse.y = ((e.clientY - rect.top)  / rect.height) * -2 + 1;

    if (isDragging) {
      const dx = e.clientX - dragStart.x - dragDelta.x;
      const dy = e.clientY - dragStart.y - dragDelta.y;
      dragDelta = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };

      theta -= dx * 0.006;
      phi    = Math.max(0.25, Math.min(Math.PI - 0.25, phi - dy * 0.005));
      updateCameraPos();
    } else {
      doRaycast();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    const totalDrag = Math.hypot(
      e.clientX - dragStart.x,
      e.clientY - dragStart.y,
    );

    isDragging = false;
    canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = hoveredNode >= 0 ? 'pointer' : 'grab';
    modeEl.textContent  = '// DRAG TO ROTATE';

    // If barely moved → treat as click
    if (totalDrag < DRAG_THRESH && hoveredNode >= 0) {
      const item = NAV_ITEMS[hoveredNode];
      // Flash node
      gsap.fromTo(
        (nodeMeshes[hoveredNode].material as THREE.MeshBasicMaterial),
        { opacity: 1 },
        { opacity: 0.1, yoyo: true, repeat: 5, duration: 0.08 },
      );
      setTimeout(() => {
        if (item.href.startsWith('http')) {
          window.open(item.href, '_blank', 'noopener noreferrer');
        } else if (item.href.includes('#')) {
          document.getElementById(item.href.split('#')[1])?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = item.href;
        }
      }, 500);
    }
  });

  canvas.addEventListener('pointerleave', () => {
    if (!isDragging) {
      hoveredNode = -1;
      crosshair.classList.remove('visible');
      tooltip.classList.remove('visible');
      labelEls.forEach(el => el.classList.remove('active'));
    }
  });

  /* ── Resize ──────────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    if (!renderer) return;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  /* ── IntersectionObserver ────────────────────────────────────── */
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && raf === 0) renderLoop();
  }, { threshold: 0.1 }).observe(wrap);

  /* ── Init on scroll reach ────────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#m3d-nav-section',
    start: 'top 80%',
    once: true,
    onEnter() {
      build();
      canvas.style.cursor = 'grab';
      renderLoop();

      // Entrance animation: nodes scale from 0
      gsap.from(labelEls, {
        opacity: 0, scale: 0.3,
        stagger: 0.1, duration: 0.6, delay: 0.3,
        ease: 'back.out(2)',
      });
      gsap.from('.m3d-hud-tl, .m3d-hud-tr, .m3d-hud-br, .m3d-hint', {
        opacity: 0, y: 10, duration: 0.5, delay: 0.2, stagger: 0.06,
      });
    },
  });
