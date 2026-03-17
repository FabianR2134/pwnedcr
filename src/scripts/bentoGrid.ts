  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  /* Staggered reveal on scroll */
  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      opacity: 0, y: 40,
      duration: 0.65,
      delay: (i % 3) * 0.07,
      ease: 'power2.out',
    });
  });

  /* Topic bar animated fill on scroll-enter */
  ScrollTrigger.create({
    trigger: '.topic-bars',
    start: 'top 82%',
    once: true,
    onEnter() {
      document.querySelectorAll<HTMLElement>('.tb-fill').forEach((bar, i) => {
        gsap.from(bar, { scaleX: 0, transformOrigin: 'left', duration: 0.7, delay: i * 0.1, ease: 'power2.out' });
      });
    },
  });

  /* Subtle 3D tilt on hover (mouse tracking per card) */
  document.querySelectorAll<HTMLElement>('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = -dy * 6;
      const tiltY  =  dx * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
