document.addEventListener('DOMContentLoaded', () => {

  console.log('✅ DOM fully loaded');

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-link');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');

  console.log('DEBUG ELEMENTS:', {
    nav,
    toggle,
    menu,
    linksCount: links.length,
    line1,
    line2
  });

  if (!nav || !toggle || !menu || !line1 || !line2) {
    console.error('❌ Missing required DOM elements');
    return;
  }

  const BREAKPOINT = 900;
  let open = false;

  console.log('🔄 Initial state:', {
    width: window.innerWidth,
    scrollY: window.scrollY,
    open
  });

  gsap.set([line1, line2], {
    clearProps: 'all',
    rotation: 0,
    y: 0,
    backgroundColor: '#1a1a1a'
  });

  /* ✅ FIX: force menu closed on reload */
  gsap.set(menu, {
    clipPath: 'inset(0 0 100% 0)',
    pointerEvents: 'none',
    opacity: 0
  });

  console.log('✅ GSAP lines reset complete');

  function scrollNav() {
    const scrolled = window.scrollY > 10;
    nav.classList.toggle('scrolled', scrolled);

    console.log('📌 ScrollNav:', {
      scrollY: window.scrollY,
      scrolled
    });
  }

  window.addEventListener('scroll', scrollNav);
  scrollNav();

  function openNav() {
    console.log('🟢 Opening menu');

    open = true;
    menu.classList.add('active');

    /* ✅ FIX: activate menu interaction */
    gsap.set(menu, {
      pointerEvents: 'auto',
      opacity: 1
    });

    gsap.timeline()
      .to(line1, {
        y: 5,
        rotation: 42,
        backgroundColor: '#fff',
        duration: 0.38,
        ease: 'expo.out'
      }, 0)

      .to(line2, {
        y: -5,
        rotation: -42,
        backgroundColor: '#fff',
        duration: 0.38,
        ease: 'expo.out'
      }, 0);

    const tl = gsap.timeline();

    tl.to(nav, {
      opacity: 0,
      duration: 0.15
    });

    tl.fromTo(menu,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.65,
        ease: 'expo.inOut'
      }
    );

    tl.fromTo(links,
      { opacity: 0, x: -70 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: 'expo.out'
      },
      '-=0.35'
    );
  }

  function closeNav(instant = false) {
    console.log('🔴 Closing menu', { instant });

    open = false;

    gsap.timeline()
      .to(line1, {
        y: 0,
        rotation: 0,
        backgroundColor: '#1a1a1a',
        duration: instant ? 0 : 0.38
      }, 0)

      .to(line2, {
        y: 0,
        rotation: 0,
        backgroundColor: '#1a1a1a',
        duration: instant ? 0 : 0.38
      }, 0);

    if (instant) {
      gsap.set(menu, {
        clipPath: 'inset(0 0 100% 0)',
        pointerEvents: 'none',
        opacity: 0
      });

      gsap.set(nav, {
        opacity: 1
      });

      menu.classList.remove('active');

      console.log('⚡ Instant close applied');
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        menu.classList.remove('active');

        /* ✅ FIX: disable hidden overlay */
        gsap.set(menu, {
          pointerEvents: 'none',
          opacity: 0
        });

        console.log('✅ Menu close animation complete');
      }
    });

    tl.to(links, {
      opacity: 0,
      x: -40,
      duration: 0.22,
      stagger: 0.04
    });

    tl.to(menu, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.55,
      ease: 'expo.inOut'
    });

    tl.to(nav, {
      opacity: 1,
      duration: 0.25
    });
  }

  toggle.addEventListener('click', () => {
    console.log('🖱 Toggle clicked:', { open });
    open ? closeNav() : openNav();
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      console.log('🔗 Link clicked');
      closeNav();
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) {
      console.log('⌨ Escape pressed');
      closeNav();
    }
  });

  const resize = new ResizeObserver(() => {
    console.log('📏 Resize detected:', window.innerWidth);

    if (window.innerWidth > BREAKPOINT && open) {
      console.log('⚠ Breakpoint exceeded → instant close');
      closeNav(true);
    }
  });

  resize.observe(document.body);

 

function playNavbarIntro() {
  const nav = document.querySelector(".nav");

  // Start state like "from" in keyframes
  gsap.set(nav, {
    y: -20,
    opacity: 0
  });

  // Animate to "to" in keyframes
  gsap.to(nav, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power1.out" // smooth fade+slide down, no bounce
  });
}

window.playNavbarIntro = playNavbarIntro;


});