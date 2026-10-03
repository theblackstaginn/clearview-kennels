"use strict";


/* ========================================
   CLEARVIEW KENNELS
   GLOBAL SITE SCRIPT
   ======================================== */


document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeHeader();
    initializeNavigation();
    initializeFooterYear();
    initializeSmoothAnchors();
    initializeTestimonialCarousel();
    initializePuppyWelcomeModal();
    initializeApplicationPuppySelection();

  }
);


/* ========================================
   APPLICATION PUPPY HANDOFF
   ======================================== */


function initializeApplicationPuppySelection() {

  const form =
    document.getElementById(
      "puppyApplication"
    );


  if (!form) {
    return;
  }


  const puppyId =
    new URLSearchParams(
      window.location.search
    ).get(
      "puppy"
    );


  if (!puppyId) {
    return;
  }


  if (
    typeof puppies === "undefined" ||
    !Array.isArray(puppies)
  ) {
    return;
  }


  const puppy =
    puppies.find(
      (item) =>
        item &&
        item.id === puppyId
    );


  if (!puppy) {
    return;
  }


  const selectedPuppy =
    document.getElementById(
      "selectedPuppy"
    );

  const selectedPuppyNote =
    document.getElementById(
      "selectedPuppyNote"
    );

  const selectedPuppyName =
    document.getElementById(
      "selectedPuppyName"
    );

  const breedInterest =
    document.getElementById(
      "breedInterest"
    );

  const puppyInterest =
    document.getElementById(
      "puppyInterest"
    );


  if (selectedPuppy) {
    selectedPuppy.value =
      puppy.id;
  }


  if (selectedPuppyName) {
    selectedPuppyName.textContent =
      puppy.name;
  }


  if (selectedPuppyNote) {
    selectedPuppyNote.hidden =
      false;
  }


  if (
    breedInterest &&
    puppy.breedKey
  ) {
    breedInterest.value =
      puppy.breedKey;
  }


  if (puppyInterest) {
    puppyInterest.value =
      puppy.name;
  }

}


/* ========================================
   HEADER
   ======================================== */


function initializeHeader() {

  const header =
    document.getElementById(
      "siteHeader"
    );


  if (!header) {
    return;
  }


  /*
    Interior pages already use the
    light header treatment.

    The homepage begins transparent
    over the hero and changes once
    the visitor starts scrolling.
  */

  const interiorPage =
    document.body.classList.contains(
      "interior-page"
    );


  function updateHeader() {

    if (interiorPage) {

      header.classList.add(
        "scrolled"
      );

      return;
    }


    const shouldUseLightHeader =
      window.scrollY > 40;


    header.classList.toggle(
      "scrolled",
      shouldUseLightHeader
    );

  }


  updateHeader();


  window.addEventListener(
    "scroll",
    updateHeader,
    {
      passive: true
    }
  );

}


/* ========================================
   MOBILE NAVIGATION
   ======================================== */


function initializeNavigation() {

  const toggle =
    document.getElementById(
      "menuToggle"
    );


  const nav =
    document.getElementById(
      "siteNav"
    );


  if (
    !toggle ||
    !nav
  ) {
    return;
  }


  function openNavigation() {

    nav.classList.add(
      "open"
    );


    document.body.classList.add(
      "nav-open"
    );


    toggle.setAttribute(
      "aria-expanded",
      "true"
    );


    toggle.setAttribute(
      "aria-label",
      "Close navigation"
    );

  }


  function closeNavigation() {

    nav.classList.remove(
      "open"
    );


    document.body.classList.remove(
      "nav-open"
    );


    toggle.setAttribute(
      "aria-expanded",
      "false"
    );


    toggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

  }


  function toggleNavigation() {

    const open =
      nav.classList.contains(
        "open"
      );


    if (open) {

      closeNavigation();

    } else {

      openNavigation();

    }

  }


  toggle.addEventListener(
    "click",
    toggleNavigation
  );


  /*
    Close the mobile menu after
    choosing a navigation link.
  */

  nav
    .querySelectorAll("a")
    .forEach(
      link => {

        link.addEventListener(
          "click",
          closeNavigation
        );

      }
    );


  /*
    Escape key support.
  */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        nav.classList.contains(
          "open"
        )
      ) {

        closeNavigation();

        toggle.focus();

      }

    }
  );


  /*
    If the user rotates their phone
    or expands the browser into the
    desktop layout, don't leave the
    mobile nav state hanging around.
  */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 760 &&
        nav.classList.contains(
          "open"
        )
      ) {

        closeNavigation();

      }

    }
  );

}


