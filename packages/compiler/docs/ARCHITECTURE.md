# Tailwindest Compiler Final Architecture

`@tailwindest/compiler`는 `createTools()` 기반의 타입 안전한 객체 스타일을 빌드 타임에 해석하고, 가능한 모든 호출을 정적 Tailwind 클래스 문자열 또는 정적 lookup 구조로 치환하는 zero-runtime 컴파일러다. 이 문서는 Vite 8과 Tailwind CSS 4.2 기준의 최종 아키텍처를 정의한다.

## 기준 레퍼런스

- Vite 8 Plugin API: https://vite.dev/guide/api-plugin
- Tailwind CSS v4 class detection: https://tailwindcss.com/docs/detecting-classes-in-source-files
- Tailwind CSS v4 functions/directives: https://tailwindcss.com/docs/functions-and-directives
- Tailwind CSS v4 Vite installation: https://tailwindcss.com/docs/installation/using-vite
- Tailwind CSS v4 custom styles: https://tailwindcss.com/docs/adding-custom-styles

## 결론

기존 초안의 `addUtilities` 직접 주입 방식은 최종안에서 제외한다. Tailwind v4의 기본 경로는 CSS-first 설정, 자동 source detection, `@source inline()` safelist이며, `addUtilities`는 v3 호환 JavaScript plugin 영역에 가까워 Tailwindest가 생성한 기존 Tailwind utility 후보를 전달하는 공식 인터페이스로 쓰기 어렵다.

최종 통합 방식은 다음 두 레이어다.

1. `tailwindest:transform`: TS/JS/TSX/JSX 파일을 Vite `transform` 훅에서 정적 치환한다.
2. `tailwindest:source`: Tailwind CSS 입력 CSS에 `@source inline(...)` manifest를 주입해 Tailwind v4 Oxide가 생성 후보를 확정적으로 보게 한다.

이 구조는 변환된 JS 코드가 Tailwind scanner에 다시 들어간다는 미보장 가정에 의존하지 않는다. Tailwind v4의 Vite plugin은 CSS 파일 transform 단계에서 source scanner와 candidate build를 실행하므로, Tailwindest 후보는 CSS 입력으로 명시 노출해야 한다.

## 전체 파이프라인

```text
Project source files
        |
        v
tailwindest pre-scan
  - source roots 탐색
  - 정적 createTools 사용처 분석
  - candidate registry 초기화
        |
        +------------------------------+
        |                              |
        v                              v
Vite JS transform                 Vite CSS transform
tailwindest:transform             tailwindest:source
  - hook filter                    - Tailwind CSS entry 감지
  - fast lexical gate              - @source inline(...) 삽입
  - AST + semantic detection       - source map 유지
  - shared evaluator               |
  - collect -> reverse replace     v
  - class literal / lookup emit    @tailwindcss/vite
        |                          - Oxide scanner
        |                          - candidates + inline source build
        +--------------+-----------+
                       |
                       v
             Browser receives static class strings
```

## Vite 8 Integration

### Plugin Composition

사용자는 `tailwindest()`를 `tailwindcss()`보다 앞에 둔다.

```ts
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { tailwindest } from "@tailwindest/compiler/vite"

export default defineConfig({
    plugins: [tailwindest(), tailwindcss()],
})
```

Vite는 user plugin 중 `enforce: "pre"`를 core plugin보다 먼저 실행한다. `@tailwindcss/vite`도 내부적으로 `enforce: "pre"` CSS transform을 사용하므로 같은 pre 그룹 안에서 plugin 배열 순서가 중요하다. `tailwindest()`는 `tailwindcss()`보다 앞에 있어야 한다.

### Plugin Shape

```ts
export function tailwindest(options: TailwindestViteOptions = {}): Plugin[] {
    const ctx = createCompilerContext(options)

    return [
        {
            name: "tailwindest:transform",
            enforce: "pre",
            configResolved(config) {
                ctx.configure(config)
            },
            buildStart() {
                return ctx.preScan()
            },
            transform: {
                filter: {
                    id: /\.[cm]?[jt]sx?(?:\?.*)?$/,
                },
                async handler(code, id) {
                    return ctx.transformModule(code, id)
                },
            },
            async hotUpdate(hmr) {
                return ctx.updateModule(hmr)
            },
        },
        {
            name: "tailwindest:source",
            enforce: "pre",
            transform: {
                filter: {
                    id: /\.css(?:\?.*)?$/,
                },
                handler(code, id) {
                    return ctx.injectTailwindSource(code, id)
                },
            },
        },
    ]
}
```

