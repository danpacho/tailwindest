# Token Analyzer (매핑 엔진) 설계 상세

이 문서는 Tailwind 클래스 문자열 리터럴을 `tailwindest`의 객체 형태로 매핑하는 **Token Analyzer**의 아키텍처 상세를 정의합니다.

## 1. 목적 및 철학

Token Analyzer의 유일한 책임은 문자열(예: `"hover:bg-accent"`)을 입력받아, 이를 정확히 어느 CSS Property(예: `backgroundColor`)와 어느 Variant(예: `hover`)에 할당해야 하는지 식별하고, 최종적으로 `tailwindest` 형태의 중첩 객체 트리를 조립하는 것입니다.

속성 해석(Property Resolution)은 **별도 분리된 `CSSPropertyResolver`에 위임**합니다. Analyzer는 문자열 분해, Variant 추출, 트리 조립에만 집중합니다.

> 👉 속성 해석 엔진의 상세: [CSS Property Resolver 상세 설계](./details_resolver.md)

---

## 2. 아키텍처 및 인터페이스

### 2.1 코어 인터페이스

```ts
export interface ParsedToken {
    /**
     * 원본 유틸리티 문자열 (Variant 포함)
     * @example "hover:bg-accent", "dark:focus:text-sm"
     */
    original: string

    /**
     * Variant가 제거된 순수 유틸리티
     * @example "bg-accent", "text-sm"
     */
    utility: string

    /**
     * 파싱된 CSS 속성명 (CSSPropertyResolver를 통해 해석됨)
     * @example "backgroundColor", "fontSize"
     */
    property: string

    /**
     * 적용된 변형(Variant) 배열.
     * 순서가 보장되어야 중첩 객체 생성이 정확합니다.
     * @example ["dark", "hover"], ["sm", "focus"]
     */
    variants: string[]

    /**
     * 해석 실패 시의 경고 정보.
     * property가 null일 수 있는 경우를 대비합니다.
     */
    warning?: string
}

export interface TokenAnalyzer {
    /**
     * 클래스 문자열 리스트를 받아 파싱된 토큰으로 반환합니다.
     *
     * @param classNames - 공백 구분 문자열 또는 개별 클래스 배열
     * @returns 파싱된 토큰 배열. 해석 불가 토큰은 warning 필드가 채워집니다.
     *
     * @example
     * analyzer.analyze("hover:bg-accent flex text-sm")
     * // → [
     * //   { original: "hover:bg-accent", utility: "bg-accent",
     * //     property: "backgroundColor", variants: ["hover"] },
     * //   { original: "flex", utility: "flex",
     * //     property: "display", variants: [] },
     * //   { original: "text-sm", utility: "text-sm",
     * //     property: "fontSize", variants: [] },
     * // ]
     */
    analyze(classNames: string | string[]): ParsedToken[]

    /**
     * 파싱된 토큰들을 바탕으로 최종 tailwindest 형태의 중첩 객체를 생성합니다.
     * 키 충돌 처리 정책이 적용됩니다.
     *
     * @see Section 4. 키 충돌(Key Collision) 처리 정책
     */
    buildObjectTree(tokens: ParsedToken[]): Record<string, any>
}
```

### 2.2 생성자 — `CSSPropertyResolver` 주입

```ts
export class TokenAnalyzerImpl implements TokenAnalyzer {
    private readonly resolver: CSSPropertyResolver
    private readonly groupPrefix: string

    /**
     * @param resolver - DI로 주입받은 속성 해석 엔진
     * @param groupPrefix - tailwindest 설정의 Variant 그룹 접두사 (e.g., "$", "#")
     */
    constructor(resolver: CSSPropertyResolver, groupPrefix: string = "") {
        this.resolver = resolver
        this.groupPrefix = groupPrefix
    }
}
```

---

## 3. 파싱 프로세스 (The Parsing Process)

### 3.1 단계별 흐름

