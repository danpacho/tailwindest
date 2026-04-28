# Tailwindest Compiler Implementation Plan

본 계획은 `@tailwindest/compiler`를 Vite 8 + Tailwind CSS 4.2 기준으로 구현하기 위한 단계별 작업 명세다. 목표는 `packages/tailwindest/src/tools/create_tools.ts`의 public API를 가능한 범위에서 정적으로 컴파일하고, 불가능한 경우 명확한 diagnostic 또는 runtime fallback을 제공하는 것이다.

## 구현 원칙

- Shared evaluator를 먼저 만든 뒤 Vite adapter를 붙인다.
- Tailwind 통합은 `addUtilities`가 아니라 `@source inline()` manifest bridge로 구현한다.
- 모든 변환은 파일 시스템 원본을 직접 수정하지 않고 Vite transform result로만 반환한다.
- strict mode에서 정확하지 않은 컴파일은 실패시킨다.
- loose mode에서 fallback을 남기더라도 Tailwind candidate는 가능한 만큼 manifest에 등록한다.

## Phase 1: Shared Evaluation Engine

**Files**

- Create: `packages/compiler/src/core/evaluator.ts`
- Create: `packages/compiler/src/core/static_value.ts`
- Create: `packages/compiler/src/core/merger.ts`
- Test: `packages/compiler/src/core/__tests__/evaluator.test.ts`

**Scope**

- `Styler.flattenRecord`, `Styler.deepMerge`, `Styler.getClassName`과 bit-level parity를 맞춘다.
- `toClass`/`clsx` compatible class list 평가를 구현한다.
- `toDef`, `mergeRecord`, `mergeProps`, `join`을 evaluator API로 제공한다.
- merger는 `none`, known build-time merger, unsupported로 분리한다.

**Verification**

- `packages/tailwindest/src/tools/__tests__`의 핵심 fixture를 compiler evaluator test로 복제한다.
- array override, nested object, empty object, falsey class value, object dictionary class value를 포함한다.

## Phase 2: Static Resolver and Detector

**Files**

- Create: `packages/compiler/src/analyzer/detector.ts`
- Create: `packages/compiler/src/analyzer/static_resolver.ts`
- Create: `packages/compiler/src/analyzer/symbols.ts`
- Test: `packages/compiler/src/analyzer/__tests__/detector.test.ts`
- Test: `packages/compiler/src/analyzer/__tests__/static_resolver.test.ts`

**Scope**

- `createTools()` 반환 symbol을 TypeChecker로 추적한다.
- import, re-export, alias, destructuring을 지원한다.
- 정적 object/string/array/boolean/number literal을 복원한다.
- unknown spread, mutation, function call, unsupported merger는 diagnostic을 낸다.

**Verification**

- 변수명이 `tw`가 아닌 경우도 컴파일한다.
- `tw`라는 이름의 다른 함수는 컴파일하지 않는다.
- 3단계 import chain과 circular reference 방어 테스트를 추가한다.

## Phase 3: API Compile Surface

**Files**

- Create: `packages/compiler/src/core/api_compile.ts`
- Create: `packages/compiler/src/core/variant_optimizer.ts`
- Test: `packages/compiler/src/core/__tests__/api_compile.test.ts`
- Test: `packages/compiler/src/core/__tests__/variant_optimizer.test.ts`

**Scope**

- `tw.style(...).class`, `.style`, `.compose`
- `tw.toggle(...).class`, `.style`, `.compose`
- `tw.rotary(...).class`, `.style`, `.compose`
- `tw.variants(...).class`, `.style`, `.compose`
- `tw.join`, `tw.def`, `tw.mergeProps`, `tw.mergeRecord`

**Dynamic variant strategy**

- `toggle`: boolean expression이면 ternary emit.
- `rotary`: key expression이면 lookup emit.
- `variants`: conflict graph로 additive axis와 table axis를 분리.
- table threshold 초과 시 loose mode fallback, strict mode error.

**Verification**

- create_tools test의 모든 기능 케이스를 compiler fixture로 만든다.
- dynamic prop 조합에서 generated class list가 runtime result와 동일한지 property-based test를 추가한다.

## Phase 4: Substitutor

**Files**

- Create: `packages/compiler/src/transform/substitutor.ts`
- Create: `packages/compiler/src/transform/source_map.ts`
- Test: `packages/compiler/src/transform/__tests__/substitutor.test.ts`

**Scope**

