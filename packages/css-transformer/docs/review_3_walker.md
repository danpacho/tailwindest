# Review 3: Walker Registry + 구현체 + E2E 검수

> **검수 대상**: Phase 3 산출물 전체 (최종 Phase)
> **검수 기준**: 파이프라인 완결성 + 안전성 + 실전 변환 정확성

---

## 1. 사이드 이펙트 격리 — 🔴 MUST PASS

| #   | 검수 항목                        | 판정 기준                                          | 결과 |
| --- | -------------------------------- | -------------------------------------------------- | ---- |
| I-1 | `create-tailwind-type` 변경 없음 | `git diff packages/create-tailwind-type` → 0 files | ☐    |
| I-2 | `tailwindest` 변경 없음          | `git diff packages/tailwindest` → 0 files          | ☐    |
| I-3 | Phase 1 테스트 유지              | Resolver 관련 테스트 전체 PASS                     | ☐    |
| I-4 | Phase 2 테스트 유지              | Analyzer 관련 테스트 전체 PASS                     | ☐    |

---

## 2. 코어 인프라 검증 — 🔴 MUST PASS

### 2.1 Stale Node 방지 패턴

| #    | 검수 항목                | 판정 기준                                                      | 결과 |
| ---- | ------------------------ | -------------------------------------------------------------- | ---- |
| SN-1 | 2-Phase 분리 존재        | `transform()` 내에 Collect Phase와 Execute Phase가 명확히 분리 | ☐    |
| SN-2 | 역순 실행                | Execute Phase에서 `for (let i = targets.length - 1; ...)` 패턴 | ☐    |
| SN-3 | `wasForgotten()` 체크    | 각 노드 실행 전 무효화 여부 확인                               | ☐    |
| SN-4 | try-catch 래핑           | 단일 노드 에러가 전체 변환을 중단하지 않음                     | ☐    |
| SN-5 | 에러 시 diagnostics 기록 | catch 블록에서 `context.diagnostics.push()` 호출               | ☐    |

### 2.2 우선순위 시스템

| #    | 검수 항목                     | 판정 기준                                              | 결과 |
| ---- | ----------------------------- | ------------------------------------------------------ | ---- |
| PR-1 | `register()` 후 정렬          | `this.walkers.sort((a, b) => a.priority - b.priority)` | ☐    |
| PR-2 | CvaWalker priority ≤ 10       | CnWalker보다 낮은 값                                   | ☐    |
| PR-3 | CnWalker priority ≤ 20        | ClassNameWalker보다 낮은 값                            | ☐    |
| PR-4 | ClassNameWalker priority ≤ 30 | 가장 높은 값 (가장 일반적)                             | ☐    |

### 2.3 TransformerContext

| #     | 검수 항목               | 판정 기준                  | 결과 |
| ----- | ----------------------- | -------------------------- | ---- |
| CTX-1 | `imports` 필드          | `ImportCollector` 인스턴스 | ☐    |
| CTX-2 | `diagnostics` 필드      | `Diagnostic[]` 배열        | ☐    |
| CTX-3 | `tailwindestIdentifier` | 기본값 `"tw"`              | ☐    |
| CTX-4 | `tailwindestModulePath` | 기본값 존재                | ☐    |

---

## 3. ImportCollector 검증 — 🟡 MUST PASS

| #    | 검수 항목           | 판정 기준                                                 | 결과 |
| ---- | ------------------- | --------------------------------------------------------- | ---- |
| IM-1 | 신규 import 추가    | 기존에 없는 모듈 → `addImportDeclaration` 호출            | ☐    |
| IM-2 | 기존 import 병합    | 동일 모듈에서 다른 심볼 이미 import → named import에 추가 | ☐    |
| IM-3 | 중복 방지           | 이미 import된 심볼 → skip                                 | ☐    |
| IM-4 | `applyTo` 호출 시점 | Registry의 Phase 3에서 호출 (모든 Walker 완료 후)         | ☐    |

---

## 4. Walker 구현체 검증 — 🟡 MUST PASS

### 4.1 CvaWalker

