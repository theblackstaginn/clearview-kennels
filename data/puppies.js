"use strict";


/* ========================================
   CLEARVIEW KENNELS — PUPPY DATA

   STATUS OPTIONS:
   "available"
   "reserved"
   "adopted"

   BREED FILTER VALUES:
   "cavalier"
   "cavapoo"

   To add a puppy:
   1. Copy an existing puppy object.
   2. Give it a unique id.
   3. Replace the information.
   4. Add images when available.

   To move a puppy between sections:
   Change only the status value.

   Keep factual puppy information here.
   The puppy system automatically uses
   this data for cards, detail pages,
   application links, and SEO metadata.
   ======================================== */


const puppies = [

  /* ========================================
     CHOCOLATE CHIP
     ======================================== */

  {
    id: "chocolate-chip",

    name: "Chocolate Chip",

    breed: "Cavalier King Charles Spaniel",
    breedKey: "cavalier",

    sex: "Male",
    color: "Chocolate Tri",

    birthDate: "2026-08-08",
    readyDate: "",

    price: null,

    status: "available",

    featured: true,

    images: [
      "ck-puppies/choc-chip.webp"
    ],

    description:
      "Chocolate Chip is a male chocolate tri Cavalier King Charles Spaniel born August 8, 2026, and raised at Clearview Kennels in Marshfield, Missouri.",

    sire: {
      name: "Peanut",
      details: "Chocolate",
      image: "ck-parents/peanut.webp"
    },

    dam: {
      name: "Amber",
      details: "Tri-color",
      image: "ck-parents/amber.webp"
    }
  },


  /* ========================================
     ZORO
     ======================================== */

  {
    id: "zoro",

    name: "Zoro",

    breed: "Cavalier King Charles Spaniel",
    breedKey: "cavalier",

    sex: "Male",
    color: "Tri-color",

    birthDate: "2026-08-08",
    readyDate: "",

    price: null,

    status: "available",

    featured: true,

    images: [
      "ck-puppies/zoro.webp"
    ],

    description:
      "Zoro is a male tri-color Cavalier King Charles Spaniel born August 8, 2026, and raised at Clearview Kennels in Marshfield, Missouri.",

    sire: {
      name: "Peanut",
      details: "Chocolate",
      image: "ck-parents/peanut.webp"
    },

    dam: {
      name: "Amber",
      details: "Tri-color",
      image: "ck-parents/amber.webp"
    }
  }

];