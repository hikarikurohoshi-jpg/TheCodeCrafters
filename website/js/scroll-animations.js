/* ============================================================
   scroll-animations.js
   Requires GSAP + ScrollTrigger (already loaded in index.html)

   DROP-IN:  Add this script tag AFTER global.js / home.js:
     <script src="website/js/scroll-animations.js"></script>

   What it does
   ─────────────
   • HOME  – exit animation when scrolling away; re-entrance when
             scrolling back (re-runs the typewriter + chrome reveal)
   • ABOUT – staggered reveal for every block
   • OFFICERS – headline + card cascade
   • ACTIVITIES – header + folder cards fan in
   • CONTACT – arc + info panel split entrance
   • FOOTER – fade-up
============================================================ */

(function initScrollAnimations() {

  /* ── Wait for GSAP + DOM ──────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* Give the intro timeline a moment to finish before we
       register ScrollTriggers (intro is ~3.5 s total).       */
    const INIT_DELAY = 4000; // ms — matches master TL duration

    setTimeout(setup, INIT_DELAY);
  });


  /* ══════════════════════════════════════════════════════
     SETUP — called once the intro is done
  ══════════════════════════════════════════════════════ */
  function setup() {

    gsap.registerPlugin(ScrollTrigger);

    /* ── helpers ──────────────────────────────────────── */
    const qs  = (sel, ctx = document) => ctx.querySelector(sel);
    const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ease presets */
    const EASE_OUT  = 'expo.out';
    const EASE_IN   = 'expo.in';
    const DUR_FAST  = 0.55;
    const DUR_MED   = 0.85;
    const DUR_SLOW  = 1.1;

    function createResettingReveal(
      target,
      fromVars,
      toVars,
      trigger,
      start = 'top 88%',
      end = 'bottom 6%',
      scrub = 0.8
    ) {
      if (!target) return;

      const {
        duration: _duration,
        delay: _delay,
        ease: _ease,
        overwrite: _overwrite,
        ...visibleVars
      } = toVars;

      const exitVars = {
        ...fromVars,
        overwrite: 'auto'
      };

      gsap.set(target, fromVars);

      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub
        }
      });

      tl.to(target, {
        ...visibleVars,
        duration: 0.42,
        ease: EASE_OUT
      })
      .to({}, { duration: 0.16 })
      .to(target, {
        ...exitVars,
        duration: 0.42,
        ease: EASE_IN
      });

      ScrollTrigger.create({
        trigger,
        start,
        onEnter() {
          gsap.set(target, fromVars);
        },
        onEnterBack() {
          gsap.set(target, fromVars);
        }
      });
    }


    /* ══════════════════════════════════════════════════
       1.  HOME — EXIT  (scroll away)
           and RE-ENTRANCE (scroll back)
    ══════════════════════════════════════════════════ */
    setupHomeScrollBehavior(qs, qsa, EASE_IN, EASE_OUT, DUR_FAST, DUR_MED);


    /* ══════════════════════════════════════════════════
       2.  ABOUT
    ══════════════════════════════════════════════════ */
    setupAbout(qs, qsa, EASE_OUT, DUR_MED, DUR_SLOW, createResettingReveal);


    /* ══════════════════════════════════════════════════
       3.  OFFICERS
    ══════════════════════════════════════════════════ */
    setupOfficers(qs, qsa, EASE_OUT, DUR_MED, createResettingReveal);


    /* ══════════════════════════════════════════════════
       4.  ACTIVITIES
    ══════════════════════════════════════════════════ */
    setupActivities(qs, qsa, EASE_OUT, DUR_MED, DUR_SLOW, createResettingReveal);


    /* ══════════════════════════════════════════════════
       5.  CONTACT
    ══════════════════════════════════════════════════ */
    setupContact(qs, qsa, EASE_OUT, DUR_MED, createResettingReveal);


    /* ══════════════════════════════════════════════════
       6.  FOOTER
    ══════════════════════════════════════════════════ */
    setupFooter(qs, qsa, EASE_OUT, DUR_MED, createResettingReveal);

  } // end setup()


  /* ══════════════════════════════════════════════════════
     HOME SCROLL BEHAVIOR
  ══════════════════════════════════════════════════════ */
  function setupHomeScrollBehavior(qs, qsa, EASE_IN, EASE_OUT, DUR_FAST, DUR_MED) {

    const homeSection   = qs('.home');
    if (!homeSection) return;

    const headline      = qs('.hero-headline');
    const headlineWrap  = qs('.hero-headline-wrapper');
    const badge         = qs('.badge');
    const subWrapper    = qs('.hero-sub-wrapper');
    const sliderEl      = qs('.slider-entrance');
    const nav           = qs('.nav');

    /* Track whether the home elements are currently visible */
    let homeVisible = true;
    let reEnterTL = null;
    const REENTER_FAST = 0.3;

    /* ── EXIT tween (stored so we can reverse / kill it) ─── */
    function buildExitTween() {
      return gsap.timeline({ paused: true })
        /* Nav slides up */
        .to(nav, { y: -56, opacity: 0, duration: DUR_FAST, ease: EASE_IN }, 0)
        /* Badge collapses up */
        .to(badge, { y: -20, opacity: 0, duration: DUR_FAST, ease: EASE_IN }, 0)
        /* Headline falls and fades */
        .to(headlineWrap, { y: -40, opacity: 0, duration: DUR_MED, ease: EASE_IN }, 0)
        /* Sub fades downward */
        .to(subWrapper, { y: 20, opacity: 0, duration: DUR_FAST, ease: EASE_IN }, 0)
        /* Carousel shrinks away */
        .to(sliderEl, { scale: 0.82, opacity: 0, duration: DUR_FAST, ease: EASE_IN }, 0);
    }

    /* ── RE-ENTRANCE tween ─────────────────────────────── */
    function playReEntrance() {
      if (homeVisible) return;   // already visible — do nothing
      homeVisible = true;

      /* Restore CSS of headline that was replaced by typewriter spans */
      const twChars = qsa('.tw-char', headline);

      /* If typewriter markup still exists, just re-animate the chars */
      if (reEnterTL) {
        reEnterTL.kill();
      }

      reEnterTL = gsap.timeline({
        defaults: { overwrite: 'auto' }
      });

      reEnterTL
        /* reset positions */
        .set(nav,         { y: -56, opacity: 0 })
        .set(badge,       { y: -20, opacity: 0 })
        .set(headlineWrap,{ y: -40, opacity: 0 })
        .set(subWrapper,  { y:  28, opacity: 0 })
        .set(sliderEl,    { scale: 0.82, autoAlpha: 0, y: 20 })

        /* typewriter re-play */
        .set(twChars.length ? twChars : [headline], { opacity: 0 })
        .to(twChars.length ? twChars : [headline], {
          opacity:  1,
          duration: twChars.length ? 0.004 : 0.14,
          stagger:  twChars.length ? { each: 0.008, ease: 'none' } : 0,
          ease:     'none',
        })
        .to({}, { duration: 0.03 })

        /* chrome in */
        .to(nav,          { y: 0, opacity: 1,    duration: REENTER_FAST, ease: EASE_OUT }, '+=0')
        .to(badge,        { y: 0, opacity: 1,    duration: REENTER_FAST, ease: EASE_OUT }, '<')
        .to(headlineWrap, { y: 0, opacity: 1,    duration: REENTER_FAST, ease: EASE_OUT }, '<')
        .to(subWrapper,   { y: 0, opacity: 1,    duration: REENTER_FAST, ease: EASE_OUT }, '<')
        .to(sliderEl,     { scale: 1, autoAlpha: 1, y: 0, duration: REENTER_FAST, ease: EASE_OUT,
            onComplete() {
              const sl = qs('.slider');
              if (sl) sl.classList.add('is-spinning');
            }
          }, '<+=0.01');
    }

    /* ── EXIT on scroll away ──────────────────────────── */
    const HOME_EXIT_PERCENT = 0.3;

    function getHomeExitOffset() {
      return Math.max(homeSection.offsetHeight * HOME_EXIT_PERCENT, 40);
    }

    ScrollTrigger.create({
      trigger: homeSection,
      start: 'top top',
      end: 'max',
      onUpdate(self) {
        const pastThreshold = self.scroll() > getHomeExitOffset();

        if (pastThreshold && homeVisible) {
          homeVisible = false;

          const exitTL = buildExitTween();
          exitTL.play();

          const sliderSpinner = qs('.slider');
          if (sliderSpinner) sliderSpinner.classList.remove('is-spinning');
        } else if (!pastThreshold && !homeVisible) {
          playReEntrance();
        }
      },
      onLeaveBack() {
        if (!homeVisible) {
          playReEntrance();
        }
      }
    });

  }


  /* ══════════════════════════════════════════════════════
     ABOUT
  ══════════════════════════════════════════════════════ */
  function setupAbout(qs, qsa, EASE_OUT, DUR_MED, DUR_SLOW, createResettingReveal) {

    const section = qs('#about');
    if (!section) return;

    const title   = qs('.title-box',    section);
    const divLine = qs('.box-top-line', section);
    const desc    = qs('.box-desc',     section);
    const imgBox  = qs('.box-left',     section);
    const cards   = qsa('.box-mission, .box-vision, .box-value', section);

    /* ── Title & divider ──────────────────────────────── */
    if (title) {
      createResettingReveal(
        title,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: DUR_MED, ease: EASE_OUT },
        title,
        'top 70%'
        // 'bottom 0%'
      );

      if (divLine) {
        createResettingReveal(
          divLine,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: DUR_SLOW, ease: EASE_OUT, delay: 0.08, transformOrigin: 'left center' },
          title,
          'top 70%'
        //   'bottom 0%'
        );
      }
    }

    /* ── Description ──────────────────────────────────── */
    createResettingReveal(
      desc,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: DUR_MED, ease: EASE_OUT, delay: 0.04 },
      desc,
      'top 60%'
    );

    /* ── Left image ──────────────────────────────────── */
    createResettingReveal(
      imgBox,
      { x: -80, opacity: 0, scale: 0.92 },
      { x: 0, opacity: 1, scale: 1, duration: DUR_SLOW, ease: EASE_OUT, delay: 0.06 },
      imgBox,
      'top 60%'
    );

    /* ── Mission / Vision / Values cards ─────────────── */
    cards.forEach((card, i) => {
      createResettingReveal(
        card,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: DUR_MED,
          ease: EASE_OUT,
          delay: i * 0.02,
        },
        card,
        'top 80%'
      );
    });

  }


  /* ══════════════════════════════════════════════════════
     OFFICERS
  ══════════════════════════════════════════════════════ */
  function setupOfficers(qs, qsa, EASE_OUT, DUR_MED, createResettingReveal) {

    const section = qs('#officers');
    if (!section) return;

    /* ── Hero row (headline + president card) ───────── */
    const heroLeft = qs('.hero-left',  section);
    const heroCard = qs('.hero-card',  section);

    createResettingReveal(
      heroLeft,
      { x: -70, opacity: 0 },
      { x: 0, opacity: 1, duration: DUR_MED, ease: EASE_OUT },
      heroLeft,
      'top 85%',
      'bottom 0%'
    );

    createResettingReveal(
      heroCard,
      { x: 70, opacity: 0, scale: 0.94 },
      { x: 0, opacity: 1, scale: 1, duration: DUR_MED, ease: EASE_OUT, delay: 0.1 },
      heroCard,
      'top 85%',
      'bottom 0%'
    );

    /* ── Team cards ──────────────────────────────────── */
    const teamGrids = qsa('.team-grid', section);

    teamGrids.forEach((grid, gi) => {
      const cards = qsa('.card', grid);
      cards.forEach((card, ci) => {
        createResettingReveal(
          card,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: DUR_MED,
            ease: EASE_OUT,
            delay: (gi * 0.08) + (ci * 0.1),
          },
          card,
          'top 90%'
        );
      });
    });

  }


  /* ══════════════════════════════════════════════════════
     ACTIVITIES
  ══════════════════════════════════════════════════════ */
  function setupActivities(qs, qsa, EASE_OUT, DUR_MED, DUR_SLOW, createResettingReveal) {

    const section = qs('#activities');
    if (!section) return;

    const header   = qs('.header',  section);
    const folders  = qsa('.folder', section);

    /* ── Header ──────────────────────────────────────── */
    if (header) {
      const title = qs('.header-title', header);
      const desc  = qs('.header-desc',  header);

      createResettingReveal(
        title,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR_MED, ease: EASE_OUT },
        title
      );

      createResettingReveal(
        desc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: DUR_MED, ease: EASE_OUT, delay: 0.18 },
        desc
      );
    }

    /* ── Folder cards ────────────────────────────────── */
    /* Fan in from bottom with slight rotation per card   */
    const rotations = [-4, 0, 4];

    folders.forEach((folder, i) => {
      const rot = rotations[i] ?? 0;
      createResettingReveal(
        folder,
        { y: 80, opacity: 0, rotation: rot * 1.8, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: DUR_SLOW,
          ease: EASE_OUT,
          delay: i * 0.13,
        },
        folder,
        'top 90%'
      );
    });

  }


  /* ══════════════════════════════════════════════════════
     CONTACT
  ══════════════════════════════════════════════════════ */
  function setupContact(qs, qsa, EASE_OUT, DUR_MED, createResettingReveal) {

    const section = qs('#contact');
    if (!section) return;

    const arcWrap   = qs('.arc-wrap',          section);
    const arcSvg    = qs('.arc-svg',           section);
    const infoPanel = qs('.contact-info-panel', section);

    createResettingReveal(
      arcSvg,
      { x: -180, rotation: -180, opacity: 1, scale: 1, transformOrigin: '50% 50%' },
      { x: 0, rotation: 0, opacity: 1, scale: 1, duration: DUR_MED, ease: EASE_OUT, transformOrigin: '50% 50%' },
      arcWrap || arcSvg,
      'top 42%',
      'bottom 8%',
      0.28
    );

    createResettingReveal(
      arcWrap,
      { x: -80, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: DUR_MED, ease: EASE_OUT },
      arcWrap,
      'top 85%'
    );

    createResettingReveal(
      infoPanel,
      { x: 80, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: DUR_MED, ease: EASE_OUT, delay: 0.12 },
      infoPanel,
      'top 85%'
    );

    /* individual info blocks stagger */
    const blocks = qsa('.contact-info-block', section);
    blocks.forEach((block, i) => {
      createResettingReveal(
        block,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DUR_MED,
          ease: EASE_OUT,
          delay: 0.25 + i * 0.12,
        },
        block,
        'top 90%'
      );
    });

  }


  /* ══════════════════════════════════════════════════════
     FOOTER
  ══════════════════════════════════════════════════════ */
  function setupFooter(qs, qsa) {

    const footer = qs('footer');
    if (!footer) return;

    const contactSection = qs('#contact');
    const brand = qs('.footer-brand', footer);
    const grid = qs('.footer-grid', footer);
    const bottom = qs('.footer-bottom', footer);
    const brandLogo = qs('.footer-brand-logo', footer);
    const brandName = qs('.footer-brand-name', footer);
    const brandSub = qs('.footer-brand-sub', footer);
    const aboutCol = qs('.footer-col-about', footer);
    const navCol = qs('.footer-col-nav', footer);
    const navLinks = qsa('.footer-nav-link', footer);
    const copy = qs('.footer-copy', footer);

    const liftTrigger = contactSection || footer;

    gsap.set(footer, {
      yPercent: 48,
      force3D: true
    });

    gsap.set([brand, grid, bottom], {
      y: 70,
      opacity: 0,
      force3D: true
    });

    gsap.set([brandLogo, brandName, brandSub, aboutCol, navCol, copy], {
      y: 24,
      opacity: 0,
      force3D: true
    });

    gsap.set(navLinks, {
      y: 18,
      opacity: 0,
      force3D: true
    });

    const footerTL = gsap.timeline({
      defaults: {
        ease: 'none',
        overwrite: 'auto'
      },
      scrollTrigger: {
        trigger: liftTrigger,
        start: contactSection ? 'bottom bottom' : 'top bottom',
        end: contactSection ? 'bottom 35%' : 'top 35%',
        scrub: 0.65
      }
    });

    footerTL
      .to(footer, {
        yPercent: 0
      }, 0)
      .to(brand, {
        y: 0,
        opacity: 1
      }, 0.08)
      .to(grid, {
        y: 0,
        opacity: 1
      }, 0.16)
      .to(bottom, {
        y: 0,
        opacity: 1
      }, 0.24)
      .to(brandLogo, {
        y: 0,
        opacity: 1
      }, 0.12)
      .to(brandName, {
        y: 0,
        opacity: 1
      }, 0.16)
      .to(brandSub, {
        y: 0,
        opacity: 1
      }, 0.2)
      .to(aboutCol, {
        y: 0,
        opacity: 1
      }, 0.2)
      .to(navCol, {
        y: 0,
        opacity: 1
      }, 0.24)
      .to(navLinks, {
        y: 0,
        opacity: 1,
        stagger: 0.04
      }, 0.28)
      .to(copy, {
        y: 0,
        opacity: 1
      }, 0.34);

  }


})(); // IIFE end
