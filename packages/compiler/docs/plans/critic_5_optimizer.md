# Critic 5: API Surface and Variant Optimizer Judgment Gate

The optimizer may reduce runtime work only when logical equivalence is proven. Bundle size wins never justify wrong classes.

## P0 Rejection Conditions

- Any public `createTools()` API is untested.
- Dynamic variant output differs from runtime for any tested combination.
- Full cartesian table is emitted for independent axes without need.
- Threshold overflow silently emits huge code.
- Generated code calls runtime styler classes in fully compiled mode.

## Required Proof

### C5.1 Full API Surface Coverage

The judge must see tests for:

- `tw.style().class`
- `tw.style().style`
- `tw.style().compose`
- `tw.toggle().class`
- `tw.toggle().style`
- `tw.toggle().compose`
- `tw.rotary().class`
- `tw.rotary().style`
- `tw.rotary().compose`
- `tw.variants().class`
- `tw.variants().style`
- `tw.variants().compose`
- `tw.join`
- `tw.def`
- `tw.mergeProps`
- `tw.mergeRecord`

Each API needs static success, dynamic exact success where supported, and unsupported fallback/error cases.

### C5.2 Dynamic Lookup Parity

Required tests:

- boolean toggle emits ternary and matches runtime for true/false.
- rotary emits lookup and matches runtime for every key plus `base`.
- variants emits lookup/additive maps and matches runtime for every allowed combination.
- missing optional props match runtime base behavior.
- extra class/style args preserve merge order.

### C5.3 Conflict Graph Proof

Required tests:

- independent axes emit additive maps.
- conflicting axes emit component tables.
- mixed graph emits both additive maps and component tables.
- component table candidate list includes every possible class.
- path conflict detection uses style paths, not class token text alone.

### C5.4 Explosion Guard

Required tests:

- table size under limit compiles.
- table size over limit fails strict mode with `VARIANT_TABLE_LIMIT_EXCEEDED`.
- table size over limit falls back in loose mode and still registers all candidates.
- generated code size is snapshot-tested for representative variant maps.

### C5.5 Zero-runtime Proof

Required proof:

- compiled output does not import `PrimitiveStyler`, `ToggleStyler`, `RotaryStyler`, or `VariantsStyler`.
- generated lookup constants are tree-shakeable.
- unused generated tables are removable by bundler in e2e or build output inspection.

## Verdict Template

Pass only when every dynamic output is mechanically compared against runtime over the complete finite input domain.
