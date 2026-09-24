"use strict";


/* ========================================
   CLEARVIEW KENNELS
   PUPPY SYSTEM

   Requires:
   data/puppies.js

   Handles:
   - Featured puppies
   - Full puppy inventory
   - Breed filtering
   - Puppy detail pages
   - Puppy galleries
   - Parent profiles / photos
   - Status labels
   - Dates / prices
   - Dynamic puppy SEO
   - Social sharing metadata
   - Puppy structured data
   - Graceful handling of incomplete listings
   ======================================== */


/* ========================================
   SITE CONSTANTS
   ======================================== */


const CLEARVIEW_SITE_URL =
  "https://clearviewkennels.com";


const CLEARVIEW_PUPPIES_URL =
  `${CLEARVIEW_SITE_URL}/puppies.html`;


/* ========================================
   UTILITIES
   ======================================== */


function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function hasValue(value) {

  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );

}


function formatPrice(value) {

  /*
    Important:
    Number(null) === 0 in JavaScript.

    Check for an actual value first so an
    unknown price never appears as $0.
  */

  if (!hasValue(value)) {
    return "";
  }


  const amount =
    Number(value);


  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return "";
  }


  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }
  ).format(amount);

}


function formatDate(value) {

  if (!hasValue(value)) {
    return "";
  }


  /*
    Adding a local midday time prevents
    YYYY-MM-DD dates from shifting backward
    because of timezone conversion.
  */

  const date =
    new Date(
      `${value}T12:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  ).format(date);

}


function statusLabel(status) {

  switch (status) {

    case "available":
      return "Available";

    case "reserved":
      return "Reserved";

    case "adopted":
      return "Found a Family";

    default:
      return "";

  }

}


function getPuppies() {

  if (
    typeof puppies === "undefined" ||
    !Array.isArray(puppies)
  ) {
    return [];
  }

  return puppies;

}


/* ========================================
   META HELPERS
   ======================================== */


function setMetaContent(
  selector,
  content
) {

  if (!hasValue(content)) {
    return;
  }


  const element =
    document.querySelector(
      selector
    );


  if (!element) {
    return;
  }


  element.setAttribute(
    "content",
    content
  );

}


function setLinkHref(
  selector,
  href
) {

  if (!hasValue(href)) {
    return;
  }


  const element =
    document.querySelector(
      selector
    );


  if (!element) {
    return;
  }


  element.setAttribute(
    "href",
    href
  );

}


/* ========================================
   PUPPY URL
   ======================================== */


function puppyDetailUrl(puppy) {

  return (
    "puppy.html?id=" +
    encodeURIComponent(
      puppy.id
    )
  );

}


function puppyCanonicalUrl(puppy) {

  return (
    `${CLEARVIEW_SITE_URL}/puppy.html?id=` +
    encodeURIComponent(
      puppy.id
    )
  );

}


/* ========================================
   PHOTO ALT TEXT
   ======================================== */


function puppyPhotoAlt(puppy) {

  const parts = [];


  if (hasValue(puppy.name)) {
    parts.push(puppy.name);
  }


  if (hasValue(puppy.breed)) {
    parts.push(puppy.breed);
  }


  if (!parts.length) {
    return "Clearview Kennels puppy";
  }


  return parts.join(", ");

}


/* ========================================
   ABSOLUTE IMAGE URL
   ======================================== */


function absoluteImageUrl(
  image
) {

  if (!hasValue(image)) {
    return "";
  }


  try {

    return new URL(
      image,
      `${CLEARVIEW_SITE_URL}/`
    ).href;

  } catch (error) {

    return "";

  }

}


/* ========================================
   PRIMARY PUPPY IMAGE
   ======================================== */


function getPrimaryPuppyImage(
  puppy
) {

  if (
    !Array.isArray(
      puppy.images
    )
  ) {
    return "";
  }


  return (
    puppy.images.find(
      image =>
        hasValue(image)
    ) || ""
  );

}


/* ========================================
   DYNAMIC SEO DESCRIPTION
   ======================================== */


function puppySeoDescription(
  puppy
) {

  const pieces = [];


  if (hasValue(puppy.sex)) {

    pieces.push(
      puppy.sex.toLowerCase()
    );

  }


  if (hasValue(puppy.color)) {

    pieces.push(
      puppy.color
    );

  }


  if (hasValue(puppy.breed)) {

    pieces.push(
      puppy.breed
    );

  }


  let puppyDescription =
    pieces.join(" ");


  if (puppyDescription) {

    puppyDescription +=
      " puppy";

  } else {

    puppyDescription =
      "puppy";

  }


  if (
    puppy.status === "available"
  ) {

    return (
      `Meet ${puppy.name}, an available ` +
      `${puppyDescription} from Clearview Kennels ` +
      `in Marshfield, Missouri, serving families ` +
      `throughout the contiguous United States.`
    );

  }


  return (
    `Meet ${puppy.name}, a ${puppyDescription} ` +
    `from Clearview Kennels in Marshfield, Missouri.`
  );

}


/* ========================================
   DYNAMIC SEO TITLE
   ======================================== */


function puppySeoTitle(
  puppy
) {

  const parts = [];


  if (hasValue(puppy.name)) {

    parts.push(
      puppy.name
    );

  }


  if (hasValue(puppy.breed)) {

    parts.push(
      `${puppy.breed} Puppy`
    );

  } else {

    parts.push(
      "Puppy"
    );

  }


  parts.push(
    "Clearview Kennels"
  );


  return parts.join(
    " | "
  );

}


/* ========================================
   DYNAMIC PUPPY STRUCTURED DATA
   ======================================== */


function puppyStructuredData(
  puppy
) {

  const canonical =
    puppyCanonicalUrl(
      puppy
    );


  const description =
    puppySeoDescription(
      puppy
    );


  const image =
    absoluteImageUrl(
      getPrimaryPuppyImage(
        puppy
      )
    );


  const puppyEntity = {
    "@type": "Thing",
    "@id": `${canonical}#puppy`,
    "name": puppy.name,
    "description": description,
    "url": canonical
  };


  if (image) {

    puppyEntity.image =
      image;

  }


  if (hasValue(puppy.breed)) {

    puppyEntity.additionalType =
      "https://schema.org/Animal";

  }


  const webPage = {
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    "url": canonical,
    "name": puppySeoTitle(
      puppy
    ),
    "description": description,
    "isPartOf": {
      "@id":
        `${CLEARVIEW_SITE_URL}/#website`
    },
    "about": [
      {
        "@id":
          `${CLEARVIEW_SITE_URL}/#organization`
      },
      {
        "@id":
          `${canonical}#puppy`
      }
    ],
    "breadcrumb": {
      "@id":
        `${canonical}#breadcrumb`
    },
    "mainEntity": {
      "@id":
        `${canonical}#puppy`
    }
  };


  if (image) {

    webPage.primaryImageOfPage = {
      "@type": "ImageObject",
      "url": image
    };

  }


  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id":
      `${canonical}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item":
          `${CLEARVIEW_SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Available Puppies",
        "item":
          CLEARVIEW_PUPPIES_URL
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": puppy.name,
        "item":
          canonical
      }
    ]
  };


  return {
    "@context":
      "https://schema.org",

    "@graph": [
      webPage,
      puppyEntity,
      breadcrumb
    ]
  };

}