| #     | 검수 항목                      | 판정 기준                                       | 결과 |
| ----- | ------------------------------ | ----------------------------------------------- | ---- |
| CVA-1 | `canWalk` 정확성               | `cva()` CallExpression만 매칭, 다른 함수 무시   | ☐    |
| CVA-2 | base 문자열 변환               | 첫 번째 인자 → Analyzer → 객체 트리             | ☐    |
| CVA-3 | variants 변환                  | 각 variant 값을 독립적으로 Analyzer 통과        | ☐    |
| CVA-4 | `defaultVariants` 보존         | JSDoc 주석 또는 유사한 형태로 정보 보존         | ☐    |
| CVA-5 | `compoundVariants` 보존        | 주석 블록으로 원본 내용 보존 (전략 A)           | ☐    |
| CVA-6 | `tw.variants({...})` 코드 생성 | 올바른 코드 문자열로 교체                       | ☐    |
| CVA-7 | TransformResult 반환           | success, location, original, transformed 채워짐 | ☐    |

### 4.2 CnWalker

| #    | 검수 항목                      | 판정 기준                             | 결과 |
| ---- | ------------------------------ | ------------------------------------- | ---- |
| CN-1 | `canWalk` 정확성               | `cn()`, `clsx()`, `classNames()` 매칭 | ☐    |
| CN-2 | StringLiteral 인자 → 객체 변환 | Analyzer 통과 → styleList             | ☐    |
| CN-3 | 동적 인자 그대로 유지          | 변수, 조건부 → classList              | ☐    |
| CN-4 | `tw.def()` 코드 생성           | `tw.def([동적], {정적})` 형태         | ☐    |

### 4.3 ClassNameWalker

| #     | 검수 항목                   | 판정 기준                                       | 결과 |
| ----- | --------------------------- | ----------------------------------------------- | ---- |
| CLS-1 | `canWalk` 정확성            | JsxAttribute + className + StringLiteral만 매칭 | ☐    |
| CLS-2 | 표현식이 아닌 문자열만      | `className={expr}`은 매칭하지 않음              | ☐    |
| CLS-3 | `tw.style({}).class()` 생성 | 올바른 코드 문자열                              | ☐    |

---

## 5. 골든 파일 E2E 테스트 — 🟡 MUST PASS

| #    | Fixture             | 검수 항목                                   | 결과 |
| ---- | ------------------- | ------------------------------------------- | ---- |
| GF-1 | `cva_button`        | cva base + variants → tw.variants 변환 일치 | ☐    |
| GF-2 | `cn_complex`        | 혼합 인자 → tw.def 변환 일치                | ☐    |
| GF-3 | `classname_basic`   | className 문자열 → tw.style 변환 일치       | ☐    |
| GF-4 | `mixed_patterns`    | 복수 패턴 공존 파일 → 전체 변환 일치        | ☐    |
| GF-5 | `edge_unresolvable` | 해석 불가 → 원본 보존 + diagnostics 기록    | ☐    |

---

## 6. 공개 API 검증 — 🟡 MUST PASS

| #     | 검수 항목            | 판정 기준                             | 결과 |
| ----- | -------------------- | ------------------------------------- | ---- |
| API-1 | `transform()` export | `src/index.ts`에서 public export      | ☐    |
| API-2 | 반환 타입            | `{ code, results, diagnostics }` 구조 | ☐    |
| API-3 | `results` 배열       | 각 변환 건의 `TransformResult` 포함   | ☐    |
| API-4 | `diagnostics` 배열   | 경고/에러 메시지 수집 완료            | ☐    |

---

## 7. 테스트 통계 — 🟢 SHOULD PASS

| #    | 검수 항목                      | 판정 기준           | 결과 |
| ---- | ------------------------------ | ------------------- | ---- |
| TS-1 | `import_collector.test.ts`     | 3+ 케이스 PASS      | ☐    |
| TS-2 | `transformer_registry.test.ts` | 4+ 케이스 PASS      | ☐    |
| TS-3 | `cva_walker.test.ts`           | 5+ 케이스 PASS      | ☐    |
| TS-4 | `cn_walker.test.ts`            | 4+ 케이스 PASS      | ☐    |
| TS-5 | `classname_walker.test.ts`     | 3+ 케이스 PASS      | ☐    |
| TS-6 | `golden_file.test.ts`          | 5 fixture 전체 PASS | ☐    |

---

## 8. 판정

| 판정                          | 조건                                                             |
| ----------------------------- | ---------------------------------------------------------------- |
| ✅ **APPROVED**               | 🔴 전체 PASS + 🟡 전체 PASS → **css-transformer v1.0 출시 가능** |
| ⚠️ **CONDITIONALLY APPROVED** | 🔴 전체 PASS + 🟡 2개 이하 미달 → 수정 후 재검수                 |
| ❌ **REJECTED**               | 🔴 항목 1개 이상 FAIL → Phase 3 재수행                           |
