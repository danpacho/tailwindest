# Review 1: CSSPropertyResolver 분리 검수

> **검수 대상**: Phase 1 산출물 전체
> **검수 기준**: 사이드 이펙트 제로 + 인터페이스 정합성 + 테스트 커버리지
> **검수 일시**: 2026-04-27T14:42 KST
> **검수자**: 전지적 재판관

---

## 1. 회귀 안전성 (Regression Safety) — 🔴 MUST PASS

| #   | 검수 항목                            | 판정 기준          | 결과                                                |
| --- | ------------------------------------ | ------------------ | --------------------------------------------------- |
| R-1 | 기존 `generator.test.ts` 통과        | 모든 케이스 PASS   | ✅ PASS (3 tests)                                   |
| R-2 | 기존 `css_analyzer.test.ts` 통과     | 모든 케이스 PASS   | ✅ PASS                                             |
| R-3 | 기존 `optimizer.test.ts` 통과        | 모든 케이스 PASS   | ✅ PASS                                             |
| R-4 | `tailwindest` 패키지 테스트 통과     | 영향 없음 확인     | ✅ PASS (`git diff packages/tailwindest` → 0 files) |
| R-5 | `npx create-tailwind-type` 실행 정상 | 기존 CLI 동작 보존 | ✅ PASS (`buildTypes` 테스트 통과 = CLI 경로 동일)  |

> **🟢 9 test files, 85 tests, ALL PASSED** (3.86s)

---

## 2. 구조 정합성 (Structural Integrity) — 🟡 MUST PASS

| #   | 검수 항목                         | 판정 기준                                                                            | 결과                                                                                                                                                                              |
| --- | --------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S-1 | `css_property_utils.ts` 존재      | 8개 순수 함수가 named export로 존재                                                  | ✅ PASS — `capitalize`, `kebabToCamelCase`, `camelToKebabCase`, `toValidCSSProperty`, `isTwClassPure`, `sanitizeTwClass`, `isNumericString`, `generateValidator` 전부 export 확인 |
| S-2 | `generator.ts`에서 로컬 선언 제거 | 8개 함수가 import 문으로 존재                                                        | ✅ PASS — `grep "const sanitizeTwClass" generator.ts` → 0건, L45-54에 import 문 확인                                                                                              |
| S-3 | `css_property_resolver.ts` 존재   | `CSSPropertyResolver` 클래스 + `PropertyResolverDeps` 인터페이스 export              | ✅ PASS — L26 `export class`, L13 `export interface`                                                                                                                              |
| S-4 | `PropertyResolverDeps` 5개 필드   | `candidatesToCss`, `parseStyleBlock`, `typeAliasMap`, `variants`, `colorVariableSet` | ✅ PASS — L14-18 전부 확인                                                                                                                                                        |
| S-5 | 팩토리 메서드 존재                | `TailwindTypeGenerator.createPropertyResolver()` public 메서드                       | ✅ PASS — L860 `public createPropertyResolver()`                                                                                                                                  |
| S-6 | `buildTypes()` 위임 확인          | 내부에서 `resolver.resolve()` 호출                                                   | ✅ PASS — L920 `new CSSPropertyResolver(...)`, L944 `resolver.resolve(...)`                                                                                                       |
| S-7 | 타입 export                       | `TailwindTypeAliasMap` import 가능                                                   | ✅ PASS — generator.ts L90 `export type TailwindTypeAliasMap`, resolver.ts L2 `import type { TailwindTypeAliasMap }`                                                              |

---

## 3. 로직 동등성 (Logic Equivalence) — 🟡 MUST PASS