/* ========================================
   APPLY DYNAMIC PUPPY SEO
   ======================================== */


function applyPuppySeo(
  puppy
) {

  const title =
    puppySeoTitle(
      puppy
    );


  const description =
    puppySeoDescription(
      puppy
    );


  const canonical =
    puppyCanonicalUrl(
      puppy
    );


  const image =
    absoluteImageUrl(
      getPrimaryPuppyImage(
        puppy
      )
    );


  /* =====================================
     TITLE
     ===================================== */

  document.title =
    title;


  /* =====================================
     DESCRIPTION
     ===================================== */

  setMetaContent(
    'meta[name="description"]',
    description
  );


  /* =====================================
     ROBOTS
     ===================================== */

  setMetaContent(
    'meta[name="robots"]',
    "index,follow,max-image-preview:large"
  );


  /* =====================================
     CANONICAL
     ===================================== */

  setLinkHref(
    'link[rel="canonical"]',
    canonical
  );


  /* =====================================
     OPEN GRAPH
     ===================================== */

  setMetaContent(
    'meta[property="og:title"]',
    title
  );


  setMetaContent(
    'meta[property="og:description"]',
    description
  );


  setMetaContent(
    'meta[property="og:url"]',
    canonical
  );


  if (image) {

    setMetaContent(
      'meta[property="og:image"]',
      image
    );

  }


  /* =====================================
     TWITTER / SOCIAL
     ===================================== */

  setMetaContent(
    'meta[name="twitter:title"]',
    title
  );


  setMetaContent(
    'meta[name="twitter:description"]',
    description
  );


  if (image) {

    setMetaContent(
      'meta[name="twitter:image"]',
      image
    );

  }


  /* =====================================
     STRUCTURED DATA
     ===================================== */

  const schema =
    document.getElementById(
      "puppyPageSchema"
    );


  if (schema) {

    schema.textContent =
      JSON.stringify(
        puppyStructuredData(
          puppy
        )
      );

  }

}


