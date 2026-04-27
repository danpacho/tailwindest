# CSS Property Resolver (속성 해석 엔진) 설계 상세

이 문서는 `create-tailwind-type/generator.ts`의 핵심 매핑 로직을 **의존성 주입(DI) 기반**으로 분리·추출하는 `CSSPropertyResolver`의 아키텍처 상세를 정의합니다.

## 1. 목적 및 배경

### 1.1 왜 분리가 필요한가

`generator.ts`(2082줄)는 **God Class** 상태입니다. 내부의 `getPropertyName`, `sanitizeTwClass`, `exceptionalRules` 등의 핵심 함수들은 Tailwind 클래스를 CSS 속성명으로 매핑하는 검증된 로직이지만, 다음과 같은 인스턴스 상태에 깊이 결합되어 있습니다:

```
getPropertyName
  ├── this.ds.candidatesToCss()        ← Design System 인스턴스
  ├── this.cssAnalyzer.parseStyleBlock()  ← PostCSS 분석기
  ├── this.typeAliasMap                ← docs.json 기반 매핑 테이블
  ├── this.variants                    ← 런타임 초기화 변형 목록
  └── this.exceptionalRules           ← this 참조 클로저 포함
      └── getPropertyNameTailwindKeyNotFounded()
          ├── this.ds
          ├── this.cssAnalyzer
          └── this.variants
```

따라서 **단순 파일 이동은 불가능**하며, 의존성 주입(DI) 기반의 인터페이스 추상화가 선행되어야 합니다.

### 1.2 설계 목표

1. `TailwindTypeGenerator`와 `TokenAnalyzer` 양쪽에서 동일 인스턴스를 공유 가능하게 합니다.
2. 테스트 시 **mock 주입**이 가능한 구조를 확보합니다.
3. `generator.ts`의 기존 코드를 최소한으로 변경합니다(기존 타입 생성 파이프라인 보존).

---

## 2. 아키텍처 및 인터페이스

### 2.1 의존성 인터페이스

Resolver가 필요로 하는 외부 의존성을 명시적 인터페이스로 정의합니다:

```ts
/**
 * CSSPropertyResolver가 동작하기 위해 필요한 외부 의존성.
 * TailwindTypeGenerator.init() 이후에 해당 값들이 준비됩니다.
 */
export interface PropertyResolverDeps {
    /**
     * Tailwind 클래스명 후보 배열을 입력받아 각각의 CSS 문자열을 반환합니다.
     * 내부적으로 @tailwindcss/node의 DesignSystem API를 래핑합니다.
     */
    candidatesToCss: (candidates: string[]) => (string | null)[]

    /**
     * CSS 문자열을 PostCSS로 파싱하여 속성-값 쌍을 반환합니다.
     */
    parseStyleBlock: (css: string) => StyleBlock | null

    /**
     * docs.json 기반의 유틸리티 → 속성명 매핑 테이블.
     * key: uniqueIdentifier, value: Map<Set<classNames>, propertyAlias>
     */
    typeAliasMap: TailwindTypeAliasMap

    /**
     * 현재 프로젝트에서 유효한 Tailwind 변형(variant) 이름 목록.
     * e.g., ["hover", "focus", "dark", "sm", "md", ...]
     */
    variants: string[]

    /**
     * 색상 변수 이름 집합.
     * e.g., Set(["red", "blue", "accent", ...])
     */
    colorVariableSet: Set<string>
}
```

### 2.2 Resolver 코어 클래스

```ts
/**
 * Tailwind 유틸리티 클래스명을 CSS 속성명으로 해석하는 엔진.
 *
 * generator.ts의 다음 로직을 캡슐화합니다:
 *   - getPropertyName()
 *   - getPropertyNameTailwindKeyNotFounded()
 *   - exceptionalRules
 *   - sanitizeTwClass()
 *   - generateKey()
 */
export class CSSPropertyResolver {
    private readonly deps: PropertyResolverDeps
    private readonly exceptionalRules: Map<string, ExceptionalRule>

    constructor(deps: PropertyResolverDeps) {
        this.deps = deps
        this.exceptionalRules = this.buildExceptionalRules()
    }

    /**
     * 단일 Tailwind 유틸리티 클래스를 CSS 속성명으로 해석합니다.
     *
     * @param className - Variant가 제거된 순수 유틸리티 (e.g., "bg-accent", "flex")
     * @returns 해석된 속성명 또는 배열(다중 매핑). null이면 해석 불가.
     *
     * @example
     * resolver.resolve("bg-accent")   // → "backgroundColor"
     * resolver.resolve("flex")        // → "display"
     * resolver.resolve("size-4")      // → ["width", "height"]
     * resolver.resolve("unknown-cls") // → null
     */
    public resolve(className: string): string | string[] | null {
        // 1. exceptionalRules 확인
        // 2. Design System candidatesToCss → CSS 생성 가능 여부 확인
        // 3. typeAliasMap 기반 key 매칭 (exact → similar → fallback)
        // 4. CSS 파싱 기반 fallback (getPropertyNameTailwindKeyNotFounded)
        // 5. 모두 실패 시 null 반환
    }

    /**
     * Property Ambiguity 해결.
     * resolve()가 배열을 반환한 경우의 최종 결정 정책.
     *
     * @see Section 3. Property Ambiguity 정책
     */
    public resolveUnambiguous(className: string): string | null {
        const result = this.resolve(className)
        if (result === null) return null
        if (typeof result === "string") return result
        // 배열인 경우: 정책에 따라 단일 키 결정
        return this.disambiguate(className, result)
    }
}
```