- `Collect -> Reverse Execute`를 `MagicString` 기반으로 구현한다.
- overlapping replacement를 deterministic하게 정렬한다.
- 실패 시 파일 전체 원본 반환과 diagnostic emit을 보장한다.

**Verification**

- nested call: `tw.join(tw.style(...).class(), "...")`
- comments/whitespace가 주변 코드를 깨지 않는지 snapshot.
- source map이 생성되고 Vite transform return shape와 호환되는지 확인.

## Phase 5: Candidate Manifest Bridge

**Files**

- Create: `packages/compiler/src/tailwind/manifest.ts`
- Create: `packages/compiler/src/tailwind/source_inline.ts`
- Test: `packages/compiler/src/tailwind/__tests__/manifest.test.ts`
- Test: `packages/compiler/src/tailwind/__tests__/source_inline.test.ts`

**Scope**

- file별 candidate set과 global candidate set을 관리한다.
- CSS transform에서 Tailwind entry에 `@source inline()`을 삽입한다.
- 후보가 많을 때 brace expansion 압축을 적용한다.
- CSS entry가 여러 개인 경우 entry별 source root 정책을 적용한다.

**Verification**

- generated CSS input에 정확히 한 번만 manifest가 삽입된다.
- candidate 삭제 시 manifest에서도 사라진다.
- 특수 문자, arbitrary value, variant prefix가 escape 손실 없이 보존된다.

## Phase 6: Vite Adapter

**Files**

- Create: `packages/compiler/src/vite/index.ts`
- Create: `packages/compiler/src/vite/context.ts`
- Create: `packages/compiler/src/vite/cache.ts`
- Modify: `packages/compiler/src/index.ts`
- Test: `packages/compiler/src/vite/__tests__/vite_plugin.test.ts`

**Scope**

- Vite `transform.filter`와 내부 include/exclude를 모두 적용한다.
- `buildStart`에서 pre-scan으로 초기 manifest를 채운다.
- `hotUpdate`에서 dirty module과 CSS entry를 invalidate한다.
- POSIX path normalization을 적용한다.

**Verification**

- fixture Vite app에서 `vite build` output을 snapshot한다.
- dev transform과 build transform의 code/manifest parity를 테스트한다.
- style definition 파일 변경 시 stale class가 남지 않는 HMR test를 작성한다.

## Phase 7: Tailwind v4 Integration Test

**Files**

- Create: `packages/compiler/e2e/vite-tailwind-v4/`
- Create: `packages/compiler/e2e/vite-tailwind-v4/src/App.tsx`
- Create: `packages/compiler/e2e/vite-tailwind-v4/src/app.css`
- Test: `packages/compiler/e2e/vite-tailwind-v4/compiler.e2e.test.ts`

**Scope**

- 실제 `@tailwindcss/vite`와 함께 실행한다.
- `@source inline()`으로 전달된 후보가 최종 CSS에 생성되는지 확인한다.
- arbitrary values, container query variant, stacked variant를 포함한다.

**Verification**

- `pnpm --filter @tailwindest/compiler test`
- `pnpm --filter @tailwindest/compiler build`
- e2e에서 generated CSS에 manifest 후보가 포함되는지 assertion.

## Phase 8: Debug and Diagnostics

**Files**

- Create: `packages/compiler/src/debug/diagnostics.ts`
- Create: `packages/compiler/src/debug/manifest_writer.ts`
- Test: `packages/compiler/src/debug/__tests__/diagnostics.test.ts`

**Scope**

- unsupported static value, unsupported merger, variant threshold overflow를 구분한다.
- debug mode에서 `tailwindest.debug.json`을 생성한다.
- replacement span, API kind, candidates, fallback reason을 기록한다.

**Verification**

- strict mode는 compile error를 반환한다.
- loose mode는 fallback code와 warning diagnostic을 반환한다.

## Public API Draft

```ts
export interface TailwindestViteOptions {
    include?: Array<string | RegExp>
    exclude?: Array<string | RegExp>
    mode?: "strict" | "loose"
    debug?: boolean
    variantTableLimit?: number
    cssEntries?: Array<string | RegExp>
    merger?: MergerPolicy
}

export interface CompileResult {
    code: string
    map: SourceMapInput | null
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
    changed: boolean
}
```

## Acceptance Checklist

- `createTools()` public API별 feature case test가 있다.
- dynamic variant complex-edge test가 있다.
- Tailwind v4 integration test가 있다.
- dev/build parity test가 있다.
- strict/loose diagnostic behavior가 문서화되어 있다.
- production bundle에서 tailwindest runtime styler class가 제거된다.