/* ========================================
   INVALID PUPPY SEO
   ======================================== */


function applyPuppyNotFoundSeo() {

  const title =
    "Puppy Not Found | Clearview Kennels";


  const description =
    "Browse available Cavalier King Charles Spaniel and Cavapoo puppies from Clearview Kennels in Marshfield, Missouri.";


  document.title =
    title;


  setMetaContent(
    'meta[name="description"]',
    description
  );


  /*
    Invalid puppy query URLs should not
    become indexed search results.
  */

  setMetaContent(
    'meta[name="robots"]',
    "noindex,follow"
  );


  setLinkHref(
    'link[rel="canonical"]',
    CLEARVIEW_PUPPIES_URL
  );


  setMetaContent(
    'meta[property="og:title"]',
    title
  );


  setMetaContent(
    'meta[property="og:description"]',
    description
  );


  setMetaContent(
    'meta[property="og:url"]',
    CLEARVIEW_PUPPIES_URL
  );


  setMetaContent(
    'meta[name="twitter:title"]',
    title
  );


  setMetaContent(
    'meta[name="twitter:description"]',
    description
  );


  const schema =
    document.getElementById(
      "puppyPageSchema"
    );


  if (schema) {

    schema.textContent =
      JSON.stringify({
        "@context":
          "https://schema.org",

        "@type":
          "WebPage",

        "@id":
          `${CLEARVIEW_PUPPIES_URL}#webpage`,

        "url":
          CLEARVIEW_PUPPIES_URL,

        "name":
          "Available Puppies | Clearview Kennels",

        "isPartOf": {
          "@id":
            `${CLEARVIEW_SITE_URL}/#website`
        },

        "about": {
          "@id":
            `${CLEARVIEW_SITE_URL}/#organization`
        }
      });

  }

}


/* ========================================
   IMAGE RECOVERY

   If an image fails to load, retry the
   exact same image once with a unique
   query string.

   This helps recover from a failed,
   interrupted, or stale browser/CDN image
   request without changing the real file
   path stored in puppies.js.
   ======================================== */


function retryPuppyImage(image) {

  if (!image) {
    return;
  }


  /*
    Never retry the same image more than
    once or an unavailable file could
    create an endless request loop.
  */

  if (
    image.dataset
      .puppyRetry === "true"
  ) {
    return;
  }


  const originalSource =
    image.dataset
      .originalSrc ||
    image.getAttribute(
      "src"
    );


  if (!originalSource) {
    return;
  }


  image.dataset
    .puppyRetry = "true";


  const separator =
    originalSource.includes("?")
      ? "&"
      : "?";


  image.src =
    `${originalSource}${separator}retry=${Date.now()}`;

}


/* ========================================
   CARD PHOTO
   ======================================== */


function puppyCardPhoto(puppy) {

  const image =
    Array.isArray(puppy.images)
      ? puppy.images.find(
          image =>
            hasValue(image)
        )
      : null;


  if (image) {

    return `
      <img
        class="puppy-card-image"
        src="${escapeHtml(image)}"
        data-original-src="${escapeHtml(image)}"
        alt="${escapeHtml(
          puppyPhotoAlt(puppy)
        )}"
        loading="eager"
        decoding="async"
        onerror="retryPuppyImage(this)"
      />
    `;

  }


  const initial =
    hasValue(puppy.name)
      ? puppy.name
          .charAt(0)
          .toUpperCase()
      : "C";


  return `
    <div class="puppy-photo-placeholder">

      <span class="placeholder-mark">
        ${escapeHtml(initial)}
      </span>

      <span class="placeholder-copy">
        Photo coming soon
      </span>

    </div>
  `;

}


/* ========================================
   PUPPY CARD
   ======================================== */


