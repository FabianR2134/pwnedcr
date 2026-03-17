  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.footer-bg-text', {
    scrollTrigger: {
      trigger: '.site-footer',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1.5,
    },
    x: '-8%',
    ease: 'none',
  });
