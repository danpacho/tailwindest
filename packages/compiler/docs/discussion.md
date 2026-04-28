# Tailwindest Compiler Architecture Review

본 문서는 기존 초안의 핵심 결정 사항을 Vite 8, Tailwind CSS 4.2, 현재 `createTools()` runtime 구현 기준으로 검토한 결과다.

## Executive Summary

| 항목                                        | 판정          | 최종 결정                                                                         |
| ------------------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| Dev/Prod shared engine                      | 조건부 타당   | evaluator 공유만으로는 부족하며 resolver, merger, manifest bridge까지 공유해야 함 |
| Tailwind `addUtilities` injection           | 부적합        | `@source inline()` candidate manifest bridge로 대체                               |
| Vite pre-transform만으로 Tailwind scan 유도 | 미보장        | Tailwind v4 CSS transform에 manifest를 명시 주입                                  |
| Collect -> Reverse Execute                  | 타당          | `MagicString` span replacement로 구현하고 ts-morph node mutation은 피함           |
| Two-tier parsing                            | 타당          | Vite hook filter + lexical gate + semantic AST의 3단계로 확장                     |
| Dynamic variants                            | 타당하나 위험 | conflict graph + threshold + fallback/strict error 필요                           |

## 1. Dev/Prod Parity

### 검토 결과

Vite 문서는 dev server가 plugin container를 만들어 build hook을 Rolldown과 유사하게 호출한다고 설명한다. 그러나 dev에서는 `moduleParsed`와 output generation hook이 호출되지 않으며, `configureServer`는 production build에서 호출되지 않는다. 따라서 "같은 Vite plugin을 쓴다"는 사실만으로 100% parity가 보장되지는 않는다.

### 리스크

- dev-only server state가 transform 결과에 영향을 주면 build와 달라진다.
- CSS transform이 JS transform보다 먼저 실행되면 Tailwind manifest가 비어 있을 수 있다.
- style definition 파일 변경 시 consumer module을 invalidate하지 않으면 stale class가 남는다.
- custom merger가 runtime closure이면 build와 dev에서 같은 결과를 보장할 수 없다.
- Next.js, Webpack, Turbopack은 Vite plugin ordering을 공유하지 않는다.

### 최종 결정

Parity 범위는 adapter family 단위로 정의한다.

- Vite parity: `preScan -> transformModule -> injectTailwindSource`가 dev/build에서 같은 engine과 cache 정책을 사용할 때 보장한다.
- Next.js parity: 별도 SWC/Babel/PostCSS adapter가 같은 engine contract를 구현해야 한다.
- shared evaluator는 필요 조건이지 충분 조건이 아니다.

## 2. Tailwind Plugin Integration

### 기존 Option C의 문제

초안의 Option C는 Tailwind plugin API의 `addUtilities` 등에 class를 직접 주입하는 방식이었다. 이 방식은 Tailwindest 목적과 맞지 않는다.

- `addUtilities`는 새 CSS utility를 등록하는 API이지, 기존 Tailwind utility 후보 생성을 요청하는 API가 아니다.
- Tailwind v4는 CSS-first configuration과 automatic source detection을 중심으로 설계되어 있다.
- v4 문서는 safelist가 필요하면 `@source inline()`을 쓰라고 안내한다.
- built-in utility, arbitrary value, variant 조합을 `addUtilities`로 재현하면 Tailwind engine과 semantic drift가 생긴다.

### 최종 통합안

`CandidateManifest`를 CSS transform 단계에서 `@source inline()`으로 삽입한다.

```css
@import "tailwindcss";
@source inline("inline-flex px-2 hover:bg-blue-600");
```

이 방식은 Tailwind가 문서화한 class detection/safelist 경로를 사용한다. 별도 파일 쓰기 없이 Vite transform result로만 처리할 수 있고, Tailwind scanner가 변환된 JS 코드를 보는지 여부에 의존하지 않는다.

### 대안

매우 큰 프로젝트에서 `@source inline()` 문자열이 병목이 되면 `@tailwindcss/node`의 `compile(...).build(candidates)`를 감싸는 전용 Tailwindest CSS plugin을 고려할 수 있다. 다만 이 경로는 `@tailwindcss/vite` 내부 구현과 가까워 유지보수 리스크가 더 크므로 1차 최종안은 아니다.

## 3. AST Transformation Safety

### 검토 결과

Collect -> Reverse Execute는 대규모 파일에서도 안전한 패턴이다. 단, ts-morph node를 직접 계속 mutate하면 source position drift와 memory retention이 생기기 쉽다.

### 최종 규칙

- AST는 detection과 span 계산에만 사용한다.
- replacement는 `{ start, end, text }`로 수집한다.
- apply 단계는 `MagicString`으로 내림차순 실행한다.
- 실패 시 해당 파일의 모든 replacement를 폐기하고 원본을 반환한다.
- source map은 call site 수준을 보장하고, token별 정밀 mapping은 debug manifest로 보완한다.

### 메모리 기준