function createPuppyCard(puppy) {

  const url =
    puppyDetailUrl(puppy);


  const price =
    puppy.status !== "adopted"
      ? formatPrice(
          puppy.price
        )
      : "";


  const status =
    statusLabel(
      puppy.status
    );


  const birthDate =
    formatDate(
      puppy.birthDate
    );


  const meta = [
    puppy.sex,
    puppy.color
  ]
    .filter(hasValue)
    .map(escapeHtml)
    .join(
      '<span aria-hidden="true">•</span>'
    );


  return `
    <article class="puppy-card">

      <a
        class="puppy-card-photo"
        href="${url}"
        aria-label="Meet ${escapeHtml(
          puppy.name
        )}"
      >

        ${puppyCardPhoto(puppy)}

        ${
          status
            ? `
              <span
                class="
                  puppy-status
                  puppy-status-${escapeHtml(
                    puppy.status
                  )}
                "
              >
                ${escapeHtml(status)}
              </span>
            `
            : ""
        }

      </a>


      <div class="puppy-card-copy">

        ${
          hasValue(puppy.breed)
            ? `
              <p class="puppy-breed">
                ${escapeHtml(
                  puppy.breed
                )}
              </p>
            `
            : ""
        }


        <h3>

          <a href="${url}">
            ${escapeHtml(
              puppy.name
            )}
          </a>

        </h3>


        ${
          meta
            ? `
              <div class="puppy-meta">
                ${meta}
              </div>
            `
            : ""
        }


        ${
          birthDate
            ? `
              <p class="puppy-birth-date">
                Born ${escapeHtml(
                  birthDate
                )}
              </p>
            `
            : ""
        }


        ${
          price
            ? `
              <p class="puppy-price">
                ${price}
              </p>
            `
            : ""
        }


        <a
          class="puppy-card-link"
          href="${url}"
        >
          Meet ${escapeHtml(
            puppy.name
          )}

          <span aria-hidden="true">
            →
          </span>
        </a>

      </div>

    </article>
  `;

}


/* ========================================
   FEATURED PUPPIES
   HOMEPAGE
   ======================================== */


function renderFeaturedPuppies() {

  const container =
    document.getElementById(
      "featuredPuppies"
    );


  if (!container) {
    return;
  }


  const allPuppies =
    getPuppies();


  /*
    Homepage priority:
    1. Featured + available
    2. Any available puppies

    Reserved/adopted puppies do not fill
    homepage featured slots.
  */

  let featured =
    allPuppies.filter(
      puppy =>
        puppy.featured === true &&
        puppy.status === "available"
    );


  if (!featured.length) {

    featured =
      allPuppies.filter(
        puppy =>
          puppy.status === "available"
      );

  }


  featured =
    featured.slice(0, 3);


  if (!featured.length) {

    container.innerHTML = `
      <div class="puppy-empty">

        <p class="eyebrow">
          Between Litters
        </p>

        <h3>
          No puppies are currently listed.
        </h3>

        <p>
          Check back for upcoming puppies,
          or contact Clearview to ask about
          future litters.
        </p>

        <a
          class="text-link"
          href="apply.html#contact"
        >
          Contact Clearview

          <span aria-hidden="true">
            →
          </span>
        </a>

      </div>
    `;

    return;

  }


  container.innerHTML =
    featured
      .map(createPuppyCard)
      .join("");

}


/* ========================================
   INVENTORY FILTER
   ======================================== */


function getBreedFilter() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const breed =
    params.get("breed");


  if (
    breed === "cavalier" ||
    breed === "cavapoo"
  ) {
    return breed;
  }


  return "all";

}


function filterPuppiesByBreed(
  puppyList,
  breed
) {

  if (
    !breed ||
    breed === "all"
  ) {
    return puppyList;
  }


  return puppyList.filter(
    puppy =>
      puppy.breedKey === breed
  );

}


/* ========================================
   INVENTORY GROUP
   ======================================== */


function inventoryGroupMarkup(
  title,
  copy,
  puppyList,
  showHeading = true
) {

  if (!puppyList.length) {
    return "";
  }


  return `
    <section class="inventory-group">

      ${
        showHeading
          ? `
            <div class="inventory-group-heading">

              <div>

                <p class="eyebrow">
                  ${escapeHtml(copy)}
                </p>

                <h2>
                  ${escapeHtml(title)}
                </h2>

              </div>

            </div>
          `
          : ""
      }


      <div class="puppy-grid">

        ${puppyList
          .map(createPuppyCard)
          .join("")}

      </div>

    </section>
  `;

}


/* ========================================
   INVENTORY EMPTY STATE
   ======================================== */


