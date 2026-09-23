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
    initializePuppyWelcomeModal();

  }
);


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


        <div class="puppy-welcome-actions">

          <a
            class="button button-dark"
            href="puppies.html"
          >
            Meet All the Puppies
          </a>


          <a
            class="puppy-welcome-link"
            href="apply.html#contact"
          >
            Ask Clearview a Question

            <span aria-hidden="true">
              →
            </span>
          </a>

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