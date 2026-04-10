document.addEventListener('DOMContentLoaded', () => {

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-link');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');

  if (!nav || !toggle || !menu || !line1 || !line2) {
    console.error('❌ Missing required navbar DOM elements');
    return;
  }

  const BREAKPOINT = 900;
  let open = false;

  /* ----------------------------------------------------------
     Initial state: nav hidden (home.js will animate it in)
  ---------------------------------------------------------- */
  gsap.set(nav, { y: -80, opacity: 0 });

  gsap.set([line1, line2], {
    clearProps: 'all',
    rotation: 0,
    y: 0,
    backgroundColor: '#1a1a1a'
  });

  gsap.set(menu, {
    clipPath: 'inset(0 0 100% 0)',
    pointerEvents: 'none',
    opacity: 0
  });

  /* ----------------------------------------------------------
     Scroll: subtle background tint on scroll
  ---------------------------------------------------------- */
  function scrollNav() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', scrollNav);
  scrollNav();

  /* ----------------------------------------------------------
     Open / Close mobile menu
  ---------------------------------------------------------- */
  function openNav() {
    open = true;
    menu.classList.add('active');

    gsap.set(menu, { pointerEvents: 'auto', opacity: 1 });

    gsap.timeline()
      .to(line1, { y: 5, rotation: 42, backgroundColor: '#fff', duration: 0.38, ease: 'expo.out' }, 0)
      .to(line2, { y: -5, rotation: -42, backgroundColor: '#fff', duration: 0.38, ease: 'expo.out' }, 0);

    const tl = gsap.timeline();
    tl.to(nav, { opacity: 0, duration: 0.15 });
    tl.fromTo(menu,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.65, ease: 'expo.inOut' }
    );
    tl.fromTo(links,
      { opacity: 0, x: -70 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.09, ease: 'expo.out' },
      '-=0.35'
    );
  }

  function closeNav(instant = false) {
    open = false;

    gsap.timeline()
      .to(line1, { y: 0, rotation: 0, backgroundColor: '#1a1a1a', duration: instant ? 0 : 0.38 }, 0)
      .to(line2, { y: 0, rotation: 0, backgroundColor: '#1a1a1a', duration: instant ? 0 : 0.38 }, 0);

    if (instant) {
      gsap.set(menu, { clipPath: 'inset(0 0 100% 0)', pointerEvents: 'none', opacity: 0 });
      gsap.set(nav, { opacity: 1 });
      menu.classList.remove('active');
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        menu.classList.remove('active');
        gsap.set(menu, { pointerEvents: 'none', opacity: 0 });
      }
    });

    tl.to(links, { opacity: 0, x: -40, duration: 0.22, stagger: 0.04 });
    tl.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.55, ease: 'expo.inOut' });
    tl.to(nav, { opacity: 1, duration: 0.25 });
  }

  /* ----------------------------------------------------------
     Event listeners
  ---------------------------------------------------------- */
  toggle.addEventListener('click', () => open ? closeNav() : openNav());

  links.forEach(link => link.addEventListener('click', () => closeNav()));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closeNav();
  });

  const resize = new ResizeObserver(() => {
    if (window.innerWidth > BREAKPOINT && open) closeNav(true);
  });

  resize.observe(document.body);

});