function inventoryEmptyMarkup(
  breed
) {

  let title =
    "No puppies are listed right now.";


  let copy =
    "Check back for future litters, or contact Clearview to ask what's coming next.";


  if (breed === "cavalier") {

    title =
      "No Cavaliers are listed right now.";


    copy =
      "Clearview may have another Cavalier litter planned. Get in touch to ask what's coming next.";

  }


  if (breed === "cavapoo") {

    title =
      "No Cavapoos are listed right now.";


    copy =
      "Clearview may have another Cavapoo litter planned. Get in touch to ask what's coming next.";

  }


  return `
    <div class="inventory-empty">

      <p class="eyebrow">
        Between Litters
      </p>

      <h2>
        ${escapeHtml(title)}
      </h2>

      <p>
        ${escapeHtml(copy)}
      </p>

      <a
        class="button button-dark"
        href="apply.html#contact"
      >
        Contact Clearview
      </a>

    </div>
  `;

}


/* ========================================
   INVENTORY FILTER CONTROLS
   ======================================== */


function updateInventoryFilters(
  activeBreed
) {

  const filters =
    document.querySelectorAll(
      "[data-breed-filter]"
    );


  filters.forEach(
    filter => {

      const breed =
        filter.dataset
          .breedFilter;


      const active =
        breed === activeBreed;


      filter.classList.toggle(
        "active",
        active
      );


      if (active) {

        filter.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        filter.removeAttribute(
          "aria-current"
        );

      }

    }
  );

}


/* ========================================
   FULL INVENTORY
   ======================================== */


function renderInventory() {

  const container =
    document.getElementById(
      "puppyInventory"
    );


  if (!container) {
    return;
  }


  const breed =
    getBreedFilter();


  const allPuppies =
    filterPuppiesByBreed(
      getPuppies(),
      breed
    );


  updateInventoryFilters(
    breed
  );


  if (!allPuppies.length) {

    container.innerHTML =
      inventoryEmptyMarkup(
        breed
      );


    return;

  }


  const available =
    allPuppies.filter(
      puppy =>
        puppy.status === "available"
    );


  const reserved =
    allPuppies.filter(
      puppy =>
        puppy.status === "reserved"
    );


  const adopted =
    allPuppies.filter(
      puppy =>
        puppy.status === "adopted"
    );


  const sections = [];


  if (available.length) {

    sections.push(
      inventoryGroupMarkup(
        "Available Puppies",
        "Looking for Their Families",
        available,
        false
      )
    );

  }


  if (reserved.length) {

    sections.push(
      inventoryGroupMarkup(
        "Reserved Puppies",
        "Already Spoken For",
        reserved
      )
    );

  }


  if (adopted.length) {

    sections.push(
      inventoryGroupMarkup(
        "Recently Adopted",
        "Found Their Families",
        adopted
      )
    );

  }


  container.innerHTML =
    sections.join("");

}


/* ========================================
   CURRENT PUPPY
   ======================================== */


function getCurrentPuppy() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const puppyId =
    params.get("id");


  if (!puppyId) {
    return null;
  }


  return (
    getPuppies().find(
      puppy =>
        puppy.id === puppyId
    ) || null
  );

}


/* ========================================
   DETAIL PRIMARY PHOTO
   ======================================== */


function detailPrimaryPhoto(puppy) {

  const image =
    Array.isArray(puppy.images)
      ? puppy.images.find(
          image =>
            hasValue(image)
        )
      : null;


  if (!image) {

    const initial =
      hasValue(puppy.name)
        ? puppy.name
            .charAt(0)
            .toUpperCase()
        : "C";


    return `
      <div
        class="
          puppy-detail-placeholder
          puppy-detail-primary-placeholder
        "
      >

        <span class="placeholder-mark">
          ${escapeHtml(initial)}
        </span>

        <span class="placeholder-copy">
          Puppy photo coming soon
        </span>

      </div>
    `;

  }


  return `
    <img
      class="puppy-detail-primary-image"
      src="${escapeHtml(image)}"
      data-original-src="${escapeHtml(image)}"
      alt="${escapeHtml(
        puppyPhotoAlt(puppy)
      )}"
      loading="eager"
      decoding="async"
      onerror="retryPuppyImage(this)"
    />
  `;

}


/* ========================================
   DETAIL GALLERY
   ======================================== */