Vite 8 문서는 hook filter가 Rust와 JavaScript 런타임 간 불필요한 hook 호출을 줄인다고 설명한다. 따라서 `transform.filter`를 1차 필터로 두고, handler 내부에서도 include/exclude를 다시 확인한다.

## Tailwind v4 Integration

### Accepted Interface

Tailwindest가 Tailwind v4에 전달하는 데이터는 utility CSS가 아니라 candidate class name 목록이다.

```ts
interface CandidateManifest {
    version: 1
    byFile: Map<string, FileCandidateRecord>
    all: Set<string>
    revision: number
}

interface FileCandidateRecord {
    id: string
    hash: string
    candidates: string[]
    diagnostics: CompilerDiagnostic[]
}
```

`tailwindest:source`는 Tailwind CSS entry에 아래 형태를 삽입한다.

```css
@source inline("bg-blue-500 hover:bg-blue-600 px-2");
```

후보가 많으면 brace expansion으로 압축한다.

```css
@source inline("{hover:,focus:,}underline");
```

Tailwind v4 문서는 source detection에서 제외되는 파일, `source()` base path, `@source inline()` safelist를 공식 경로로 제공한다. 따라서 이 방식은 v4 기본 동작과 충돌하지 않는다.

### Rejected Interface

`addUtilities` 직접 주입은 최종안에서 사용하지 않는다.

- Tailwindest가 생성하는 것은 새 CSS utility 정의가 아니라 이미 존재하는 Tailwind utility 후보이다.
- Tailwind v4는 CSS-first 설정을 권장하고, custom utility는 `@utility`로 정의한다.
- JavaScript plugin은 `@plugin`으로 로드 가능한 호환 경로지만, class detection 문제를 해결하는 기본 인터페이스가 아니다.
- `addUtilities`로 built-in 후보를 흉내내면 theme, variant, arbitrary value, dynamic utility 처리와 충돌할 수 있다.

## Shared Evaluation Engine

Dev와 Prod parity는 "동일한 evaluator 함수"만으로는 보장되지 않는다. 최종 보장 조건은 다음이다.

1. Dev server와 production build가 같은 `evaluateStyleGraph()`를 호출한다.
2. 같은 TypeScript semantic resolver와 같은 compiler options를 사용한다.
3. 같은 merger policy를 사용한다.
4. Tailwind 후보 노출이 양쪽 모두 `CandidateManifest -> @source inline()` 경로를 지난다.
5. HMR은 style dependency 변경 시 영향받는 JS module과 CSS module을 함께 invalidate한다.

```ts
interface EvaluationEngine {
    evaluateStyle(input: StaticStyleObject): EvaluatedStyle
    mergeRecord(styles: StaticStyleObject[]): StaticStyleObject
    mergeProps(styles: StaticStyleObject[], merger: MergerPolicy): string
    join(values: StaticClassValue[], merger: MergerPolicy): string
    def(
        classList: StaticClassValue[],
        styles: StaticStyleObject[],
        merger: MergerPolicy
    ): string
}
```

`MergerPolicy`는 정확성의 핵심이다.

```ts
type MergerPolicy =
    | { kind: "none" }
    | { kind: "known"; name: "tailwind-merge"; configHash: string }
    | {
          kind: "custom"
          evaluateAtBuildTime: true
          moduleId: string
          exportName: string
      }
    | { kind: "unsupported" }
```

`unsupported` merger가 포함된 호출은 strict mode에서 compile error, loose mode에서 runtime fallback으로 처리한다.

### Style Object Variant Semantics

Tailwindest style object key paths are semantic for known Tailwind variant
keys. Property keys such as `backgroundColor`, `padding`, and arbitrary grouping
keys do not create class prefixes, but variant keys such as `dark`, `hover`,
responsive breakpoints, `@...` container variants, and arbitrary variants such
as `[&>*]` accumulate prefixes for every string leaf below them.

```ts
tw.style({
    dark: {
        backgroundColor: "bg-red-900",
        hover: { backgroundColor: "bg-red-950" },
    },
    backgroundColor: "bg-red-50",
}).class()
// "dark:bg-red-900 dark:hover:bg-red-950 bg-red-50"
```

Explicitly prefixed leaves remain supported. If a leaf already starts with the
full accumulated prefix it is left unchanged; if it starts with a suffix of the
path, only the missing parent variants are prepended. Unknown object keys remain
grouping keys by default.