파일 단위 처리의 목표 memory는 `O(file size + replacement count + candidate count)`다. TypeScript Program은 semantic cache로 공유할 수 있지만, ts-morph SourceFile과 node reference를 장시간 cache하지 않는다.

## 4. Two-Tier Parsing Strategy

### 검토 결과

초안의 2단계 구조는 타당하지만 Vite 8에서는 hook filter까지 포함한 3단계가 더 적절하다.

1. Vite hook filter: 대상 확장자가 아니면 JS handler 호출 자체를 줄인다.
2. Lexical gate: Tailwindest sentinel이 없으면 AST parse를 건너뛴다.
3. Semantic AST: TypeChecker로 실제 `createTools()` symbol과 정적 값 그래프를 검증한다.

### 리스크

- lexical gate가 너무 좁으면 false negative가 생긴다.
- semantic resolver가 import graph를 무한 추적하면 HMR이 느려진다.
- build pre-scan과 transform cache가 따로 놀면 manifest 누락이 발생한다.

### 최종 결정

lexical gate는 false positive를 허용한다. 확신이 없으면 AST로 넘기고, compile 가능성은 semantic 단계에서만 결정한다.

## 5. Dynamic Variants

### 검토 결과

`tw.variants()`를 무조건 full cartesian table로 바꾸면 번들 사이즈가 폭발한다. 반대로 axis별 문자열만 단순 concat하면 현재 runtime의 `deepMerge` override semantics와 달라질 수 있다.

### 최종 알고리즘

1. 각 variant axis가 쓰는 style path set을 계산한다.
2. 겹치는 path가 없는 axis는 additive map으로 emit한다.
3. 겹치는 axis는 conflict component로 묶어 component table을 만든다.
4. component table size가 `variantTableLimit` 이하이면 precompute한다.
5. 초과하면 loose mode fallback 또는 strict mode error.
6. fallback을 남겨도 모든 가능한 class candidate는 Tailwind manifest에 등록한다.

### 예시

```ts
const button = tw.variants({
    base: { display: "inline-flex" },
    variants: {
        size: {
            sm: { padding: "px-2", fontSize: "text-sm" },
            md: { padding: "px-3", fontSize: "text-base" },
        },
        tone: {
            primary: { color: "text-blue-600" },
            danger: { color: "text-red-600" },
        },
    },
})
```

`size`와 `tone`은 style path가 겹치지 않으므로 full table 없이 아래처럼 분해할 수 있다.

```ts
const __base = "inline-flex"
const __size = { sm: "px-2 text-sm", md: "px-3 text-base" } as const
const __tone = { primary: "text-blue-600", danger: "text-red-600" } as const
```

## 6. `createTools()` Coverage Risks

### `join` and `def`

`join`은 `clsx` semantics를 따라야 한다. object dictionary, nested array, falsey value 처리가 runtime과 달라지면 안 된다. 정적 boolean은 fold하고, 동적 boolean은 conditional expression 또는 fallback으로 처리한다.

### `mergeProps` and `mergeRecord`

모든 style argument가 정적이면 완전 컴파일 가능하다. 하나라도 unknown이면 deep merge 결과가 달라질 수 있으므로 fallback이 필요하다.

### `compose`

`compose`는 styler metadata를 갱신하는 compile-time operation으로 취급한다. compose chain이 정적이면 최종 styler만 남기고 중간 styler 생성은 제거한다.

### `style()` methods

`.style()`은 class string이 아니라 style record를 반환한다. 사용처에 따라 object literal이나 lookup object로 치환할 수 있지만, DOM `className` 최적화와 별개다. Tailwind manifest에는 해당 style record 안의 class 후보를 모두 등록한다.

### Merger

custom merger는 가장 큰 정확성 리스크다. build-time에 동일 함수와 동일 config로 실행할 수 없으면 exact compile을 하면 안 된다.

## 7. Final Risk Register

| Risk                                          | Impact               | Mitigation                                 |
| --------------------------------------------- | -------------------- | ------------------------------------------ |
| Tailwind scanner가 transformed JS를 보지 않음 | CSS 누락             | `@source inline()` bridge 사용             |
| CSS transform이 manifest 초기화보다 먼저 실행 | 초기 CSS 누락        | `buildStart`/server start pre-scan         |
| HMR stale manifest                            | dev/prod 불일치      | reverse dependency와 CSS module invalidate |
| custom merger 비결정성                        | class output 불일치  | known/build-time merger만 exact compile    |
| variant cartesian explosion                   | bundle bloat         | conflict graph, threshold, fallback        |
| source map 과도 요구                          | 구현 복잡도 증가     | call-site map + debug manifest             |
| unsupported static value silent skip          | runtime/CSS mismatch | strict diagnostic, loose fallback          |

## Final Architecture Decision

최종 아키텍처는 "shared evaluator + semantic static resolver + Vite transform + Tailwind `@source inline()` manifest bridge"다. 이 조합만이 현재 Tailwind v4의 공식 source detection 모델과 Vite 8 plugin pipeline에서 Dev to Debug to Build 경로를 모두 설명할 수 있다.
