# Phase 1: CSSPropertyResolver 분리

> **선행 조건**: 없음 (최초 단계)
> **산출물**: `css_property_resolver.ts`, `css_property_utils.ts`, 단위 테스트 전체 통과
> **사이드 이펙트 경계**: `generator.ts`의 기존 `buildTypes()` 파이프라인은 **변경 없이 동일하게 동작**해야 합니다. 기존 테스트(`generator.test.ts`, `css_analyzer.test.ts`, `optimizer.test.ts`)가 100% 통과해야 Phase 1 완료로 인정됩니다.

---

## 1. 목적

`generator.ts`(2082줄)의 핵심 매핑 로직(`getPropertyName`, `getPropertyNameTailwindKeyNotFounded`, `exceptionalRules` 등)을 **DI 기반 독립 모듈 `CSSPropertyResolver`로 추출**합니다.

이 Phase가 완료되면:

- `TokenAnalyzer`(Phase 2)가 Resolver를 주입받아 사용할 수 있는 **안정된 인터페이스**가 확보됩니다.
- `generator.ts`는 추출된 Resolver를 **내부적으로 위임 호출**하는 형태로 리팩토링되어, 기존 동작이 보존됩니다.

---

## 2. 작업 항목

### 2.1 순수 유틸리티 함수 추출

**파일**: `packages/create-tailwind-type/src/generator/css_property_utils.ts` `[NEW]`

`generator.ts` 상단에 위치한 다음 순수 함수들을 별도 모듈로 추출합니다. **원본 함수의 시그니처와 로직은 1바이트도 변경하지 않습니다.**

| 함수                 | 원본 위치 (라인) | 비고                    |
| -------------------- | ---------------- | ----------------------- |
| `sanitizeTwClass`    | L76-87           | 방향 접미사 제거        |
| `kebabToCamelCase`   | L58-60           | 케이스 변환             |
| `camelToKebabCase`   | L62-64           | 케이스 변환             |
| `toValidCSSProperty` | L66-70           | vendor prefix 제거      |
| `isTwClassPure`      | L72-74           | 순수 알파벳 확인        |
| `isNumericString`    | L89-96           | 숫자 문자열 확인        |
| `generateValidator`  | L101-158         | 템플릿 토큰 RegExp 생성 |
| `capitalize`         | L44-56           | 대문자 변환             |

`generator.ts`에서는 이 함수들을 `import`로 교체합니다:

```ts
// generator.ts (변경 후)
import {
    sanitizeTwClass,
    kebabToCamelCase,
    capitalize,
    toValidCSSProperty,
    isTwClassPure,
    isNumericString,
    generateValidator,
    camelToKebabCase,
} from "./css_property_utils"
```

### 2.2 `PropertyResolverDeps` 인터페이스 정의

**파일**: `packages/create-tailwind-type/src/generator/css_property_resolver.ts` `[NEW]`

```ts
export interface PropertyResolverDeps {
    candidatesToCss: (candidates: string[]) => (string | null)[]
    parseStyleBlock: (css: string) => StyleBlock | null
    typeAliasMap: TailwindTypeAliasMap
    variants: string[]
    colorVariableSet: Set<string>
}
```

> ⚠️ `TailwindTypeAliasMap`, `StyleBlock` 등의 타입은 `generator.ts` 내부에 정의되어 있습니다. 이들을 `css_property_resolver.ts`에서 참조할 수 있도록 **타입만 별도 export**합니다.

### 2.3 `CSSPropertyResolver` 클래스 구현

**파일**: `packages/create-tailwind-type/src/generator/css_property_resolver.ts`

`generator.ts`의 다음 **private 메서드**들을 Resolver 클래스의 메서드로 이전합니다:

| 원본 메서드                                         | Resolver 메서드                   | 핵심 변경                                             |
| --------------------------------------------------- | --------------------------------- | ----------------------------------------------------- |
| `getPropertyName()` (L699-951)                      | `resolve()`                       | `this.ds` → `this.deps.candidatesToCss` 위임          |
| `getPropertyNameTailwindKeyNotFounded()` (L529-643) | `private resolveFallback()`       | `this.cssAnalyzer` → `this.deps.parseStyleBlock` 위임 |
| `exceptionalRules` (L645-697)                       | `private buildExceptionalRules()` | `this` 참조 클로저를 `resolveFallback` 호출로 교체    |
| `generateKey()` (L493-527)                          | `private generateKey()`           | 변경 없음 (순수 함수)                                 |

