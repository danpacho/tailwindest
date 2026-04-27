# Phase 2: TokenAnalyzer 구현

> **선행 조건**: Phase 1 APPROVED (CSSPropertyResolver 사용 가능)
> **산출물**: `TokenAnalyzer` 모듈 (`analyze`, `buildObjectTree`), 단위 테스트 전체 통과
> **사이드 이펙트 경계**: `create-tailwind-type` 패키지에 대한 변경 **없음**. 이 Phase의 모든 코드는 `css-transformer` 패키지 내부에서만 작성됩니다.

---

## 1. 목적

Tailwind 클래스 문자열을 `tailwindest` 형태의 중첩 객체 트리로 변환하는 **TokenAnalyzer**를 구현합니다.

이 Phase가 완료되면:

- `"dark:hover:bg-accent flex text-sm"` → `{ dark: { hover: { backgroundColor: "dark:hover:bg-accent" } }, display: "flex", fontSize: "text-sm" }` 변환이 가능합니다.
- Walker(Phase 3)가 Analyzer를 주입받아 문자열 → 객체 변환을 수행할 수 있습니다.

---

## 2. 패키지 초기화

### 2.1 `css-transformer` 패키지 셋업

```
packages/css-transformer/
  package.json          [NEW]
  tsconfig.json         [NEW]
  src/
    index.ts            [NEW]  — public API export
    analyzer/
      token_analyzer.ts [NEW]  — TokenAnalyzer 구현체
      split_utils.ts    [NEW]  — splitByColon 등 파싱 유틸리티
      index.ts          [NEW]  — analyzer 모듈 export
    types/
      index.ts          [NEW]  — ParsedToken 등 공유 타입
  tests/
    analyzer/
      token_analyzer.test.ts  [NEW]
      split_utils.test.ts     [NEW]
  docs/                 — 기존 아키텍처 문서
```

**의존성**:

```json
{
    "dependencies": {
        "ts-morph": "^24.0.0"
    },
    "devDependencies": {
        "vitest": "^2.0.0",
        "typescript": "^5.5.0"
    },
    "peerDependencies": {
        "create-tailwind-type": "workspace:*"
    }
}
```

> `create-tailwind-type`은 `peerDependency`로 선언합니다. `CSSPropertyResolver`를 직접 import하되, 패키지 간 결합을 최소화합니다.

---

## 3. 작업 항목

### 3.1 공유 타입 정의

**파일**: `src/types/index.ts`

```ts
export interface ParsedToken {
    original: string // "hover:bg-accent"
    utility: string // "bg-accent"
    property: string | null // "backgroundColor" or null
    variants: string[] // ["hover"]
    warning?: string // 해석 불가 시 메시지
}
```

### 3.2 파싱 유틸리티

**파일**: `src/analyzer/split_utils.ts`

| 함수                                    | 책임                                     | Edge Case                                                                          |
| --------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `splitByColon(token)`                   | `:`로 분리하되 `[...]` 내부의 `:`는 보호 | `"[&:hover]:text-sm"` → `["[&:hover]", "text-sm"]`                                 |
| `splitClassString(input)`               | 공백 기준 분해 + 빈 문자열 필터링        | `"  flex   items-center  "` → `["flex", "items-center"]`                           |
| `extractVariants(token, knownVariants)` | Variant와 utility 분리                   | `"dark:hover:bg-accent"` → `{ variants: ["dark", "hover"], utility: "bg-accent" }` |

**`splitByColon` 핵심 구현**:

```ts
export function splitByColon(token: string): string[] {
    const segments: string[] = []
    let current = ""
    let bracketDepth = 0

    for (const char of token) {
        if (char === "[") bracketDepth++
        if (char === "]") bracketDepth--
        if (char === ":" && bracketDepth === 0) {
            segments.push(current)
            current = ""
        } else {
            current += char
        }
    }
    segments.push(current)
    return segments
}
```

### 3.3 TokenAnalyzer 구현

**파일**: `src/analyzer/token_analyzer.ts`

```ts
import { CSSPropertyResolver } from "create-tailwind-type/generator/css_property_resolver";
import type { ParsedToken } from "../types";
import { splitClassString, extractVariants } from "./split_utils";

export class TokenAnalyzerImpl implements TokenAnalyzer {
  constructor(
    private readonly resolver: CSSPropertyResolver,
    private readonly groupPrefix: string = ""
  ) {}

  analyze(classNames: string | string[]): ParsedToken[] { ... }
  buildObjectTree(tokens: ParsedToken[]): Record<string, any> { ... }
}
```