/* ========================================
   FOOTER YEAR
   ======================================== */


function initializeFooterYear() {

  const year =
    document.getElementById(
      "year"
    );


  if (!year) {
    return;
  }


  year.textContent =
    new Date()
      .getFullYear();

}


/* ========================================
   SAME-PAGE ANCHORS
   ======================================== */


function initializeSmoothAnchors() {

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            const href =
              link.getAttribute(
                "href"
              );


            if (
              !href ||
              href === "#"
            ) {
              return;
            }


            const target =
              document.querySelector(
                href
              );


            if (!target) {
              return;
            }


            event.preventDefault();


            target.scrollIntoView({
              behavior:
                reducedMotion.matches
                  ? "auto"
                  : "smooth",

              block: "start"
            });

          }
        );

      }
    );

}


/* ========================================
   TESTIMONIAL CAROUSEL
   ======================================== */


function initializeTestimonialCarousel() {

  const track =
    document.getElementById(
      "testimonialsTrack"
    );


  const previousButton =
    document.getElementById(
      "testimonialPrev"
    );


  const nextButton =
    document.getElementById(
      "testimonialNext"
    );


  if (
    !track ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /*
    Measure one card plus the space
    between cards so each button press
    advances exactly one testimonial.
  */

  function getScrollAmount() {

    const card =
      track.querySelector(
        ".testimonial-card"
      );


    if (!card) {
      return track.clientWidth;
    }


    const styles =
      window.getComputedStyle(
        track
      );


    const gap =
      parseFloat(
        styles.columnGap ||
        styles.gap ||
        "0"
      ) || 0;


    return (
      card.getBoundingClientRect().width +
      gap
    );

  }


  /*
    Scroll one testimonial backward.
  */

  previousButton.addEventListener(
    "click",
    () => {

      track.scrollBy({
        left: -getScrollAmount(),

        behavior:
          reducedMotion.matches
            ? "auto"
            : "smooth"
      });

    }
  );


  /*
    Scroll one testimonial forward.
  */

  nextButton.addEventListener(
    "click",
    () => {

      track.scrollBy({
        left: getScrollAmount(),

        behavior:
          reducedMotion.matches
            ? "auto"
            : "smooth"
      });

    }
  );


  /*
    Disable the arrows when the carousel
    reaches either end.

    This also updates after manual
    trackpad/touch scrolling.
  */

  function updateButtons() {

    const maxScroll =
      track.scrollWidth -
      track.clientWidth;


    const currentScroll =
      track.scrollLeft;


    const atBeginning =
      currentScroll <= 2;


    const atEnd =
      currentScroll >=
      maxScroll - 2;


    previousButton.disabled =
      atBeginning;


    nextButton.disabled =
      atEnd;


    previousButton.setAttribute(
      "aria-disabled",
      String(atBeginning)
    );


    nextButton.setAttribute(
      "aria-disabled",
      String(atEnd)
    );

  }


  track.addEventListener(
    "scroll",
    updateButtons,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    updateButtons
  );


  updateButtons();

}


/* ========================================
   PUPPY WELCOME MODAL
   ======================================== */


function initializePuppyWelcomeModal() {

  /*
    The featured puppy section only exists
    on the homepage, so interior pages
    automatically skip this feature.
  */

  const puppySection =
    document.querySelector(
      ".featured-puppies-section"
    );


  if (!puppySection) {
    return;
  }


  /*
    Don't repeatedly interrupt somebody
    during the same browsing session.

    sessionStorage resets naturally when
    the browser session ends.
  */

  const storageKey =
    "clearview-puppy-welcome-seen";


  try {

    if (
      sessionStorage.getItem(
        storageKey
      ) === "true"
    ) {
      return;
    }

  } catch (error) {

    /*
      Storage may be unavailable in some
      privacy modes. The modal can still
      work without persistence.
    */

  }


  /* =====================================
     BUILD MODAL
     ===================================== */


  const modal =
    document.createElement(
      "div"
    );


  modal.className =
    "puppy-welcome-modal";


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  modal.innerHTML = `

    <div
      class="puppy-welcome-backdrop"
      data-puppy-modal-close
    ></div>


    <div
      class="puppy-welcome-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="puppyWelcomeTitle"
      aria-describedby="puppyWelcomeCopy"
    >

      <button
        class="puppy-welcome-close"
        type="button"
        aria-label="Close"
        data-puppy-modal-close
      >
        <span aria-hidden="true">
          ×
        </span>
      </button>


      <div class="puppy-welcome-content">

        <p class="puppy-welcome-eyebrow">
          A Note From Clearview
        </p>


        <h2 id="puppyWelcomeTitle">
          The right puppy is worth
          taking your time for.
        </h2>


        <div
          class="puppy-welcome-copy"
          id="puppyWelcomeCopy"
        >

          <p>
            Every puppy has a personality
            of their own, and every family
            is looking for something a
            little different.
          </p>


          <p>
            Take a look at the puppies
            currently available. When one
            catches your attention, you can
            learn more about them or tell
            us a little about your family.
          </p>

        </div>


        <p class="puppy-welcome-note">
          No pressure. No rush.
          Just find the puppy who feels
          right for your home.
        </p>

      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  const dialog =
    modal.querySelector(
      ".puppy-welcome-dialog"
    );


  const closeButton =
    modal.querySelector(
      ".puppy-welcome-close"
    );


  const closeControls =
    modal.querySelectorAll(
      "[data-puppy-modal-close]"
    );


  let opened = false;

  let previouslyFocused = null;


  /* =====================================
     MARK AS SEEN
     ===================================== */


  function markModalSeen() {

    try {

      sessionStorage.setItem(
        storageKey,
        "true"
      );

    } catch (error) {

      /*
        Modal still functions when
        sessionStorage is unavailable.
      */

    }

  }


  /* =====================================
     OPEN
     ===================================== */


  function openModal() {

    if (opened) {
      return;
    }


    opened = true;


    previouslyFocused =
      document.activeElement;


    modal.classList.add(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "puppy-modal-open"
    );


    markModalSeen();


    window.setTimeout(
      () => {

        if (closeButton) {

          closeButton.focus();

        }

      },
      100
    );

  }


  /* =====================================
     CLOSE
     ===================================== */


  function closeModal() {

    if (!opened) {
      return;
    }


    opened = false;


    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "puppy-modal-open"
    );


    if (
      previouslyFocused &&
      typeof previouslyFocused.focus ===
        "function"
    ) {

      previouslyFocused.focus();

    }

  }


  /* =====================================
     CLOSE CONTROLS
     ===================================== */


  closeControls.forEach(
    control => {

      control.addEventListener(
        "click",
        closeModal
      );

    }
  );


  /* =====================================
     KEYBOARD SUPPORT
     ===================================== */


  document.addEventListener(
    "keydown",
    event => {

      if (!opened) {
        return;
      }


      if (
        event.key === "Escape"
      ) {

        event.preventDefault();

        closeModal();

        return;

      }


      /*
        Keep keyboard focus inside
        the modal while it is open.
      */

      if (
        event.key !== "Tab" ||
        !dialog
      ) {
        return;
      }


      const focusable =
        Array.from(
          dialog.querySelectorAll(
            [
              "a[href]",
              "button:not([disabled])",
              '[tabindex]:not([tabindex="-1"])'
            ].join(",")
          )
        );


      if (!focusable.length) {
        return;
      }


      const first =
        focusable[0];


      const last =
        focusable[
          focusable.length - 1
        ];


      if (
        event.shiftKey &&
        document.activeElement === first
      ) {

        event.preventDefault();

        last.focus();

      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {

        event.preventDefault();

        first.focus();

      }

    }
  );


  /* =====================================
     OPEN WHEN PUPPIES ENTER VIEW
     ===================================== */


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          const entry =
            entries[0];


          if (
            !entry ||
            !entry.isIntersecting
          ) {
            return;
          }


          observer.disconnect();


          /*
            Tiny delay lets the visitor
            actually see the puppies before
            the card appears.
          */

          window.setTimeout(
            openModal,
            500
          );

        },
        {
          threshold: 0.2
        }
      );


    observer.observe(
      puppySection
    );

  } else {

    /*
      Older-browser fallback.
    */

    let fallbackTriggered =
      false;


    function checkPuppySection() {

      if (fallbackTriggered) {
        return;
      }


      const rect =
        puppySection
          .getBoundingClientRect();


      const visible =
        rect.top <
          window.innerHeight * 0.8 &&
        rect.bottom > 0;


      if (!visible) {
        return;
      }


      fallbackTriggered =
        true;


      window.removeEventListener(
        "scroll",
        checkPuppySection
      );


      openModal();

    }


    window.addEventListener(
      "scroll",
      checkPuppySection,
      {
        passive: true
      }
    );


    checkPuppySection();

  }

}

/* =========================================
   PWA + PULL TO REFRESH
   ========================================= */

(function initClearviewPwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .catch(() => {
          /* The site still works normally if registration fails. */
        });
    });
  }

  const touchCapable =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (!touchCapable) {
    return;
  }

  document.documentElement.style.overscrollBehaviorY =
    "contain";

  const style =
    document.createElement("style");

  style.textContent = `
    #clearview-pull-refresh {
      position: fixed;
      z-index: 2000;
      top: max(12px, env(safe-area-inset-top));
      left: 50%;
      display: inline-flex;
      min-height: 42px;
      padding: 9px 15px;
      align-items: center;
      gap: 8px;
      color: #354735;
      background: rgba(250, 247, 240, .96);
      border: 1px solid rgba(53, 71, 53, .18);
      border-radius: 999px;
      box-shadow: 0 8px 22px rgba(31, 36, 26, .16);
      font: 700 12px/1.2 "DM Sans", system-ui, sans-serif;
      letter-spacing: .02em;
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, -70px);
      transition:
        transform .18s ease,
        opacity .18s ease;
    }

    #clearview-pull-refresh .pull-refresh-icon {
      display: inline-block;
      font-size: 18px;
      line-height: 1;
      transform: rotate(0deg);
    }

    #clearview-pull-refresh.refreshing .pull-refresh-icon {
      animation:
        clearview-refresh-spin .7s linear infinite;
    }

    @keyframes clearview-refresh-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #clearview-pull-refresh {
        transition: none;
      }

      #clearview-pull-refresh.refreshing .pull-refresh-icon {
        animation: none;
      }
    }
  `;

  document.head.appendChild(style);

  const indicator =
    document.createElement("div");

  indicator.id =
    "clearview-pull-refresh";

  indicator.setAttribute(
    "role",
    "status"
  );

  indicator.setAttribute(
    "aria-live",
    "polite"
  );

  indicator.innerHTML = `
    <span
      class="pull-refresh-icon"
      aria-hidden="true"
    >&#8635;</span>
    <span class="pull-refresh-label">
      Pull to refresh
    </span>
  `;

  document.body.appendChild(indicator);

  const label =
    indicator.querySelector(
      ".pull-refresh-label"
    );

  const threshold = 74;
  const maxTravel = 86;

  let tracking = false;
  let pulling = false;
  let startX = 0;
  let startY = 0;
  let currentPull = 0;

  function resetIndicator() {
    indicator.classList.remove(
      "refreshing"
    );

    indicator.style.opacity = "0";
    indicator.style.transform =
      "translate(-50%, -70px)";

    label.textContent =
      "Pull to refresh";

    tracking = false;
    pulling = false;
    currentPull = 0;
  }

  document.addEventListener(
    "touchstart",
    event => {
      if (
        window.scrollY > 0 ||
        event.touches.length !== 1
      ) {
        tracking = false;
        return;
      }

      if (
        event.target.closest(
          "input, textarea, select, button, a, [contenteditable='true']"
        )
      ) {
        tracking = false;
        return;
      }

      const touch =
        event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;

      tracking = true;
      pulling = false;
      currentPull = 0;
    },
    {
      passive: true
    }
  );

  document.addEventListener(
    "touchmove",
    event => {
      if (
        !tracking ||
        event.touches.length !== 1
      ) {
        return;
      }

      const touch =
        event.touches[0];

      const deltaX =
        touch.clientX - startX;

      const deltaY =
        touch.clientY - startY;

      if (
        deltaY <= 0 ||
        Math.abs(deltaX) >
          Math.abs(deltaY)
      ) {
        if (pulling) {
          resetIndicator();
        }

        return;
      }

      if (window.scrollY > 0) {
        resetIndicator();
        return;
      }

      pulling = true;
      currentPull = deltaY;

      event.preventDefault();

      const travel =
        Math.min(
          maxTravel,
          deltaY * .48
        );

      const progress =
        Math.min(
          1,
          deltaY / threshold
        );

      indicator.style.opacity =
        String(
          .35 + progress * .65
        );

      indicator.style.transform =
        `translate(-50%, ${travel - 58}px)`;

      label.textContent =
        deltaY >= threshold
          ? "Release to refresh"
          : "Pull to refresh";
    },
    {
      passive: false
    }
  );

  function finishPull() {
    if (
      !tracking ||
      !pulling
    ) {
      resetIndicator();
      return;
    }

    if (
      currentPull >= threshold
    ) {
      tracking = false;
      pulling = false;

      indicator.classList.add(
        "refreshing"
      );

      indicator.style.opacity =
        "1";

      indicator.style.transform =
        "translate(-50%, 0)";

      label.textContent =
        "Refreshing...";

      window.setTimeout(
        () => {
          window.location.reload();
        },
        180
      );

      return;
    }

    resetIndicator();
  }

  document.addEventListener(
    "touchend",
    finishPull,
    {
      passive: true
    }
  );

  document.addEventListener(
    "touchcancel",
    resetIndicator,
    {
      passive: true
    }
  );
})();


/* =========================================
   IDIOT-PROOF APP INSTALL
   ========================================= */

(function initClearviewInstallExperience() {
  const footerNav =
    document.querySelector(".footer-nav");

  if (!footerNav) {
    return;
  }

  const launchedStandalone =
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    window.navigator.standalone === true;

  if (launchedStandalone) {
    return;
  }

  const userAgent =
    navigator.userAgent || "";

  const isIOS =
    /iPad|iPhone|iPod/i.test(
      userAgent
    );

  const isAndroid =
    /Android/i.test(
      userAgent
    );

  const touchCapable =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  const mobileViewport =
    window.matchMedia(
      "(max-width: 900px)"
    ).matches;

  const isMobile =
    isIOS ||
    isAndroid ||
    (
      touchCapable &&
      mobileViewport
    );

  const installButton =
    document.createElement("button");

  installButton.type =
    "button";

  installButton.className =
    "footer-install-button";

  /*
    On Android, only show the install control once
    Chrome has confirmed that the native install
    prompt is ready. That means every visible
    Android install button is a true one-tap path
    into the system install dialog.
  */
  installButton.hidden =
    isAndroid
      ? true
      : !isMobile;

  installButton.textContent =
    "Install Clearview App";

  footerNav.appendChild(
    installButton
  );

  let deferredPrompt = null;
  let banner = null;

  const dismissedKey =
    "clearview-install-banner-dismissed-at";

  const dismissForMs =
    2 * 24 * 60 * 60 * 1000;

  function wasRecentlyDismissed() {
    try {
      const dismissedAt =
        Number(
          localStorage.getItem(
            dismissedKey
          )
        );

      return (
        dismissedAt > 0 &&
        Date.now() - dismissedAt <
          dismissForMs
      );
    } catch (error) {
      return false;
    }
  }

  function rememberDismissal() {
    try {
      localStorage.setItem(
        dismissedKey,
        String(Date.now())
      );
    } catch (error) {
      /* Storage can be unavailable in private modes. */
    }
  }

  function hideInstallButton() {
    installButton.hidden = true;
  }

  function removeBanner() {
    if (!banner) {
      return;
    }

    banner.classList.remove(
      "is-visible"
    );

    const oldBanner =
      banner;

    banner = null;

    window.setTimeout(
      () => {
        oldBanner.remove();
      },
      220
    );
  }

  function openInstructions(
    returnFocusTo
  ) {
    const existing =
      document.querySelector(
        ".clearview-install-overlay"
      );

    if (existing) {
      existing.remove();
    }

    const overlay =
      document.createElement("div");

    overlay.className =
      "clearview-install-overlay";

    const dialog =
      document.createElement("div");

    dialog.className =
      "clearview-install-dialog";

    dialog.setAttribute(
      "role",
      "dialog"
    );

    dialog.setAttribute(
      "aria-modal",
      "true"
    );

    dialog.setAttribute(
      "aria-labelledby",
      "clearviewInstallTitle"
    );

    const heading =
      document.createElement("h2");

    heading.id =
      "clearviewInstallTitle";

    heading.textContent =
      "Add Clearview to your home screen";

    const intro =
      document.createElement("p");

    intro.className =
      "clearview-install-intro";

    const steps =
      document.createElement("ol");

    steps.className =
      "clearview-install-steps";

    if (isIOS) {
      intro.textContent =
        "Three quick taps on iPhone or iPad:";

      steps.innerHTML = `
        <li>
          Tap the <strong>Share</strong>
          button at the bottom of Safari.
        </li>
        <li>
          Tap <strong>Add to Home Screen</strong>.
        </li>
        <li>
          Tap <strong>Add</strong>.
        </li>
      `;
    } else if (isAndroid) {
      intro.textContent =
        "If the install box did not appear, do this in Chrome:";

      steps.innerHTML = `
        <li>
          Tap the <strong>⋮</strong>
          menu in the upper-right.
        </li>
        <li>
          Tap <strong>Install app</strong>
          or <strong>Add to Home screen</strong>.
        </li>
        <li>
          Tap <strong>Install</strong>.
        </li>
      `;
    } else {
      intro.textContent =
        "Save Clearview like an app:";

      steps.innerHTML = `
        <li>
          Open your browser menu.
        </li>
        <li>
          Choose <strong>Install app</strong>
          or <strong>Add to Home screen</strong>.
        </li>
      `;
    }

    const note =
      document.createElement("p");

    note.className =
      "clearview-install-note";

    note.textContent =
      "After that, just tap the Clearview icon on your home screen.";

    const closeButton =
      document.createElement("button");

    closeButton.type =
      "button";

    closeButton.className =
      "clearview-install-close";

    closeButton.textContent =
      "Got it";

    dialog.append(
      heading,
      intro,
      steps,
      note,
      closeButton
    );

    overlay.appendChild(
      dialog
    );

    document.body.appendChild(
      overlay
    );

    const close = () => {
      overlay.remove();

      if (
        returnFocusTo &&
        document.body.contains(
          returnFocusTo
        )
      ) {
        returnFocusTo.focus();
      }
    };

    closeButton.addEventListener(
      "click",
      close
    );

    overlay.addEventListener(
      "click",
      event => {
        if (event.target === overlay) {
          close();
        }
      }
    );

    document.addEventListener(
      "keydown",
      function onInstallKeydown(event) {
        if (
          event.key !== "Escape" ||
          !document.body.contains(
            overlay
          )
        ) {
          return;
        }

        document.removeEventListener(
          "keydown",
          onInstallKeydown
        );

        close();
      }
    );

    closeButton.focus();
  }

  async function requestInstall(
    returnFocusTo
  ) {
    if (!deferredPrompt) {
      openInstructions(
        returnFocusTo
      );
      return;
    }

    try {
      deferredPrompt.prompt();

      const choice =
        await deferredPrompt.userChoice;

      if (
        choice &&
        choice.outcome === "accepted"
      ) {
        hideInstallButton();
        removeBanner();
      }
    } catch (error) {
      openInstructions(
        returnFocusTo
      );
    } finally {
      deferredPrompt = null;
    }
  }

  function createBanner() {
    if (
      !isMobile ||
      banner ||
      wasRecentlyDismissed()
    ) {
      return;
    }

    banner =
      document.createElement("aside");

    banner.className =
      "clearview-install-banner";

    banner.setAttribute(
      "aria-label",
      "Install Clearview Kennels app"
    );

    banner.innerHTML = `
      <button
        type="button"
        class="clearview-install-banner-dismiss"
        aria-label="Dismiss app install suggestion"
      >×</button>

      <div class="clearview-install-banner-copy">
        <strong>
          Keep Clearview handy
        </strong>

        <span>
          Add Clearview Kennels to your home screen for quick access to puppies and updates.
        </span>
      </div>

      <button
        type="button"
        class="clearview-install-banner-action"
      >
        Install Clearview App
      </button>
    `;

    document.body.appendChild(
      banner
    );

    const dismissButton =
      banner.querySelector(
        ".clearview-install-banner-dismiss"
      );

    const actionButton =
      banner.querySelector(
        ".clearview-install-banner-action"
      );

    dismissButton.addEventListener(
      "click",
      () => {
        rememberDismissal();
        removeBanner();
      }
    );

    actionButton.addEventListener(
      "click",
      () => {
        requestInstall(
          actionButton
        );
      }
    );

    requestAnimationFrame(
      () => {
        if (banner) {
          banner.classList.add(
            "is-visible"
          );
        }
      }
    );
  }

  window.addEventListener(
    "beforeinstallprompt",
    event => {
      event.preventDefault();
      deferredPrompt = event;

      if (isMobile) {
        installButton.hidden = false;
      }

      /*
        Android gets the simple banner only after
        the native prompt has been captured. If the
        banner is visible, tapping its install button
        should open Android's install dialog directly.
      */
      if (
        isAndroid &&
        !wasRecentlyDismissed()
      ) {
        window.setTimeout(
          createBanner,
          700
        );
      }
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      deferredPrompt = null;
      hideInstallButton();
      removeBanner();

      const openDialog =
        document.querySelector(
          ".clearview-install-overlay"
        );

      if (openDialog) {
        openDialog.remove();
      }
    }
  );

  installButton.addEventListener(
    "click",
    () => {
      requestInstall(
        installButton
      );
    }
  );

  /*
    iPhone/iPad cannot expose a programmable native
    install prompt, so they still get the explanatory
    banner after a few seconds. Android waits for
    beforeinstallprompt above so its visible button
    always has the native prompt ready.
  */
  if (
    isMobile &&
    !isAndroid
  ) {
    window.setTimeout(
      createBanner,
      5000
    );
  }
})();
