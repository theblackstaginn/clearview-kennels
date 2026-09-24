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
      "More information about Chocolate Chip is coming soon.",

    sire: {
      name: "Sire information coming soon",
      details: ""
    },

    dam: {
      name: "Dam information coming soon",
      details: ""
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
      "More information about Zoro is coming soon.",

    sire: {
      name: "Sire information coming soon",
      details: ""
    },

    dam: {
      name: "Dam information coming soon",
      details: ""
    }
  }

];