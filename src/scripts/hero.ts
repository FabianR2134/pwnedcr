  import * as THREE from 'three';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  /* ────────────────────────────────────────────
   * THREE.JS — Particle network
   * ──────────────────────────────────────────── */
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  const section = document.getElementById('hero') as HTMLElement;

  const PARTICLE_COUNT = 100;
  const CONNECT_DIST   = 9;
  const COLORS_HEX     = [0x00e5ff, 0xe91e8c, 0x7c3aed, 0x00ff88];

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 32;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);

  // Particles
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const velocities: {vx:number,vy:number,vz:number}[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 65;
    positions[i*3+1] = (Math.random() - 0.5) * 42;
    positions[i*3+2] = (Math.random() - 0.5) * 22;

    const c = new THREE.Color(COLORS_HEX[Math.floor(Math.random() * COLORS_HEX.length)]);
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;

    velocities.push({
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.008,
      vz: (Math.random() - 0.5) * 0.005,
    });
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 3.5 * (280.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float a = pow(1.0 - d * 2.0, 2.0);
        gl_FragColor = vec4(vColor, a * 0.85);
      }`,
    transparent: true, depthWrite: false, vertexColors: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Lines
  const lineGeo = new THREE.BufferGeometry();
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00e5ff, transparent: true, opacity: 0.05, depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  function updateLines() {
    const pos = points.geometry.attributes.position.array as Float32Array;
    const pts: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1], dz = pos[i*3+2]-pos[j*3+2];
        if (dx*dx + dy*dy + dz*dz < CONNECT_DIST * CONNECT_DIST) {
          pts.push(pos[i*3],pos[i*3+1],pos[i*3+2], pos[j*3],pos[j*3+1],pos[j*3+2]);
        }
      }
    }
    lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  }

  let mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  let frameCount = 0;
  let animId: number;
  let running = true;

  function animate() {
    if (!running) return;
    animId = requestAnimationFrame(animate);
    frameCount++;

    const pos = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i*3]   += velocities[i].vx;
      pos[i*3+1] += velocities[i].vy;
      pos[i*3+2] += velocities[i].vz;
      if (pos[i*3]   >  32) pos[i*3]   = -32;
      if (pos[i*3]   < -32) pos[i*3]   =  32;
      if (pos[i*3+1] >  21) pos[i*3+1] = -21;
      if (pos[i*3+1] < -21) pos[i*3+1] =  21;
      if (pos[i*3+2] >  11) pos[i*3+2] = -11;
      if (pos[i*3+2] < -11) pos[i*3+2] =  11;
    }
    points.geometry.attributes.position.needsUpdate = true;
    if (frameCount % 2 === 0) updateLines();

    camera.position.x += (mouse.x * 3.5 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 2.0 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Pause when off-screen
  new IntersectionObserver(entries => {
    running = entries[0].isIntersecting;
    if (running) animate();
    else cancelAnimationFrame(animId);
  }, { threshold: 0 }).observe(section);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();

  /* ────────────────────────────────────────────
   * COUNTDOWN
   * ──────────────────────────────────────────── */
  const cdEl = document.getElementById('countdown');
  const eventDate = cdEl ? new Date(cdEl.dataset.date!) : null;

  function pad(n: number) { return String(n).padStart(2, '0'); }

  function tick() {
    if (!eventDate) return;
    const diff = eventDate.getTime() - Date.now();
    const dEl = document.getElementById('cd-days');
    if (!dEl) return;
    if (diff <= 0) {
      ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = '00';
      });
      return;
    }
    document.getElementById('cd-days')!.textContent    = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-hours')!.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById('cd-minutes')!.textContent = pad(Math.floor((diff % 3600000) / 60000));
    document.getElementById('cd-seconds')!.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);

  /* ────────────────────────────────────────────
   * GSAP ENTRANCE ANIMATION
   * ──────────────────────────────────────────── */
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 });

  tl.from('#hero-eyebrow', { opacity: 0, y: 30, duration: 0.7 })
    .from('#word-pwned', {
      yPercent: 110, opacity: 0, duration: 1, ease: 'power4.out',
    }, '-=0.3')
    .from('#word-cr', {
      yPercent: 110, opacity: 0, duration: 1, ease: 'power4.out',
    }, '-=0.7')
    .from('#word-edition', {
      opacity: 0, x: -20, duration: 0.6,
    }, '-=0.5')
    .from('#hero-sub',   { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    .from('#hero-date',  { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
    .from('#hero-proof', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
    .from('.countdown',  { opacity: 0, y: 20, duration: 0.5 }, '-=0.1')
    .from('#hero-cta',   { opacity: 0, y: 20, duration: 0.5 }, '-=0.1')
    .from('#scroll-cue', { opacity: 0, duration: 0.5 }, '-=0.1');

  /* ────────────────────────────────────────────
   * SCROLL PARALLAX (multicapa)
   * ──────────────────────────────────────────── */
  const parallaxOpts = {
    trigger: section,
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  };

  // Background grid se mueve lento
  gsap.to('#hero-bg', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: { ...parallaxOpts, scrub: 2 },
  });

  // Contenido se eleva y se desvanece antes de salir
  gsap.to('#hero-content', {
    yPercent: -20,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '60% top',
      scrub: 1,
    },
  });

  // Canvas particles drift up lento
  gsap.to('#hero-canvas', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { ...parallaxOpts, scrub: 3 },
  });

  // Speed lines se mueven a otra velocidad
  gsap.to('.speed-lines', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: { ...parallaxOpts, scrub: 1 },
  });

  // Scroll cue desaparece rápido
  gsap.to('#scroll-cue', {
    opacity: 0,
    duration: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top+=100 top',
      end: 'top+=200 top',
      scrub: true,
    },
  });

  /* ────────────────────────────────────────────
   * GLITCH PERIÓDICO en el título
   * ──────────────────────────────────────────── */
  const titleEl = document.getElementById('hero-title');
  if (titleEl) {
    const glitch = gsap.timeline({ repeat: -1, repeatDelay: 5, delay: 3, paused: false });
    glitch
      .to(titleEl, { skewX: 12,  duration: 0.04, ease: 'none' })
      .to(titleEl, { skewX: 0,   duration: 0.04 })
      .to(titleEl, { opacity: 0.7, x: 5, duration: 0.04 })
      .to(titleEl, { opacity: 1,   x: 0, duration: 0.04 })
      .to(titleEl, { x: -4, duration: 0.04 })
      .to(titleEl, { x: 0,  duration: 0.04 });
  }

  /* ── Scroll cue pulse ── */
  gsap.to('.scroll-cue-line', {
    scaleY: 0, transformOrigin: 'bottom center',
    repeat: -1, yoyo: true, duration: 0.9, ease: 'power1.inOut',
  });
