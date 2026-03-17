  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import * as THREE from 'three';
  gsap.registerPlugin(ScrollTrigger);

  /* ── 3D Stats background artifact ──────────────────────────── */
  (() => {
    const canvas = document.getElementById('stats-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const w = window.innerWidth;
    const h = 320;
    canvas.width  = w;
    canvas.height = h;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(50, w / h, 0.1, 50);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Gran icosaedro wireframe centrado
    const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // Anillo orbital
    const torusGeo = new THREE.TorusGeometry(3.5, 0.012, 4, 80);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0xe91e8c, transparent: true, opacity: 0.07 });
    const torus    = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2.5;
    scene.add(torus);

    // Partículas de fondo
    const pCount = 120;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 20;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.025, transparent: true, opacity: 0.2 })));

    let visible = false;
    const obs = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    obs.observe(canvas);

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      const t = performance.now() * 0.0004;
      ico.rotation.x   = t * 0.5;
      ico.rotation.y   = t;
      torus.rotation.z = t * 0.7;
      renderer.render(scene, camera);
    }
    animate();

    // Scroll parallax: inclinar con el scroll
    ScrollTrigger.create({
      trigger: '#stats-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        ico.rotation.z = self.progress * Math.PI;
        (icoMat as THREE.MeshBasicMaterial).opacity = 0.04 + self.progress * 0.06;
      },
    });
  })();

  /* ── Newsletter ── */
  const form = document.getElementById('newsletter-form') as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
      alert(`¡Gracias! Te avisaremos en ${email} cuando abran los registros para el PWNEDCR 0x9.`);
      form.reset();
    });
  }

  /* ── Animated counters ── */
  function animateCounter(el: HTMLElement, target: number, duration = 1.5) {
    gsap.to({ val: 0 }, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate() {
        el.textContent = Math.round((this as any).targets()[0].val).toString();
      },
    });
  }

  ScrollTrigger.create({
    trigger: '#stats-section',
    start: 'top 70%',
    once: true,
    onEnter() {
      animateCounter(document.getElementById('cnt-ediciones')!, 8, 1.2);
      animateCounter(document.getElementById('cnt-asistentes')!, 500, 2);
      animateCounter(document.getElementById('cnt-charlas')!, 28, 1.5);
      animateCounter(document.getElementById('cnt-talleres')!, 8, 1.2);
    },
  });

  /* stat cards stagger */
  gsap.from('.stat-card', {
    scrollTrigger: { trigger: '#stats-section', start: 'top 75%' },
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power2.out',
  });

  /* ── Manifesto word reveals ── */
  gsap.utils.toArray<HTMLElement>('.mw').forEach((word) => {
    const speed = parseFloat(word.dataset.speed || '0');
    gsap.from(word, {
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top 80%',
        end: 'center center',
        scrub: 0.5 + speed * 0.3,
      },
      opacity: 0,
      y: 40 + speed * 20,
      ease: 'none',
    });
  });

  gsap.from('.manifesto-sub', {
    scrollTrigger: { trigger: '#manifesto', start: 'top 60%' },
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.3,
  });

  /* big bg text parallax */
  gsap.to('.manifesto-bg-text', {
    scrollTrigger: {
      trigger: '#manifesto',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
    x: '15%',
    ease: 'none',
  });

  /* ── Horizontal talks scroll ── */
  const track = document.getElementById('talks-track');
  if (track) {
    const wrapper = document.getElementById('talks-scroll')!;
    const cards = track.querySelectorAll<HTMLElement>('.talk-card');
    const totalScroll = track.scrollWidth - wrapper.clientWidth;

    gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: '#talks-preview',
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    /* individual card entrance */
    cards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.92,
        duration: 0.5,
        delay: i * 0.04,
        scrollTrigger: {
          trigger: '#talks-preview',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  /* ── Pin CTA section ── */
  gsap.from('#pin-line1', {
    scrollTrigger: { trigger: '#pin-cta', start: 'top 70%' },
    opacity: 0,
    x: -60,
    duration: 0.8,
    ease: 'power3.out',
  });
  gsap.from('#pin-line2', {
    scrollTrigger: { trigger: '#pin-cta', start: 'top 70%' },
    opacity: 0,
    x: 60,
    duration: 0.8,
    delay: 0.1,
    ease: 'power3.out',
  });
  gsap.from('.pin-detail', {
    scrollTrigger: { trigger: '#pin-cta', start: 'top 60%' },
    opacity: 0,
    y: 20,
    stagger: 0.12,
    duration: 0.6,
    delay: 0.3,
  });
  gsap.from('.pin-actions', {
    scrollTrigger: { trigger: '#pin-cta', start: 'top 55%' },
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.6,
  });

  /* ── Sponsors reveal ── */
  gsap.from('.sponsor-tier-block', {
    scrollTrigger: { trigger: '.sponsors-section', start: 'top 80%' },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.6,
  });
