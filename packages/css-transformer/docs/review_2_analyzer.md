# Review 2: TokenAnalyzer 구현 검수

> **검수 대상**: Phase 2 산출물 전체
> **검수 기준**: Phase 1 무영향 + Analyzer 정합성 + Edge Case 커버리지

---

## 1. 사이드 이펙트 격리 — 🔴 MUST PASS

| #   | 검수 항목                        | 판정 기준                                                  | 결과 |
| --- | -------------------------------- | ---------------------------------------------------------- | ---- |
| I-1 | `create-tailwind-type` 변경 없음 | `git diff packages/create-tailwind-type` → 0 files changed | ☐    |
| I-2 | `tailwindest` 변경 없음          | `git diff packages/tailwindest` → 0 files changed          | ☐    |
| I-3 | Phase 1 테스트 통과 유지         | `create-tailwind-type`의 모든 테스트 PASS                  | ☐    |

---

## 2. 패키지 구조 — 🟡 MUST PASS

| #   | 검수 항목           | 판정 기준                                                     | 결과 |
| --- | ------------------- | ------------------------------------------------------------- | ---- |
| P-1 | `package.json` 존재 | `css-transformer` 패키지 초기화 완료                          | ☐    |
| P-2 | 의존성 선언         | `ts-morph` dependency, `create-tailwind-type` peer dependency | ☐    |
| P-3 | TypeScript 컴파일   | `tsc --noEmit` 에러 0                                         | ☐    |
| P-4 | 디렉토리 구조       | `src/analyzer/`, `src/types/`, `tests/analyzer/` 존재         | ☐    |

---

## 3. 인터페이스 정합성 — 🟡 MUST PASS

| #   | 검수 항목                    | 판정 기준                                                           | 결과 |
| --- | ---------------------------- | ------------------------------------------------------------------- | ---- |
| A-1 | `ParsedToken` 타입           | `original`, `utility`, `property`, `variants`, `warning?` 필드 존재 | ☐    |
| A-2 | `analyze()` 시그니처         | `(classNames: string \| string[]) => ParsedToken[]`                 | ☐    |
| A-3 | `buildObjectTree()` 시그니처 | `(tokens: ParsedToken[]) => Record<string, any>`                    | ☐    |
| A-4 | 생성자 DI                    | `CSSPropertyResolver`를 생성자 첫 번째 인자로 주입                  | ☐    |
| A-5 | `groupPrefix` 지원           | 생성자 두 번째 인자 (기본값 `""`)                                   | ☐    |

---

## 4. 파싱 로직 검증 — 🟡 MUST PASS

| #   | 검수 항목                      | 판정 기준                                             | 결과 |
| --- | ------------------------------ | ----------------------------------------------------- | ---- |
| C-1 | `splitByColon` bracket 보호    | `"[&:hover]:text-sm"` → `["[&:hover]", "text-sm"]`    | ☐    |
| C-2 | `splitByColon` arbitrary value | `"bg-[color:red]"` → `["bg-[color:red]"]` (단일 요소) | ☐    |
| C-3 | `splitByColon` 중첩 bracket    | `"[&>[data-slot=icon]]:size-4"` → 2요소               | ☐    |
| C-4 | `extractVariants` 기본         | `"dark:hover:bg-accent"` → variants 2개 + utility 1개 | ☐    |
| C-5 | 빈 문자열 처리                 | 크래시 없이 빈 결과 반환                              | ☐    |

---

## 5. 키 충돌 정책 검증 — 🟡 MUST PASS

| #   | 검수 항목                       | 판정 기준                                      | 결과 |
| --- | ------------------------------- | ---------------------------------------------- | ---- |
| K-1 | 동일 property 충돌 시 배열 승격 | 두 번째 값이 들어올 때 `[first, second]` 형태  | ☐    |
| K-2 | 충돌 시 경고 메시지 생성        | warning 문자열이 존재                          | ☐    |
| K-3 | Variant 중첩 객체 생성          | `"dark:hover:X"` → 2단 중첩                    | ☐    |
| K-4 | Group Prefix 적용               | `$hover` 키 생성 확인                          | ☐    |
| K-5 | 해석 불가 토큰 skip             | `property: null`인 토큰이 트리에 포함되지 않음 | ☐    |

---

## 6. 테스트 커버리지 — 🟢 SHOULD PASS

| #   | 검수 항목                | 판정 기준                                       | 결과 |
| --- | ------------------------ | ----------------------------------------------- | ---- |
| T-1 | `split_utils.test.ts`    | 7+ 케이스, 전체 PASS                            | ☐    |
| T-2 | `token_analyzer.test.ts` | 8+ 케이스, 전체 PASS                            | ☐    |
| T-3 | Mock Resolver 사용       | 테스트가 실제 Tailwind 컴파일러에 의존하지 않음 | ☐    |

---

## 7. 판정

| 판정                          | 조건                         |
| ----------------------------- | ---------------------------- |
| ✅ **APPROVED**               | 🔴 전체 PASS + 🟡 전체 PASS  |
| ⚠️ **CONDITIONALLY APPROVED** | 🔴 전체 PASS + 🟡 1~2개 미달 |
| ❌ **REJECTED**               | 🔴 항목 1개 이상 FAIL        |