function detailGallery(puppy) {

  if (
    !Array.isArray(puppy.images)
  ) {
    return "";
  }


  const validImages =
    puppy.images.filter(
      image =>
        hasValue(image)
    );


  if (
    validImages.length <= 1
  ) {
    return "";
  }


  const galleryImages =
    validImages.slice(1);


  return `
    <div class="puppy-detail-gallery">

      ${galleryImages
        .map(
          (image, index) => `
            <button
              class="puppy-gallery-button"
              type="button"
              data-gallery-image="${escapeHtml(
                image
              )}"
              aria-label="${escapeHtml(
                `View photo ${index + 2} of ${puppy.name}`
              )}"
            >

              <img
                src="${escapeHtml(image)}"
                data-original-src="${escapeHtml(image)}"
                alt="${escapeHtml(
                  `${puppy.name} photo ${index + 2}`
                )}"
                loading="lazy"
                decoding="async"
                onerror="retryPuppyImage(this)"
              />

            </button>
          `
        )
        .join("")}

    </div>
  `;

}


/* ========================================
   PARENT
   ======================================== */


function parentMarkup(
  label,
  parent
) {

  if (
    !parent ||
    (
      !hasValue(parent.name) &&
      !hasValue(parent.details) &&
      !hasValue(parent.image)
    )
  ) {
    return "";
  }


  const name =
    hasValue(parent.name)
      ? parent.name
      : "";


  const details =
    hasValue(parent.details)
      ? parent.details
      : "";


  const image =
    hasValue(parent.image)
      ? parent.image
      : "";


  const altText = [
    name,
    label,
    "Clearview Kennels"
  ]
    .filter(hasValue)
    .join(", ");


  return `
    <article class="puppy-parent">

      ${
        image
          ? `
            <div class="puppy-parent-photo">

              <img
                src="${escapeHtml(image)}"
                data-original-src="${escapeHtml(image)}"
                alt="${escapeHtml(altText)}"
                loading="lazy"
                decoding="async"
                onerror="retryPuppyImage(this)"
              />

            </div>
          `
          : ""
      }


      <div class="puppy-parent-copy">

        <p class="parent-label">
          ${escapeHtml(label)}
        </p>

        ${
          name
            ? `
              <h3>
                ${escapeHtml(name)}
              </h3>
            `
            : ""
        }

        ${
          details
            ? `
              <p>
                ${escapeHtml(details)}
              </p>
            `
            : ""
        }

      </div>

    </article>
  `;

}


/* ========================================
   PARENTS SECTION
   ======================================== */


function parentsSectionMarkup(
  puppy
) {

  const sire =
    parentMarkup(
      "Sire",
      puppy.sire
    );


  const dam =
    parentMarkup(
      "Dam",
      puppy.dam
    );


  if (
    !sire &&
    !dam
  ) {
    return "";
  }


  return `
    <section class="section puppy-parents-section">

      <div class="section-heading">

        <p class="eyebrow">
          Their Family
        </p>

        <h2>
          Meet the parents.
        </h2>

        <p>
          Learn a little more about the
          dogs behind this litter. Clearview
          can provide additional pedigree
          and registration information when
          applicable.
        </p>

      </div>


      <div class="puppy-parents">

        ${sire}

        ${dam}

      </div>

    </section>
  `;

}


/* ========================================
   STORY SECTION
   ======================================== */


function puppyStoryMarkup(
  puppy
) {

  if (
    !hasValue(
      puppy.description
    )
  ) {
    return "";
  }


  return `
    <section class="section puppy-story">

      <div class="puppy-story-heading">

        <p class="eyebrow">
          Meet ${escapeHtml(
            puppy.name
          )}
        </p>

        <h2>
          Get to know
          ${escapeHtml(
            puppy.name
          )}.
        </h2>

      </div>


      <div class="puppy-story-copy">

        <p class="lead">
          ${escapeHtml(
            puppy.description
          )}
        </p>

      </div>

    </section>
  `;

}


/* ========================================
   GOING HOME OPTION
   ======================================== */


function goingHomeOption(
  title,
  copy
) {

  return `
    <article class="transport-option">

      <span
        class="transport-mark"
        aria-hidden="true"
      ></span>

      <h3>
        ${escapeHtml(title)}
      </h3>

      <p>
        ${escapeHtml(copy)}
      </p>

    </article>
  `;

}


/* ========================================
   PUPPY DETAIL TEMPLATE
   ======================================== */


