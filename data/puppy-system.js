/* ========================================
   PUPPY DETAIL PAGE
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

  return puppies.find(
    puppy =>
      puppy.id === puppyId
  ) || null;

}


/* ========================================
   DETAIL PHOTO
   ======================================== */


function detailPrimaryPhoto(puppy) {

  const image =
    Array.isArray(puppy.images)
      ? puppy.images[0]
      : null;

  if (!image) {

    return `
      <div
        class="
          puppy-detail-placeholder
          puppy-detail-primary-placeholder
        "
      >

        <span class="placeholder-mark">
          ${escapeHtml(
            puppy.name
              .charAt(0)
              .toUpperCase()
          )}
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
        `${puppy.name}, ${puppy.breed}`
      )}"
    />
  `;

}


/* ========================================
   DETAIL GALLERY
   ======================================== */


function detailGallery(puppy) {

  if (
    !Array.isArray(puppy.images) ||
    puppy.images.length <= 1
  ) {
    return "";
  }

  const galleryImages =
    puppy.images.slice(1);

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
              aria-label="View photo ${
                index + 2
              } of ${escapeHtml(
                puppy.name
              )}"
            >

              <img
                src="${escapeHtml(image)}"
                alt="${escapeHtml(
                  `${puppy.name} photo ${
                    index + 2
                  }`
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

  if (!parent) {
    return "";
  }

  const name =
    parent.name ||
    "Information coming soon";

  const details =
    parent.details || "";

  return `
    <div class="puppy-parent">

      <p class="parent-label">
        ${escapeHtml(label)}
      </p>

      <h3>
        ${escapeHtml(name)}
      </h3>

      ${
        details
          ? `
            <p>
              ${escapeHtml(details)}
            </p>
          `
          : `
            <p class="parent-coming-soon">
              Additional parent and pedigree
              information coming soon.
            </p>
          `
      }

    </div>
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
      ? formatPrice(puppy.price)
      : "";

  const applicationUrl =
    `apply.html?puppy=${
      encodeURIComponent(
        puppy.id
      )
    }`;

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


  return `

    <!-- =========================
         TOP
         ========================= -->

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


        <p class="puppy-detail-breed">
          ${escapeHtml(
            puppy.breed
          )}
        </p>


        <h1>
          ${escapeHtml(
            puppy.name
          )}
        </h1>


        <dl class="puppy-facts">

          ${
            puppy.sex
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
            puppy.color
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
            puppy.birthDate
              ? `
                <div>
                  <dt>
                    Born
                  </dt>

                  <dd>
                    ${escapeHtml(
                      formatDate(
                        puppy.birthDate
                      )
                    )}
                  </dd>
                </div>
              `
              : ""
          }


          ${
            puppy.readyDate
              ? `
                <div>
                  <dt>
                    Ready
                  </dt>

                  <dd>
                    ${escapeHtml(
                      formatDate(
                        puppy.readyDate
                      )
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


    <!-- =========================
         MEET THE PUPPY
         ========================= -->

    <section class="section puppy-story">

      <div class="puppy-story-heading">

        <p class="eyebrow">
          Meet ${escapeHtml(
            puppy.name
          )}
        </p>

        <h2>
          A little about
          ${escapeHtml(
            puppy.name
          )}.
        </h2>

      </div>


      <div class="puppy-story-copy">

        <p class="lead">
          ${
            puppy.description
              ? escapeHtml(
                  puppy.description
                )
              : "Individual puppy information coming soon."
          }
        </p>

      </div>

    </section>


    <!-- =========================
         PARENTS
         ========================= -->

    <section class="section puppy-parents-section">

      <div class="section-heading">

        <p class="eyebrow">
          Family
        </p>

        <h2>
          Meet the parents.
        </h2>

        <p>
          Learn more about the dogs behind
          this litter. Clearview can provide
          additional pedigree and registration
          information when applicable.
        </p>

      </div>


      <div class="puppy-parents">

        ${parentMarkup(
          "Sire",
          puppy.sire
        )}

        ${parentMarkup(
          "Dam",
          puppy.dam
        )}

      </div>

    </section>


    <!-- =========================
         GOING HOME
         ========================= -->

    <section class="section puppy-going-home">

      <div class="section-heading">

        <p class="eyebrow">
          Bringing Your Puppy Home
        </p>

        <h2>
          From Clearview
          to your home.
        </h2>

        <p>
          Clearview works with families
          near and far. Ask about the
          transportation option that works
          best for you.
        </p>

      </div>


      <div class="transport-list">

        <div>

          <span class="transport-number">
            01
          </span>

          <h3>
            Personal Pickup
          </h3>

          <p>
            Meet Clearview in person and
            bring your puppy home yourself.
          </p>

        </div>


        <div>

          <span class="transport-number">
            02
          </span>

          <h3>
            Courier
          </h3>

          <p>
            Ask Clearview about available
            ground transportation options.
          </p>

        </div>


        <div>

          <span class="transport-number">
            03
          </span>

          <h3>
            Flight Nanny
          </h3>

          <p>
            Flight-nanny arrangements may
            be available for families who
            live farther away.
          </p>

        </div>

      </div>

    </section>


    <!-- =========================
         FINAL CTA
         ========================= -->

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
              )} be the one?`
            : "Looking for your next companion?"
        }
      </h2>


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
        We couldn't find
        that puppy.
      </h1>

      <p>
        This puppy may no longer be listed,
        or the link may have changed.
      </p>

      <a
        class="button button-dark"
        href="puppies.html"
      >
        View All Puppies
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


  /* Dynamic page title */

  document.title =
    `${puppy.name} | ${puppy.breed} | Clearview Kennels`;


  /* Dynamic meta description */

  const metaDescription =
    document.querySelector(
      'meta[name="description"]'
    );

  if (metaDescription) {

    metaDescription.setAttribute(
      "content",
      `Meet ${puppy.name}, a ${puppy.sex.toLowerCase()} ${puppy.breed} from Clearview Kennels in Marshfield, Missouri.`
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

          const image =
            button.dataset
              .galleryImage;

          if (!image) {
            return;
          }


          const currentImage =
            primary.querySelector(
              "img"
            );


          /*
            If a real primary image exists,
            swap the image.
          */

          if (currentImage) {

            const oldSource =
              currentImage.src;

            currentImage.src =
              image;


            /*
              Swap thumbnail back to
              previous primary image.
            */

            const thumbnail =
              button.querySelector(
                "img"
              );

            if (thumbnail) {

              const oldThumb =
                thumbnail.src;

              thumbnail.src =
                oldSource;

              button.dataset
                .galleryImage =
                  oldSource;

            }

          }

        }
      );

    }
  );

}