Nested Tailwind variant keys are canonical syntax. Explicitly prefixed class
strings remain valid and are not double-prefixed, but tests must prefer nested
variant syntax for new fixtures.

## `createTools()` Compile Surface

컴파일러는 `packages/tailwindest/src/tools/create_tools.ts`의 public surface를 기준으로 한다.

| API                                      | 정적 입력       | 동적 입력                                | 출력            |
| ---------------------------------------- | --------------- | ---------------------------------------- | --------------- |
| `tw.style(obj).class(...extra)`          | string literal  | conditional/lookup 또는 fallback         | class string    |
| `tw.style(obj).style(...extra)`          | object literal  | conditional object 또는 fallback         | style record    |
| `tw.style(obj).compose(...styles)`       | styler folding  | fallback                                 | styler metadata |
| `tw.toggle({...}).class(condition)`      | selected string | ternary 또는 lookup                      | class string    |
| `tw.toggle({...}).style(condition)`      | selected object | ternary object 또는 fallback             | style record    |
| `tw.rotary({ variants }).class(key)`     | selected string | lookup                                   | class string    |
| `tw.rotary({ variants }).style(key)`     | selected object | lookup object 또는 fallback              | style record    |
| `tw.variants({ variants }).class(props)` | selected string | optimized lookup/partial lookup/fallback | class string    |
| `tw.variants({ variants }).style(props)` | selected object | optimized lookup/fallback                | style record    |
| `tw.join(...classList)`                  | string literal  | clsx-compatible expression or fallback   | class string    |
| `tw.def(classList, ...styles)`           | string literal  | conditional/fallback                     | class string    |
| `tw.mergeProps(...styles)`               | string literal  | fallback unless all style args static    | class string    |
| `tw.mergeRecord(...styles)`              | object literal  | fallback unless all style args static    | style record    |

컴파일 가능성은 호출 이름이 아니라 symbol identity로 판단한다. 변수명이 `tw`가 아니어도 `createTools()` 반환값이면 컴파일 대상이고, `tw`라는 이름의 다른 라이브러리는 대상이 아니다.

## Static Resolver Contract

정적으로 평가 가능한 값:

- object literal, array literal, string literal, boolean literal, number literal
- `as const`, `satisfies`, type-only wrapper
- 같은 module의 `const` 바인딩
- import된 `const` object/string 중 순환 참조가 없고 side effect가 없는 값
- 정적으로 접을 수 있는 `compose`, `mergeRecord`, `mergeProps`, `join`, `def`

정적으로 평가하지 않는 값:

- function call 결과, getter, class instance, `Date`, `Math.random`, `process.env`
- mutation 이후의 객체
- unknown spread
- unsupported custom merger
- control-flow에 따라 값이 달라지는 binding

strict mode는 위 값을 만나면 진단을 발생시키고 변환하지 않는다. loose mode는 해당 호출만 runtime fallback으로 남기되, 확인 가능한 후보는 manifest에 등록한다.

## Substitution Strategy

AST 치환은 `Collect -> Reverse Execute` 패턴을 사용한다.

1. AST를 순회하며 replacement candidate를 수집한다.
2. 각 candidate에 source span, replacement text, generated candidates, diagnostics를 기록한다.
3. 겹치는 span은 가장 바깥쪽 치환 또는 더 높은 확신도의 치환 하나만 선택한다.
4. source offset 내림차순으로 `MagicString`에 적용한다.
5. source map과 manifest를 함께 반환한다.

대규모 파일 안정성 기준:

- 파일 단위 `Project`를 오래 보관하지 않는다.
- memory는 `O(file size + replacement count + candidate count)`에 가깝게 유지한다.
- TypeScript `Program`/language service는 semantic cache로만 쓰고, text rewrite는 span 기반으로 수행한다.
- 한 파일의 replacement가 실패하면 해당 파일 전체를 원본 코드로 반환하고 diagnostic만 emit한다.

## Two-Tier Parsing

최종 구조는 실제로 세 단계다.

1. Hook filter: 확장자와 query로 Vite hook 호출 자체를 줄인다.
2. Fast lexical gate: `createTools`, `.style(`, `.variants(`, `.toggle(`, `.rotary(`, `.join(`, `.def(`, `.mergeProps(`, `.mergeRecord(` 중 하나도 없으면 즉시 skip한다.
3. AST + semantic analysis: TypeChecker로 `createTools()` 출처, alias, import chain, static value graph를 확인한다.

