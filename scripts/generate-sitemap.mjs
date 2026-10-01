import fs from "node:fs";
import vm from "node:vm";

const SITE_URL = "https://clearviewkennels.com";
const PUPPY_DATA_PATH = "data/puppies.js";
const OUTPUT_PATH = "sitemap.xml";

const source = fs.readFileSync(PUPPY_DATA_PATH, "utf8");
const context = {};

vm.createContext(context);

vm.runInContext(
  `${source}\n;globalThis.__clearviewPuppies = puppies;`,
  context,
  { filename: PUPPY_DATA_PATH }
);

const puppies = context.__clearviewPuppies;

if (!Array.isArray(puppies)) {
  throw new Error(
    "Could not read puppy data from data/puppies.js"
  );
}

const staticUrls = [
  `${SITE_URL}/`,
  `${SITE_URL}/puppies.html`,
  `${SITE_URL}/apply.html`
];

const puppyUrls = puppies
  .filter(
    (puppy) =>
      puppy &&
      typeof puppy.id === "string" &&
      puppy.id.trim()
  )
  .map(
    (puppy) =>
      `${SITE_URL}/puppy.html?id=${encodeURIComponent(
        puppy.id.trim()
      )}`
  );

const urls = [
  ...new Set([
    ...staticUrls,
    ...puppyUrls
  ])
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.flatMap((url) => [
    "  <url>",
    `    <loc>${url}</loc>`,
    "  </url>"
  ]),
  "</urlset>",
  ""
].join("\n");

fs.writeFileSync(
  OUTPUT_PATH,
  xml,
  "utf8"
);

console.log(
  `Wrote ${OUTPUT_PATH} with ${urls.length} URLs.`
);