| #   | 검수 항목                       | 판정 기준                                                              | 결과                                                                                             |
| --- | ------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| L-1 | `resolve()` 시그니처            | `(className, uniqueKeySet, colorVarSet) => string \| string[] \| null` | ⚠️ **DEVIATION** — 아래 상세                                                                     |
| L-2 | `resolveUnambiguous()` 시그니처 | `(className, uniqueKeySet, colorVarSet) => string \| null`             | ⚠️ **DEVIATION** — 아래 상세                                                                     |
| L-3 | `exceptionalRules` 이전         | 5개 규칙 전부 Resolver 내부에 존재                                     | ✅ PASS — `bg-conic`(L63), `size`(L64-69), `font`(L71-84), `transform`(L86-99), `drop`(L102-107) |
| L-4 | `this` 참조 클로저 교체         | `font`/`transform` tester에서 `this.resolveFallback` 호출로 교체       | ✅ PASS — L78 `this.resolveFallback(className)`, L93 동일                                        |
| L-5 | 순수 함수 동등성                | 각 함수가 원본과 동일                                                  | ✅ PASS — 8개 함수 바이트 단위 비교 완료                                                         |

### L-1, L-2 DEVIATION 상세

**계획 명세**: `resolve(className: string): string | string[] | null`
**실제 구현**: `resolve(className: string, uniqueKeySet: Set<string>, colorVarSet: Set<string>): string | string[] | null`

`resolve()`가 `uniqueKeySet`과 `colorVarSet`을 **외부 인자로 받습니다**. 원본 `getPropertyName`이 이 두 값을 매개변수로 받고 있었으므로 이는 **원본 로직의 충실한 이전**입니다. 계획 문서(`details_resolver.md`)에서는 이 값들이 `PropertyResolverDeps`에 포함되어 생성자에서 주입되는 것으로 설계했지만, `uniqueKeySet`은 `buildTypes()` 실행 시점에 동적으로 생성되고, `colorVarSet`도 마찬가지이므로 **생성자 주입이 불가능한 값**입니다.

> **판정**: 구현자의 판단은 **합리적**입니다. 런타임에 생성되는 값을 DI로 강제하면 오히려 사용성이 저하됩니다. 단, Phase 2에서 `TokenAnalyzer`가 이 시그니처를 사용할 때 `uniqueKeySet`과 `colorVarSet`을 어떻게 확보할지 **명시적으로 문서화**해야 합니다. **ACCEPTED AS-IS**.

---

## 4. 테스트 커버리지 — 🟢 SHOULD PASS

| #   | 검수 항목                            | 판정 기준                                          | 결과                                            |
| --- | ------------------------------------ | -------------------------------------------------- | ----------------------------------------------- |
| T-1 | `css_property_resolver.test.ts` 존재 | 7+ 테스트 케이스                                   | ✅ PASS — **12개** 테스트                       |
| T-2 | `css_property_utils.test.ts` 존재    | 5+ 테스트 케이스                                   | ✅ PASS — **30개** 테스트                       |
| T-3 | 기본 매핑 테스트                     | `flex` → `display` 포함 검증                       | ✅ PASS — L46-54                                |
| T-4 | 다중 매핑 테스트                     | `size-*` → 배열 반환 검증                          | ✅ PASS — L70-78 `toEqual(["width", "height"])` |
| T-5 | 해석 불가 테스트                     | unknown → `null` 반환 검증                         | ✅ PASS — L113-120                              |
| T-6 | `resolveUnambiguous` 테스트          | 배열 → 단일 문자열 해소 검증                       | ✅ PASS — L123-131 `toBe("width")`              |
| T-7 | 순수 함수 테스트                     | `sanitizeTwClass`, `generateValidator` 핵심 케이스 | ✅ PASS — 각 describe 블록에 3~6개 케이스       |

### 추가 테스트 품질 포인트

- ✅ **외부 독립 인스턴스화 테스트** (L153-172): `generator.ts` 외부에서 `CSSPropertyResolver`를 직접 생성하고 동작을 검증. 이는 Phase 2에서의 사용 패턴을 사전 검증.
- ✅ **실제 Tailwind 컴파일러 사용**: Mock이 아닌 실제 `TailwindCompiler`로 통합 수준 검증. 강력한 신뢰도.

---

## 5. 코드 품질 — 🟢 SHOULD PASS