function createPuppyDetail(puppy) {

  const isAvailable =
    puppy.status === "available";


  const isReserved =
    puppy.status === "reserved";


  const price =
    puppy.status !== "adopted"
      ? formatPrice(
          puppy.price
        )
      : "";


  const applicationUrl =
    "apply.html?puppy=" +
    encodeURIComponent(
      puppy.id
    );


  let actionLabel =
    "Ask About This Puppy";


  if (isAvailable) {

    actionLabel =
      `Apply for ${puppy.name}`;

  }


  if (isReserved) {

    actionLabel =
      "Ask About Upcoming Puppies";

  }


  const birthDate =
    formatDate(
      puppy.birthDate
    );


  const readyDate =
    formatDate(
      puppy.readyDate
    );


  return `

    <!-- ==================================
         PUPPY INTRO
         ================================== -->

    <section class="puppy-detail-top">

      <div class="puppy-detail-media">

        <div
          class="puppy-detail-primary"
          id="puppyPrimaryImage"
        >
          ${detailPrimaryPhoto(puppy)}
        </div>

        ${detailGallery(puppy)}

      </div>


      <div class="puppy-detail-summary">

        <a
          class="puppy-back-link"
          href="puppies.html"
        >
          <span aria-hidden="true">
            ←
          </span>

          All Puppies
        </a>


        ${
          statusLabel(
            puppy.status
          )
            ? `
              <p
                class="
                  puppy-detail-status
                  puppy-detail-status-${escapeHtml(
                    puppy.status
                  )}
                "
              >
                ${escapeHtml(
                  statusLabel(
                    puppy.status
                  )
                )}
              </p>
            `
            : ""
        }


        ${
          hasValue(puppy.breed)
            ? `
              <p class="puppy-detail-breed">
                ${escapeHtml(
                  puppy.breed
                )}
              </p>
            `
            : ""
        }


        <h1>
          ${escapeHtml(
            puppy.name
          )}
        </h1>


        <dl class="puppy-facts">

          ${
            hasValue(puppy.sex)
              ? `
                <div>

                  <dt>
                    Sex
                  </dt>

                  <dd>
                    ${escapeHtml(
                      puppy.sex
                    )}
                  </dd>

                </div>
              `
              : ""
          }


          ${
            hasValue(puppy.color)
              ? `
                <div>

                  <dt>
                    Color
                  </dt>

                  <dd>
                    ${escapeHtml(
                      puppy.color
                    )}
                  </dd>

                </div>
              `
              : ""
          }


          ${
            birthDate
              ? `
                <div>

                  <dt>
                    Born
                  </dt>

                  <dd>
                    ${escapeHtml(
                      birthDate
                    )}
                  </dd>

                </div>
              `
              : ""
          }


          ${
            readyDate
              ? `
                <div>

                  <dt>
                    Ready
                  </dt>

                  <dd>
                    ${escapeHtml(
                      readyDate
                    )}
                  </dd>

                </div>
              `
              : ""
          }

        </dl>


        ${
          price
            ? `
              <div class="puppy-detail-price">

                <span>
                  Price
                </span>

                <strong>
                  ${price}
                </strong>

              </div>
            `
            : ""
        }


        <div class="puppy-detail-actions">

          <a
            class="button button-dark"
            href="${applicationUrl}"
          >
            ${escapeHtml(
              actionLabel
            )}
          </a>


          <a
            class="text-link"
            href="apply.html#contact"
          >
            Ask a Question

            <span aria-hidden="true">
              →
            </span>
          </a>

        </div>


        ${
          isAvailable
            ? `
              <p class="puppy-deposit-note">
                Approved families may reserve
                a puppy with a $300 deposit.
              </p>
            `
            : ""
        }

      </div>

    </section>


    <!-- ==================================
         STORY
         ================================== -->

    ${puppyStoryMarkup(
      puppy
    )}


    <!-- ==================================
         PARENTS
         ================================== -->

    ${parentsSectionMarkup(
      puppy
    )}


    <!-- ==================================
         GOING HOME
         ================================== -->

    <section class="section puppy-going-home">

      <div class="section-heading">

        <p class="eyebrow">
          Bringing Them Home
        </p>

        <h2>
          However far home is.
        </h2>

        <p>
          Clearview is based in Marshfield,
          Missouri, and works with families
          throughout the contiguous United
          States. We'll help you talk through
          the way home that makes sense for
          you and your puppy.
        </p>

      </div>


      <div class="transport-list">

        ${goingHomeOption(
          "Personal Pickup",
          "Meet Clearview in Marshfield, Missouri, and bring your puppy home yourself."
        )}

        ${goingHomeOption(
          "Ground Transportation",
          "Ask Clearview about available ground transportation options."
        )}

        ${goingHomeOption(
          "Flight Nanny",
          "Flight-nanny arrangements may be available for families who live farther away."
        )}

      </div>

    </section>


    <!-- ==================================
         FINAL CTA
         ================================== -->

    <section class="final-cta">

      <p class="eyebrow">

        ${
          isAvailable
            ? `${escapeHtml(
                puppy.name
              )} is Available`
            : "Clearview Kennels"
        }

      </p>


      <h2>

        ${
          isAvailable
            ? `Could ${escapeHtml(
                puppy.name
              )} be yours?`
            : "Looking for your next companion?"
        }

      </h2>


      <p>

        ${
          isAvailable
            ? "If this feels like the puppy you've been looking for, tell Clearview a little about your family."
            : "Meet the puppies currently looking for their families."
        }

      </p>


      <div class="final-cta-actions">

        <a
          class="button button-light"
          href="${applicationUrl}"
        >

          ${
            isAvailable
              ? `Apply for ${escapeHtml(
                  puppy.name
                )}`
              : "View the Application"
          }

        </a>


        <a
          class="final-cta-link"
          href="puppies.html"
        >
          Meet the Puppies

          <span aria-hidden="true">
            →
          </span>
        </a>

      </div>

    </section>

  `;

}


