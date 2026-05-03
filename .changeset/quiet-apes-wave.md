---
"tailwindest-tailwind-internal": patch
"create-tailwind-type": patch
"tailwindest-css-transform": patch
---

Fix CLI runtime errors in CJS execution by avoiding `createRequire` with an undefined meta URL during bundling.
