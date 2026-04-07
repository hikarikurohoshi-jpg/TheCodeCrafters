// Prevent browser from restoring scroll on refresh/back
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Always scroll to the top on load
window.addEventListener("load", function () {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

window.addEventListener("load", () => {

  const pillars = gsap.utils.toArray(".pillar");
  const logo = document.querySelector(".logo-wrap");
  const logoImg = document.querySelector(".logo-img");
  const intro = document.querySelector(".intro-screen");

  // -------------------------------
  // LOCK SCROLL WITHOUT HIDING SCROLLBAR
  // -------------------------------
  let scrollTop = 0;

  function lockScroll() {
    scrollTop = window.scrollY;
    window.addEventListener("scroll", preventScroll, { passive: false });
  }

  function preventScroll(e) {
    window.scrollTo(0, scrollTop); // always force top
  }

  function unlockScroll() {
    window.removeEventListener("scroll", preventScroll);
  }

  lockScroll(); // lock scroll during intro

  // GSAP controls initial state
  gsap.set(pillars, { y: "-100%" });

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      intro.style.display = "none";
      unlockScroll(); // allow normal scrolling

      // Trigger navbar animation
      if (window.playNavbarIntro) {
        window.playNavbarIntro();
      }
    }
  });

  tl.to(pillars, {
    y: "0%",
    duration: 1.2,
    stagger: 0.12,
    ease: "expo.inOut"
  });

  tl.to(logo, { opacity: 1, duration: 0.6 }, "-=0.5");

  tl.fromTo(logoImg,
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
    "-=0.4"
  );

  tl.to({}, { duration: 1 });

  tl.to(logo, { opacity: 0, y: -20, duration: 0.4 });

  tl.to(pillars, {
    y: "-100%",
    duration: 1.2,
    stagger: 0.1,
    ease: "expo.inOut"
  });

  tl.to(intro, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      intro.style.display = "none";
      unlockScroll();
      window.playNavbarIntro();
    }
  });

  // start timeline
  gsap.delayedCall(0.5, () => tl.play());

});