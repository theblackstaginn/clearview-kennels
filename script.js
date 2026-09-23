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