**`analyze` 로직**:

1. 입력이 문자열이면 `splitClassString`으로 배열화
2. 각 토큰에 대해 `extractVariants` → utility/variants 분리
3. `resolver.resolveUnambiguous(utility)` → property 해석
4. 해석 불가 시 `warning` 필드에 메시지 기록, `property: null`

**`buildObjectTree` 로직** (키 충돌 3계층 정책):

1. Variant 경로를 따라 중첩 객체 생성
2. 리프 노드 할당 시:
    - 기존 값 없음 → 직접 할당
    - 기존 값이 문자열 → 배열로 승격 `[existing, new]` + 경고
    - 기존 값이 배열 → push
3. `groupPrefix`가 있으면 variant 키에 접두사 적용

---

## 4. 단위 테스트

### 4.1 `split_utils.test.ts`

| 테스트 케이스     | 입력                            | 기대 결과                                               |
| ----------------- | ------------------------------- | ------------------------------------------------------- |
| 기본 분리         | `"dark:hover:bg-accent"`        | `["dark", "hover", "bg-accent"]`                        |
| Arbitrary variant | `"[&:hover]:text-sm"`           | `["[&:hover]", "text-sm"]`                              |
| Arbitrary value   | `"bg-[color:red]"`              | `["bg-[color:red]"]` (분리 없음)                        |
| 중첩 bracket      | `"[&>[data-slot=icon]]:size-4"` | `["[&>[data-slot=icon]]", "size-4"]`                    |
| 빈 문자열         | `""`                            | `[""]`                                                  |
| 공백 분해         | `"  flex   items-center  "`     | `["flex", "items-center"]`                              |
| Variant 추출      | `"dark:hover:bg-accent"`        | `{ variants: ["dark", "hover"], utility: "bg-accent" }` |

### 4.2 `token_analyzer.test.ts`

| 테스트 케이스       | 검증 대상                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| 기본 변환           | `"flex"` → `{ display: "flex" }`                                          |
| 단일 Variant        | `"hover:bg-accent"` → `{ hover: { backgroundColor: "hover:bg-accent" } }` |
| 다중 Variant        | `"dark:hover:bg-accent"` → 2단 중첩                                       |
| 복합 입력           | `"flex hover:bg-accent text-sm"` → 3개 키                                 |
| 해석 불가 토큰      | `"unknown-xyz"` → `property: null`, `warning` 존재                        |
| 키 충돌 (배열 승격) | `"p-4 p-2"` → 배열 또는 후자 우선                                         |
| Group Prefix        | prefix `"$"` + `"hover:bg-accent"` → `{ $hover: { ... } }`                |
| 빈 입력             | `""` → `{}`                                                               |

> ⚠️ Resolver 의존성이 있으므로, 테스트에서는 **mock Resolver**를 주입합니다. Phase 1의 `PropertyResolverDeps`를 mock하여 `CSSPropertyResolver`를 생성하거나, Resolver 인터페이스를 abstract로 정의하여 테스트용 구현체를 사용합니다.

---

## 5. 산출물 체크리스트

- [ ] `packages/css-transformer/package.json` — 패키지 초기화
- [ ] `src/types/index.ts` — `ParsedToken` 인터페이스
- [ ] `src/analyzer/split_utils.ts` — `splitByColon`, `splitClassString`, `extractVariants`
- [ ] `src/analyzer/token_analyzer.ts` — `TokenAnalyzerImpl` 클래스
- [ ] `src/analyzer/index.ts` — 모듈 export
- [ ] `tests/analyzer/split_utils.test.ts` — 7+ 케이스
- [ ] `tests/analyzer/token_analyzer.test.ts` — 8+ 케이스
- [ ] **모든 신규 테스트 통과**
- [ ] **`create-tailwind-type` 패키지에 변경 없음**

---

## 6. 완료 조건 (Exit Criteria)

1. `css-transformer` 패키지 내 `npm test` → 전체 통과.
2. `create-tailwind-type` 패키지의 테스트에 **영향 없음** (파일 변경 0).
3. `TokenAnalyzerImpl`이 `CSSPropertyResolver`를 생성자 주입으로 받아 동작.
4. `splitByColon`이 arbitrary variant/value 내부의 `:`를 올바르게 보호.
5. `buildObjectTree`에서 키 충돌 시 배열 승격 + 경고 메시지 생성.