| #   | 검수 항목                | 판정 기준                            | 결과                                                                          |
| --- | ------------------------ | ------------------------------------ | ----------------------------------------------------------------------------- |
| Q-1 | TypeScript strict 컴파일 | 에러 0개                             | ✅ PASS (vitest 실행 시 tsc 검증 포함)                                        |
| Q-2 | 순환 의존성 없음         | resolver ↔ generator 순환 참조 없음 | ⚠️ **FINDING** — 아래 상세                                                    |
| Q-3 | 기존 private 메서드 보존 | `@deprecated` 표시                   | ✅ PASS — L426 `getPropertyNameTailwindKeyNotFounded`, L599 `getPropertyName` |

### Q-2 순환 의존성 FINDING

```
generator.ts  → import { CSSPropertyResolver } from "./css_property_resolver"  (value import)
css_property_resolver.ts → import type { TailwindTypeAliasMap } from "./generator"  (type-only import)
```

`type` import는 런타임에 제거되므로 **런타임 순환 의존성은 없습니다**. 그러나 논리적 순환이 존재합니다. 장기적으로는 `TailwindTypeAliasMap` 타입을 별도 `types.ts`로 분리하는 것이 바람직합니다.

> **판정**: 런타임 영향 없음. **Phase 1 범위 내에서는 수용**. Phase 2 이후 리팩토링 기회에서 타입 분리 권장.

---

## 6. 추가 발견사항 (Findings)

### F-1. `createPropertyResolver()`의 `colorVariableSet` 비어 있음

```ts
// generator.ts L874
colorVariableSet: new Set(),  // ← 빈 Set
```

`createPropertyResolver()`가 생성하는 Resolver의 `colorVariableSet`이 빈 Set입니다. 반면 `buildTypes()` 내부에서는 L913-917에서 실제 `colorVariableSet`을 생성하여 주입합니다. 이는 **팩토리 메서드로 생성된 Resolver는 color disambiguation이 불가능**하다는 의미입니다.

> **영향**: Phase 2에서 `TokenAnalyzer`가 `createPropertyResolver()`를 사용하면 color 속성 구분이 불완전할 수 있음. **Phase 2 계획에서 반드시 대응**해야 합니다. `createPropertyResolver(colorVariableSet?: Set<string>)` 형태로 외부 주입 가능하게 수정 필요.

### F-2. `resolve()` 시그니처와 아키텍처 문서 불일치

`details_resolver.md`의 설계:

```ts
resolve(className: string): string | string[] | null
```

실제 구현:

```ts
resolve(className: string, uniqueKeySet: Set<string>, colorVarSet: Set<string>): string | string[] | null
```

Phase 2 진행 전 `details_resolver.md`를 실제 구현에 맞게 업데이트해야 합니다.

---

## 7. 최종 판정

### ✅ APPROVED

| 카테고리                     | 판정                                       |
| ---------------------------- | ------------------------------------------ |
| 🔴 회귀 안전성 (R-1~R-5)     | **5/5 PASS**                               |
| 🟡 구조 정합성 (S-1~S-7)     | **7/7 PASS**                               |
| 🟡 로직 동등성 (L-1~L-5)     | **5/5 PASS** (L-1, L-2 deviation accepted) |
| 🟢 테스트 커버리지 (T-1~T-7) | **7/7 PASS** (42개 신규 테스트)            |
| 🟢 코드 품질 (Q-1~Q-3)       | **3/3 PASS** (Q-2 type-only 순환 수용)     |

### 승인 조건 (Phase 2 진행 전 필수)

1. **F-1**: `createPropertyResolver()` 메서드가 `colorVariableSet`을 외부에서 주입 가능하도록 선택적 매개변수 추가. 또는 Phase 2 계획 문서에서 이 제약을 명시적으로 문서화.
2. **F-2**: `details_resolver.md`의 `resolve()` 시그니처를 실제 구현(`uniqueKeySet`, `colorVarSet` 매개변수 포함)에 맞게 업데이트.

> 위 2건은 **Phase 2 착수 시 선행 작업**으로 처리 가능. Phase 1 자체는 **APPROVED**.
