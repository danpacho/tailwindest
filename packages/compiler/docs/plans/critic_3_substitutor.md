# Critic 3: Substitutor Judgment Gate

The substitutor edits source code. The only acceptable standard is atomic, minimal, and traceable transformation.

## P0 Rejection Conditions

- Partial replacements are emitted after an exception.
- Overlapping spans produce syntactically invalid code.
- A fallback call is modified as if exact.
- Runtime imports are removed while fallback calls remain.
- Source map generation failure is ignored in strict mode.

## Required Proof

### C3.1 Atomic Replacement

Required tests:

- invalid span returns original code and diagnostic.
- generated syntax error returns original code and diagnostic.
- source map strict failure returns original code and diagnostic.
- import cleanup failure returns original code and diagnostic.

### C3.2 Reverse Execution Safety

Required tests:

- multiple independent replacements in one file.
- nested call replacement where outer call consumes inner results.
- overlapping replacements that cannot be proven safe.
- replacement at beginning and end of file.

Judge requirement: replacements must be applied by source offset, not by mutating ts-morph nodes.

### C3.3 Formatting Preservation

Required snapshots:

- surrounding comments remain.
- unrelated whitespace remains.
- JSX expressions remain valid.
- multiline style object replacement does not reformat adjacent code.

The transformed file may differ only inside replacement spans and safe import cleanup spans.

### C3.4 Import Cleanup

Required tests:

- remove Tailwindest import when all runtime tools are compiled away.
- preserve import when at least one fallback remains.
- preserve unrelated named imports from same declaration.
- preserve type-only imports unless cleanup is intentionally implemented and tested.

### C3.5 Source Map

Required tests:

- returned map is valid Vite transform output.
- replacement maps to original call span.
- `sourcesContent` is present when input source is available.

## Verdict Template

Pass only if the substitutor can be trusted on large files: no AST mutation in apply phase, no partial output, no unsafe import cleanup.