```
입력: "dark:hover:bg-accent text-sm focus-visible:ring-1 unknown-class"
                          │
                   ┌──────▼──────┐
                   │  1. Split   │  공백 기준 분해
                   └──────┬──────┘
                          │
          ┌───────────────┼───────────────┬──────────────────┐
          ▼               ▼               ▼                  ▼
  "dark:hover:bg-accent" "text-sm" "focus-visible:ring-1" "unknown-class"
          │               │               │                  │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐   ┌──────▼──────┐
   │ 2. Extract  │ │ 2. Extract  │ │ 2. Extract  │   │ 2. Extract  │
   │  Variants   │ │  Variants   │ │  Variants   │   │  Variants   │
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   └──────┬──────┘
          │               │               │                  │
   variants:       variants:       variants:          variants:
   ["dark","hover"]  []           ["focus-visible"]    []
   utility:        utility:       utility:            utility:
   "bg-accent"     "text-sm"     "ring-1"            "unknown-class"
          │               │               │                  │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐   ┌──────▼──────┐
   │ 3. Resolve  │ │ 3. Resolve  │ │ 3. Resolve  │   │ 3. Resolve  │
   │ (Resolver)  │ │ (Resolver)  │ │ (Resolver)  │   │ (Resolver)  │
   └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   └──────┬──────┘
          │               │               │                  │
  "backgroundColor"  "fontSize"    "ringWidth"          null ⚠️
```

### 3.2 Variant 추출 알고리즘

Tailwind의 Variant는 `:` 구분자로 체이닝됩니다. **마지막 세그먼트가 유틸리티**이고, 그 앞은 모두 Variant입니다.

```ts
function extractVariants(
    token: string,
    knownVariants: Set<string>
): { variants: string[]; utility: string } {
    const segments = splitByColon(token) // ":"로 분리 (arbitrary value 내부의 ":"은 무시)

    // 역순으로 Variant 경계를 탐색
    // "focus-visible:ring-1" → segments = ["focus-visible", "ring-1"]
    // "dark:hover:bg-accent" → segments = ["dark", "hover", "bg-accent"]

    let utilityStartIndex = segments.length - 1

    // 마지막 세그먼트부터 역순으로, 알려진 variant가 아닌 것이 유틸리티
    // (이미 마지막이 유틸리티라는 가정)

    return {
        variants: segments.slice(0, utilityStartIndex),
        utility: segments.slice(utilityStartIndex).join(":"),
    }
}
```

> ⚠️ **Edge Case — Arbitrary Variant**: `[&:nth-child(2)]:bg-red-500` 같은 arbitrary variant는 `[...]` 내부의 `:`를 분리하지 않도록 주의해야 합니다.

```ts
/**
 * Arbitrary value/variant 내부의 ":"를 보호하면서 분리합니다.
 * - "dark:hover:bg-[color:red]" → ["dark", "hover", "bg-[color:red]"]
 * - "[&:hover]:text-sm" → ["[&:hover]", "text-sm"]
 */
function splitByColon(token: string): string[] {
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

### 3.3 Property Resolution 위임

```ts
// TokenAnalyzerImpl 내부
private resolveProperty(utility: string): { property: string | null; warning?: string } {
  const result = this.resolver.resolveUnambiguous(utility);

  if (result === null) {
    return {
      property: null,
      warning: `Cannot resolve property for utility "${utility}". Original class will be preserved.`,
    };
  }

  return { property: result };
}
```

---

## 4. 키 충돌(Key Collision) 처리 정책

### 4.1 문제 정의

같은 CSS property에 대해 여러 유틸리티가 존재할 때 `buildObjectTree`에서 충돌이 발생합니다:

```ts
// 입력: "p-4 px-2 py-1"
// 만약 세 가지 모두 property가 "padding"으로 해석된다면?
```

### 4.2 해소 전략

`tailwindest`의 타입 시스템을 기반으로 세 가지 계층의 해소 전략을 적용합니다:

**계층 1: 타입 시스템 분리 (가장 우선)**

`tailwindest`는 `padding`, `paddingX`, `paddingY`, `paddingTop` 등을 **독립 키**로 가집니다. `CSSPropertyResolver`가 정확한 키를 반환하면 충돌 자체가 발생하지 않습니다.

```ts
// p-4 → property: "padding"
// px-2 → property: "paddingX"  (Resolver가 방향 분리)
// py-1 → property: "paddingY"

