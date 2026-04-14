// ─────────────────────────────────────────────────────────────────
//  global.js  –  scroll management + ONE unified intro timeline
// ─────────────────────────────────────────────────────────────────

/* ── Scroll restoration ──────────────────────────────────────── (need to fix this shits)*/ 
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (window.location.hash) history.replaceState(null, null, " ");
});


/* ── Master intro + homepage entrance ───────────────────────── */
window.addEventListener("load", () => {

  const pillars = gsap.utils.toArray(".pillar");
  const logo    = document.querySelector(".logo-wrap");
  const logoImg = document.querySelector(".logo-img");
  const intro   = document.querySelector(".intro-screen");


  let savedScroll = 0;
  const preventScroll = () => window.scrollTo(0, savedScroll);
  const lockScroll    = () => {
    savedScroll = window.scrollY;
    window.addEventListener("scroll", preventScroll, { passive: false });
  };
  const unlockScroll  = () => {
    window.removeEventListener("scroll", preventScroll);
  };

  lockScroll();

  /* ── SINGLE MASTER TIMELINE ──────────────────────────────── */
  const master = gsap.timeline({ delay: 0.35 });

  // 1 ▸ Pillars drop in  (was 1.2 s)
  master.fromTo(pillars,
    { y: "-100%" },
    { y: "0%", duration: 0.85, stagger: 0.08, ease: "expo.inOut" }
  );

  // 2 ▸ Logo fades + scales in  (was 0.6 + 0.8 s)
  master.to(logoImg, { scale: 1, opacity: 1, duration: 0.55, ease: "power2.out" }, "-=0.3");
  master.to(logo,    { opacity: 1, duration: 0.45 }, "<");

  // 3 ▸ Hold  (was 1 s)
  master.to({}, { duration: 0.75 });

  // 4 ▸ Logo fades out  (was 0.4 s)
  master.to(logo, { opacity: 0, y: -12, duration: 0.28, ease: "power2.in" });

  // 5 ▸ Pillars retract  (was 1.2 s)
  master.to(pillars, {
    y: "-100%",
    duration: 0.85,
    stagger: 0.07,
    ease: "expo.inOut",
  });

  // 6 ▸ Intro screen dissolves  (was 0.4 s)
  master.to(intro, { opacity: 0, duration: 0.25 });
  master.add(() => {
    intro.style.display = "none";
    unlockScroll();
  });

  // 7 ▸ Append home entrance timeline seamlessly
  //     home.js exposes window.buildHomeEntranceTL() which returns
  //     a pre-built (but not yet playing) GSAP timeline.
  if (typeof window.buildHomeEntranceTL === "function") {
    master.add(window.buildHomeEntranceTL(), "+=0");
  }
});


// events page code
 function handleCard(name) {
    const toast = document.createElement('div');
    toast.textContent = `Explore ${name} Class →`;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%) translateY(16px)',
      background: '#e8500a',
      color: '#fff',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '14px',
      fontWeight: '600',
      padding: '12px 28px',
      borderRadius: '100px',
      boxShadow: '0 12px 32px rgba(232,80,10,.5)',
      opacity: '0',
      transition: 'opacity .25s, transform .25s',
      zIndex: '9999',
      pointerEvents: 'none',
      letterSpacing: '.03em'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(16px)';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /* Parallax tilt on wrapper (desktop only) */
  const wrapper = document.querySelector('.wrapper');
  if (window.matchMedia('(min-width:700px)').matches) {
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      wrapper.style.transform = `perspective(1200px) rotateY(${dx * 2.5}deg) rotateX(${-dy * 1.5}deg)`;
    });
    document.addEventListener('mouseleave', () => {
      wrapper.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)';
    });
    wrapper.style.transition = 'transform 0.1s ease';
  }