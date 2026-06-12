# tailwindest-css-transform

## 1.0.9

### Patch Changes

- Fix CSS transformer record-key resolution and typed shadcn output validation
- Updated dependencies
    - create-tailwind-type@1.1.6

## 1.0.8

### Patch Changes

- 2b1c820: Preserve unsupported static Tailwind tokens in transformed output, including named group, peer, container, arbitrary declaration, descendant variant, animation, and parenthesized arbitrary value classes.

## Unreleased

### Patch Changes

- Preserve unsupported static Tailwind tokens during structured conversion by
  serializing them through `tw.def(...)` or raw `tw.join(...)`.
- Preserve named group/peer/container anchors, arbitrary declarations,
  placement animation utilities, descendant variant chains, and parenthesized
  arbitrary-value utilities in shadcn registry transformations.
- Preserve CVA base tokens unconditionally and CVA variant-option tokens
  conditionally at rewritten call sites.
- Add shadcn registry stability and output token-preservation specs.

## 1.0.7

### Patch Changes

- Support arbitrary nested group types, fix minor css transformation errors

## 1.0.6

### Patch Changes

- Update CLI auto config inference

## 1.0.5

### Patch Changes

- cd2cea3: Fix CLI production entry points so npm `npx` installs execute the correct CJS binaries.
- af6c568: Fix CLI runtime errors in CJS execution by avoiding `createRequire` with an undefined meta URL during bundling.
- Fix cjs build
- Updated dependencies [cd2cea3]
- Updated dependencies [af6c568]
- Updated dependencies
    - create-tailwind-type@1.1.4

## 1.0.4

### Patch Changes

- Fix cli pub configs
- Updated dependencies
    - create-tailwind-type@1.1.3

## 1.0.3

### Patch Changes

- Fix pub deps error
- Updated dependencies
    - create-tailwind-type@1.1.2

## 1.0.2

### Patch Changes

- Fix files for dist only

## 1.0.1

### Patch Changes

- Fix internal deps error
- Updated dependencies
    - create-tailwind-type@1.1.1

## 1.0.0

### Major Changes

- Upgrade CLI interface and creation process

### Patch Changes

- Updated dependencies
    - create-tailwind-type@1.1.0