// 결과: 충돌 없음
{ padding: "p-4", paddingX: "px-2", paddingY: "py-1" }
```

**계층 2: 배열 합성 (Same Property)**

동일 property에 대해 여러 값이 존재하고, `tailwindest` 타입이 배열을 허용하는 경우:

```ts
// border → property: "borderWidth"
// border-2 → property: "borderWidth"

// 결과: 배열로 합성
{
    borderWidth: ["border", "border-2"]
}
```

**계층 3: 후자 우선 (Last-Write-Wins) + 경고**

위 전략으로 해소되지 않는 진정한 충돌의 경우, **후자가 전자를 덮어쓰고 경고를 발생**시킵니다:

```ts
// bg-red-500 → "backgroundColor"
// bg-blue-300 → "backgroundColor"

// 결과: 마지막 값만 유지 + 경고
{
    backgroundColor: "bg-blue-300"
}
// ⚠️ Warning: "bg-red-500" was overridden by "bg-blue-300" for property "backgroundColor"
```

### 4.3 구현

```ts
buildObjectTree(tokens: ParsedToken[]): Record<string, any> {
  const root: Record<string, any> = {};
  const collisionWarnings: string[] = [];

  for (const token of tokens) {
    if (!token.property) continue; // 해석 실패 토큰은 skip

    // Variant 경로 순회하며 중첩 객체 생성
    let current = root;
    for (const variant of token.variants) {
      const key = this.groupPrefix
        ? `${this.groupPrefix}${variant}`
        : variant;

      if (!current[key] || typeof current[key] === "string") {
        current[key] = {};
      }
      current = current[key] as Record<string, any>;
    }

    // 리프 노드 할당 (충돌 처리)
    const existing = current[token.property];
    if (existing !== undefined) {
      if (Array.isArray(existing)) {
        existing.push(token.original);
      } else if (typeof existing === "string") {
        // 배열로 승격
        current[token.property] = [existing, token.original];
        collisionWarnings.push(
          `Property "${token.property}" has multiple values: "${existing}" and "${token.original}"`
        );
      }
    } else {
      current[token.property] = token.original;
    }
  }

  return root;
}
```

---

## 5. 입출력 예시

### 5.1 기본 케이스

**입력:** `"flex hover:bg-accent dark:text-white"`

**분석 결과:**

```json
[
    {
        "original": "flex",
        "utility": "flex",
        "property": "display",
        "variants": []
    },
    {
        "original": "hover:bg-accent",
        "utility": "bg-accent",
        "property": "backgroundColor",
        "variants": ["hover"]
    },
    {
        "original": "dark:text-white",
        "utility": "text-white",
        "property": "color",
        "variants": ["dark"]
    }
]
```

**조립된 객체 트리:**

```ts
{
  display: "flex",
  hover: {
    backgroundColor: "hover:bg-accent"
  },
  dark: {
    color: "dark:text-white"
  }
}
```

### 5.2 다중 Variant 중첩 케이스

**입력:** `"dark:hover:bg-accent sm:focus:ring-2"`

**조립된 객체 트리:**

```ts
{
  dark: {
    hover: {
      backgroundColor: "dark:hover:bg-accent"
    }
  },
  sm: {
    focus: {
      ringWidth: "sm:focus:ring-2"
    }
  }
}
```

### 5.3 해석 실패 케이스

**입력:** `"flex some-unknown-class text-sm"`

**분석 결과:**

```json
[
    { "original": "flex", "property": "display", "variants": [] },
    {
        "original": "some-unknown-class",
        "property": null,
        "variants": [],
        "warning": "Cannot resolve property for utility \"some-unknown-class\"."
    },
    { "original": "text-sm", "property": "fontSize", "variants": [] }
]
```

> 해석 실패 토큰은 `buildObjectTree`에서 skip되며, 해당 정보는 `TransformerContext.diagnostics`에 기록됩니다.

### 5.4 Group Prefix 적용 케이스

`groupPrefix: "$"` 설정 시:

**입력:** `"hover:bg-accent"`

**조립된 객체 트리:**

```ts
{
    $hover: {
        backgroundColor: "hover:bg-accent"
    }
}
```
