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
   - Status labels
   - Dates / prices
   - Graceful handling of incomplete listings
   ======================================== */


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
        alt="${escapeHtml(
          puppyPhotoAlt(puppy)
        )}"
        loading="lazy"
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
      alt="${escapeHtml(
        puppyPhotoAlt(puppy)
      )}"
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
                alt="${escapeHtml(
                  `${puppy.name} photo ${index + 2}`
                )}"
                loading="lazy"
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
      !hasValue(parent.details)
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


  return `
    <article class="puppy-parent">

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
          Clearview works with families
          both near and far. We'll help you
          talk through the way home that
          makes sense for you and your
          puppy.
        </p>

      </div>


      <div class="transport-list">

        ${goingHomeOption(
          "Personal Pickup",
          "Meet Clearview in person and bring your puppy home yourself."
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


    document.title =
      "Puppy Not Found | Clearview Kennels";


    return;

  }


  container.innerHTML =
    createPuppyDetail(
      puppy
    );


  /* =====================================
     DYNAMIC TITLE
     ===================================== */

  const titleParts = [
    puppy.name,
    hasValue(puppy.breed)
      ? puppy.breed
      : null,
    "Clearview Kennels"
  ]
    .filter(hasValue);


  document.title =
    titleParts.join(" | ");


  /* =====================================
     DYNAMIC DESCRIPTION
     ===================================== */

  const metaDescription =
    document.querySelector(
      'meta[name="description"]'
    );


  if (metaDescription) {

    let description =
      `Meet ${puppy.name} from Clearview Kennels in Marshfield, Missouri.`;


    if (
      hasValue(puppy.sex) &&
      hasValue(puppy.breed)
    ) {

      description =
        `Meet ${puppy.name}, a ${puppy.sex.toLowerCase()} ${puppy.breed} from Clearview Kennels in Marshfield, Missouri.`;

    } else if (
      hasValue(puppy.breed)
    ) {

      description =
        `Meet ${puppy.name}, a ${puppy.breed} from Clearview Kennels in Marshfield, Missouri.`;

    }


    metaDescription.setAttribute(
      "content",
      description
    );

  }


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