### 2.3 팩토리 함수 — `TailwindTypeGenerator`에서의 생성

```ts
// generator.ts 내부
export class TailwindTypeGenerator {
    // ... 기존 필드 ...

    /**
     * 초기화 완료 후 CSSPropertyResolver 인스턴스를 생성합니다.
     * TokenAnalyzer와 공유하기 위해 외부로 노출합니다.
     */
    public createPropertyResolver(): CSSPropertyResolver {
        if (!this._initialized) {
            throw new Error(
                "Generator must be initialized before creating resolver"
            )
        }

        return new CSSPropertyResolver({
            candidatesToCss: (candidates) =>
                this.ds.candidatesToCss(candidates),
            parseStyleBlock: (css) => this.cssAnalyzer.parseStyleBlock(css),
            typeAliasMap: this.typeAliasMap,
            variants: this.variants,
            colorVariableSet: this.colorVariableSet,
        })
    }
}
```

이를 통해 `generator.ts`의 기존 코드를 최소한으로 변경하면서, Resolver를 외부(TokenAnalyzer)에서 사용할 수 있게 됩니다.

---

## 3. Property Ambiguity (다중 매핑) 정책

`resolve()`가 배열을 반환하는 경우의 처리 정책입니다.

### 3.1 발생 케이스

| 유틸리티  | 매핑 결과                                            | 원인                                        |
| --------- | ---------------------------------------------------- | ------------------------------------------- |
| `size-4`  | `["width", "height"]`                                | CSS shorthand (`width: 1rem; height: 1rem`) |
| `inset-0` | `["top", "right", "bottom", "left"]`                 | 4방향 shorthand                             |
| `p-4`     | `["padding"]` (단일) vs `px-2` → `["padding"]`       | 방향 축약                                   |
| `border`  | `["borderWidth", "borderStyle", "borderColor"]` 가능 | 다중 CSS 속성                               |

### 3.2 해소 전략 (`disambiguate`)

```ts
private disambiguate(className: string, candidates: string[]): string | null {
  // 전략 1: tailwindest 타입에 shorthand 키가 존재하면 그것을 우선 사용
  //   e.g., "size" → tailwindest에 "size" 키가 있으면 "size" 반환
  //   이는 tailwindest 타입 생성 시 이미 shorthand를 하나의 키로 매핑하기 때문

  // 전략 2: 방향성 유틸리티는 방향별 키로 분리
  //   e.g., "px-2" → "paddingX" (tailwindest에 paddingX가 있는 경우)
  //         "pt-2" → "paddingTop"

  // 전략 3: 위 전략으로 해소 불가 시 첫 번째 후보 사용 + 경고 로그
}
```

### 3.3 핵심 원칙

> **Resolver는 `tailwindest` 타입 시스템의 키 구조를 존중합니다.**
>
> `create-tailwind-type`이 생성한 타입 정의에서 `size`, `padding`, `paddingX` 등이 각각 독립 키로 존재하므로, Resolver는 해당 키 구조와 1:1로 대응하는 결과를 반환해야 합니다. 이를 위해 Resolver 초기화 시 생성된 타입의 키 목록을 참조할 수 있습니다.

---

## 4. 유틸리티 순수 함수 (Extracted Utilities)

다음 함수들은 인스턴스 상태에 의존하지 않으므로, 별도 유틸리티 모듈로 즉시 분리 가능합니다:

```ts
// css_property_utils.ts

/** 클래스명에서 방향 접미사와 숫자 값을 제거하여 핵심 식별자를 추출 */
export function sanitizeTwClass(className: string): string

/** kebab-case를 camelCase로 변환 */
export function kebabToCamelCase(str: string): string

/** CSS vendor prefix를 제거하고 camelCase로 변환 */
export function toValidCSSProperty(property: string): string

/** 문자열이 순수 알파벳으로만 구성되었는지 확인 */
export function isTwClassPure(text: string): boolean

/** 템플릿 토큰(${string})을 포함한 문자열에서 검증용 RegExp 생성 */
export function generateValidator(rawText: string): RegExp | null
```

---

## 5. 성능 고려사항 — 싱글턴 캐싱

`CSSPropertyResolver`는 내부적으로 Design System API를 호출합니다. CLI가 glob으로 다수 파일을 처리할 때, **파일마다 새 인스턴스를 생성하면 초기화 비용이 반복**됩니다.

```ts
// CLI 엔트리포인트에서의 싱글턴 관리
class TransformerCLI {
    private resolver: CSSPropertyResolver | null = null

    async getResolver(): Promise<CSSPropertyResolver> {
        if (!this.resolver) {
            const generator = new TailwindTypeGenerator(/* ... */)
            await generator.init()
            this.resolver = generator.createPropertyResolver()
        }
        return this.resolver
    }

    async transformFile(filePath: string) {
        const resolver = await this.getResolver() // 캐시된 인스턴스 재사용
        const analyzer = new TokenAnalyzer(resolver)
        // ...
    }
}
```

> ⚠️ `TailwindCompiler.getDesignSystem()` 호출 비용이 높으므로(수백ms), 반드시 1회만 초기화하고 공유해야 합니다.