**핵심 원칙**: 로직 자체를 리팩토링하지 않습니다. **의존성 접근 경로만 `this.XYZ` → `this.deps.XYZ`로 교체**합니다.

### 2.4 `TailwindTypeGenerator`에 팩토리 메서드 추가

**파일**: `packages/create-tailwind-type/src/generator/generator.ts` `[MODIFY]`

```ts
public createPropertyResolver(): CSSPropertyResolver {
  if (!this._initialized) {
    throw new Error("Generator must be initialized before creating resolver");
  }
  return new CSSPropertyResolver({
    candidatesToCss: (candidates) => this.ds.candidatesToCss(candidates),
    parseStyleBlock: (css) => this.cssAnalyzer.parseStyleBlock(css),
    typeAliasMap: this.typeAliasMap,
    variants: this.variants,
    colorVariableSet: this.colorVariableSet, // buildTypes()에서 이미 생성하는 값
  });
}
```

### 2.5 `generator.ts` 내부 위임 리팩토링

`generator.ts`의 `buildTypes()` 내부에서 `getPropertyName()`을 호출하는 부분을 Resolver 위임 호출로 교체합니다:

```ts
// buildTypes() 내부 (변경 후)
const resolver = this.createPropertyResolver()

for (const entry of this.classList) {
    const [className] = entry
    let property = resolver.resolve(className) // 기존: this.getPropertyName(...)
    // ... 나머지 로직 동일
}
```

기존 `getPropertyName` 등의 private 메서드는 **제거하지 않고 `@deprecated` 표시**합니다. 기존 테스트가 내부 메서드를 직접 호출하고 있을 수 있으므로, 안전하게 유지합니다.

### 2.6 단위 테스트 작성

**파일**: `packages/create-tailwind-type/src/generator/__tests__/css_property_resolver.test.ts` `[NEW]`

| 테스트 케이스                                   | 검증 대상                        |
| ----------------------------------------------- | -------------------------------- |
| `resolve("bg-accent")` → `"backgroundColor"`    | 기본 매핑                        |
| `resolve("flex")` → `"display"`                 | 단독 유틸리티                    |
| `resolve("size-4")` → `["width", "height"]`     | 다중 매핑 반환                   |
| `resolve("bg-conic-...")` → `"backgroundImage"` | exceptionalRules                 |
| `resolve("font-sans")` → `"fontFamily"`         | exceptionalRules + tester 클로저 |
| `resolve("totally-unknown")` → `null`           | 해석 불가                        |
| `resolveUnambiguous("size-4")` → 단일 문자열    | disambiguate 정책                |

**파일**: `packages/create-tailwind-type/src/generator/__tests__/css_property_utils.test.ts` `[NEW]`

| 테스트 케이스                         | 검증 대상             |
| ------------------------------------- | --------------------- |
| `sanitizeTwClass("-px-2")`            | 부호 + 방향 제거      |
| `sanitizeTwClass("bg-red-500")`       | 변경 없음 (방향 없음) |
| `generateValidator("size-${string}")` | RegExp 생성           |
| `generateValidator("plain-text")`     | null 반환 (토큰 없음) |
| `kebabToCamelCase("bg-color")`        | `"bgColor"`           |

---

## 3. 산출물 체크리스트

- [ ] `css_property_utils.ts` — 순수 함수 8개 추출, export
- [ ] `css_property_resolver.ts` — `CSSPropertyResolver` 클래스 + `PropertyResolverDeps` 인터페이스
- [ ] `generator.ts` — import 교체 + `createPropertyResolver()` 팩토리 추가 + `buildTypes()` 내부 위임
- [ ] `css_property_resolver.test.ts` — Resolver 단위 테스트 (7+ 케이스)
- [ ] `css_property_utils.test.ts` — 유틸리티 단위 테스트 (5+ 케이스)
- [ ] **기존 테스트 전체 통과** (`generator.test.ts`, `css_analyzer.test.ts`, `optimizer.test.ts`)

---

## 4. 완료 조건 (Exit Criteria)

1. `npm test` — `create-tailwind-type` 패키지의 **모든 기존 테스트가 통과**합니다.
2. 신규 테스트 파일 2개가 **전체 통과**합니다.
3. `generator.ts`에서 `css_property_utils`의 함수를 `import`로 사용합니다 (로컬 선언 제거).
4. `CSSPropertyResolver`가 `generator.ts` 외부에서 독립적으로 인스턴스화 가능합니다.
5. `tailwindest` 패키지의 기존 테스트에 영향 없습니다.