/* ========================================
   PUPPY NOT FOUND
   ======================================== */


function puppyNotFoundMarkup() {

  return `
    <section class="puppy-not-found">

      <p class="eyebrow">
        Clearview Kennels
      </p>

      <h1>
        That puppy isn't here anymore.
      </h1>

      <p>
        The listing may have changed,
        the puppy may have found a family,
        or the link may no longer be
        current.
      </p>

      <a
        class="button button-dark"
        href="puppies.html"
      >
        Meet the Puppies
      </a>

    </section>
  `;

}


/* ========================================
   RENDER DETAIL PAGE
   ======================================== */


function renderPuppyDetail() {

  const container =
    document.getElementById(
      "puppyDetail"
    );


  if (!container) {
    return;
  }


  const puppy =
    getCurrentPuppy();


  if (!puppy) {

    container.innerHTML =
      puppyNotFoundMarkup();


    applyPuppyNotFoundSeo();


    return;

  }


  container.innerHTML =
    createPuppyDetail(
      puppy
    );


  /*
    Update the browser/search/social metadata
    after the puppy data has been loaded.
  */

  applyPuppySeo(
    puppy
  );


  initializePuppyGallery();

}


/* ========================================
   GALLERY
   ======================================== */


function initializePuppyGallery() {

  const primary =
    document.getElementById(
      "puppyPrimaryImage"
    );


  const buttons =
    document.querySelectorAll(
      ".puppy-gallery-button"
    );


  if (
    !primary ||
    !buttons.length
  ) {
    return;
  }


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const nextSource =
            button.dataset
              .galleryImage;


          if (!nextSource) {
            return;
          }


          const primaryImage =
            primary.querySelector(
              "img"
            );


          const thumbnail =
            button.querySelector(
              "img"
            );


          if (
            !primaryImage ||
            !thumbnail
          ) {
            return;
          }


          const previousSource =
            primaryImage.getAttribute(
              "src"
            );


          const previousAlt =
            primaryImage.getAttribute(
              "alt"
            );


          const nextAlt =
            thumbnail.getAttribute(
              "alt"
            );


          primaryImage.dataset
            .puppyRetry = "false";


          primaryImage.dataset
            .originalSrc =
              nextSource;


          primaryImage.setAttribute(
            "src",
            nextSource
          );


          if (nextAlt) {

            primaryImage.setAttribute(
              "alt",
              nextAlt
            );

          }


          if (previousSource) {

            thumbnail.dataset
              .puppyRetry = "false";


            thumbnail.dataset
              .originalSrc =
                previousSource;


            thumbnail.setAttribute(
              "src",
              previousSource
            );


            button.dataset
              .galleryImage =
                previousSource;

          }


          if (previousAlt) {

            thumbnail.setAttribute(
              "alt",
              previousAlt
            );

          }

        }
      );

    }
  );

}


/* ========================================
   INITIALIZE
   ======================================== */


function initializePuppySystem() {

  renderFeaturedPuppies();

  renderInventory();

  renderPuppyDetail();

}


if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializePuppySystem
  );

} else {

  initializePuppySystem();

}