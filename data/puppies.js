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

  {
    id: "sample-cavalier-1",

    name: "Sample Puppy",

    breed: "Cavalier King Charles Spaniel",
    breedKey: "cavalier",

    sex: "Female",
    color: "Blenheim",

    birthDate: "2026-07-14",
    readyDate: "2026-09-08",

    price: 2500,

    status: "available",

    featured: true,

    images: [],

    description:
      "Puppy description will appear here once Clearview provides the puppy's individual information.",

    sire: {
      name: "Sire information coming soon",
      details: ""
    },

    dam: {
      name: "Dam information coming soon",
      details: ""
    }
  },


  {
    id: "sample-cavapoo-1",

    name: "Sample Puppy",

    breed: "Cavapoo",
    breedKey: "cavapoo",

    sex: "Male",
    color: "Color coming soon",

    birthDate: "2026-07-22",
    readyDate: "2026-09-16",

    price: 2200,

    status: "available",

    featured: true,

    images: [],

    description:
      "Puppy description will appear here once Clearview provides the puppy's individual information.",

    sire: {
      name: "Sire information coming soon",
      details: ""
    },

    dam: {
      name: "Dam information coming soon",
      details: ""
    }
  },


  {
    id: "sample-reserved",

    name: "Sample Puppy",

    breed: "Cavalier King Charles Spaniel",
    breedKey: "cavalier",

    sex: "Male",
    color: "Ruby",

    birthDate: "2026-06-30",
    readyDate: "2026-08-25",

    price: 2400,

    status: "reserved",

    featured: false,

    images: [],

    description:
      "This sample demonstrates how a reserved puppy will appear.",

    sire: {
      name: "Sire information coming soon",
      details: ""
    },

    dam: {
      name: "Dam information coming soon",
      details: ""
    }
  },


  {
    id: "sample-adopted",

    name: "Sample Puppy",

    breed: "Cavapoo",
    breedKey: "cavapoo",

    sex: "Female",
    color: "Color coming soon",

    birthDate: "2026-05-18",
    readyDate: "2026-07-13",

    price: 2100,

    status: "adopted",

    featured: false,

    images: [],

    description:
      "This sample demonstrates how a puppy will appear after finding a family.",

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