Fast path는 false positive를 허용하지만 false negative를 만들면 안 된다. 확신이 없으면 AST로 넘긴다.

## Dynamic Variant Optimization

`tw.variants()`는 full cartesian table을 기본값으로 만들지 않는다. 우선 conflict graph를 만든다.

```text
axis A writes style paths: color, padding.x
axis B writes style paths: fontWeight
axis C writes style paths: color

conflict components:
  [A, C] -> table 필요
  [B]    -> additive map 가능
```

최적화 순서:

1. Base style은 항상 별도 상수로 hoist한다.
2. 서로 다른 style path만 쓰는 axis는 additive class map으로 만든다.
3. 같은 style path를 쓰는 axis끼리는 connected component별 table을 만든다.
4. component table 크기가 threshold 이하이면 precomputed table로 emit한다.
5. threshold를 넘으면 partial dynamic resolver로 전환하고 모든 가능한 class 후보를 manifest에 등록한다.
6. strict zero-runtime mode에서는 threshold 초과나 unsupported dynamic path를 compile error로 처리할 수 있다.

```ts
const size = {
    sm: "px-2 text-sm",
    md: "px-3 text-base",
} as const

const toneBySizeAndIntent = {
    "sm|primary": "text-blue-600",
    "sm|danger": "text-red-600",
    "md|primary": "text-blue-700",
    "md|danger": "text-red-700",
} as const

className={[
    "inline-flex",
    size[props.size],
    toneBySizeAndIntent[`${props.size}|${props.intent}`],
].filter(Boolean).join(" ")}
```

생성 코드는 bundler가 tree-shaking할 수 있도록 pure const와 module-local helper만 사용한다.

## HMR and Cache Invalidation

Registry key는 normalized path와 content hash다.

```ts
interface CompilerCache {
    files: Map<string, FileCacheEntry>
    reverseDeps: Map<string, Set<string>>
    manifestRevision: number
}

interface FileCacheEntry {
    id: string
    hash: string
    dependencies: string[]
    replacements: Replacement[]
    candidates: string[]
}
```

HMR 처리:

1. 변경 파일의 hash를 계산한다.
2. 직접 파일과 reverse dependency를 dirty로 표시한다.
3. dirty 파일만 다시 분석한다.
4. manifest revision이 바뀌면 Tailwind CSS entry module을 invalidate한다.
5. style definition 변경으로 JS 치환 결과가 바뀌면 영향받는 JS module도 invalidate한다.

Stale style이 한 번이라도 발생하면 parity 실패로 간주한다.

## Debuggability

Zero-runtime이어도 debug 경로는 필요하다.

- `debug: true`에서 `tailwindest.debug.json` manifest를 생성한다.
- 각 replacement는 원본 파일, span, API kind, generated class list를 기록한다.
- source map은 call site 기준 mapping을 제공한다.
- Vite 환경에서는 `vite-plugin-inspect`로 Tailwindest transform 결과를 확인할 수 있어야 한다.

원본 object property 하나하나를 문자열 내부 token과 1:1로 source-map 연결하는 것은 기술적으로 과도하다. 최종 요구사항은 "call site와 replacement 원인을 추적 가능"으로 둔다.

## Framework Scope

Vite 8은 1차 타겟이다. Next.js는 shared engine을 재사용할 수 있지만 Vite plugin parity를 자동으로 상속하지 않는다.

- Vite: `tailwindest:transform + tailwindest:source + @tailwindcss/vite`
- PostCSS/Tailwind CLI: CSS 입력에 `@source inline()`을 삽입하는 PostCSS adapter 또는 sidecar CSS 필요
- Next.js/Webpack/Turbopack: SWC/Babel transform adapter와 CSS manifest adapter 필요

따라서 "100% Dev/Prod parity"는 같은 adapter family 안에서만 보장한다.

## Success Criteria

- 컴파일된 production JS bundle에 `PrimitiveStyler`, `ToggleStyler`, `RotaryStyler`, `VariantsStyler`가 남지 않는다.
- Tailwind CSS output에는 manifest의 모든 class candidate가 반영된다.
- 동일 fixture를 dev transform과 build transform에 통과시켰을 때 code, manifest, diagnostics가 동일하다.
- HMR에서 style definition 변경 후 JS module과 CSS module이 모두 갱신된다.
- unsupported dynamic path는 silent miscompile 없이 diagnostic 또는 fallback으로 처리된다.
