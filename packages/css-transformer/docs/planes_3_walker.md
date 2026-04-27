# Phase 3: Walker Registry + 구현체 + 골든 파일 테스트

> **선행 조건**: Phase 2 APPROVED (TokenAnalyzer 사용 가능)
> **산출물**: Walker Registry 시스템, 3개 Walker 구현체, ImportCollector, 골든 파일 E2E 테스트, CLI 엔트리포인트
> **사이드 이펙트 경계**: Phase 1/2의 코드는 **수정하지 않습니다**. 모든 변경은 `css-transformer` 패키지의 신규 파일에서만 이루어집니다.

---

## 1. 목적

변환 파이프라인의 최종 레이어를 완성합니다:

- Walker Registry (수집-역순실행, 우선순위 시스템)
- TransformerContext (ImportCollector, Diagnostics)
- 3개 Walker 구현체 (CvaWalker, CnWalker, ClassNameWalker)
- 골든 파일 E2E 테스트
- CLI 통합 엔트리포인트

---

## 2. 디렉토리 구조 (최종)

```
packages/css-transformer/src/
  index.ts                          — CLI 통합 진입점 (transform 함수)
  analyzer/                         — (Phase 2에서 완성, 변경 없음)
  types/                            — (Phase 2에서 완성)
    index.ts                        — ParsedToken + 아래 추가 타입
  context/
    transformer_context.ts    [NEW] — TransformerContext, Diagnostic
    import_collector.ts       [NEW] — ImportCollector 클래스
    index.ts                  [NEW]
  registry/
    transformer_registry.ts   [NEW] — TransformerRegistry (Collect → Reverse Execute)
    index.ts                  [NEW]
  walkers/
    walker_interface.ts       [NEW] — ClassTransformerWalker, TransformResult
    cva_walker.ts             [NEW] — CvaWalker (priority: 10)
    cn_walker.ts              [NEW] — CnWalker (priority: 20)
    classname_walker.ts       [NEW] — ClassNameWalker (priority: 30)
    index.ts                  [NEW]

packages/css-transformer/tests/
  analyzer/                         — (Phase 2에서 완성, 변경 없음)
  context/
    import_collector.test.ts  [NEW]
  registry/
    transformer_registry.test.ts [NEW]
  walkers/
    cva_walker.test.ts        [NEW]
    cn_walker.test.ts         [NEW]
    classname_walker.test.ts  [NEW]
  fixtures/                         — 골든 파일 E2E
    cva_button/
      input.tsx               [NEW]
      expected.tsx            [NEW]
    cn_complex/
      input.tsx               [NEW]
      expected.tsx            [NEW]
    classname_basic/
      input.tsx               [NEW]
      expected.tsx            [NEW]
    mixed_patterns/
      input.tsx               [NEW]
      expected.tsx            [NEW]
    edge_unresolvable/
      input.tsx               [NEW]
      expected.tsx            [NEW]
  e2e/
    golden_file.test.ts       [NEW] — 골든 파일 러너
```

---

## 3. 작업 항목

### 3.1 공유 타입 확장

**파일**: `src/types/index.ts` `[MODIFY]` (Phase 2 산출물에 추가)

```ts
// 기존 ParsedToken 유지 + 아래 추가

export interface TransformResult {
    success: boolean
    location: { line: number; column: number }
    original: string
    transformed: string
    warnings: string[]
}

export interface Diagnostic {
    level: "info" | "warning" | "error"
    walkerName: string
    message: string
    location?: { line: number; column: number }
}
```

### 3.2 ImportCollector

**파일**: `src/context/import_collector.ts`

| 메서드                                   | 책임                                             |
| ---------------------------------------- | ------------------------------------------------ |
| `addNamedImport(modulePath, name)`       | 필요한 import 등록                               |
| `applyTo(sourceFile)`                    | 기존 import 분석 → 누락분만 추가, 동일 모듈 병합 |
| `removeUnusedImports(sourceFile, names)` | 변환 후 불필요한 import 제거 (cva, cn, clsx 등)  |

### 3.3 TransformerContext 구성

**파일**: `src/context/transformer_context.ts`

```ts
export interface TransformerContext {
    analyzer: TokenAnalyzerImpl
    tailwindestIdentifier: string // e.g., "tw"
    tailwindestModulePath: string // e.g., "~/tw"
    imports: ImportCollector
    diagnostics: Diagnostic[]
}

export function createContext(options: {
    analyzer: TokenAnalyzerImpl
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
}): TransformerContext {
    return {
        analyzer: options.analyzer,
        tailwindestIdentifier: options.tailwindestIdentifier ?? "tw",
        tailwindestModulePath: options.tailwindestModulePath ?? "~/tw",
        imports: new ImportCollector(),
        diagnostics: [],
    }
}
```

### 3.4 TransformerRegistry (수집-역순실행)

**파일**: `src/registry/transformer_registry.ts`

핵심 알고리즘:

```
Phase 1 — Collect: forEachDescendant → canWalk 매칭 → targets 배열에 기록
Phase 2 — Reverse Execute: targets를 역순 순회 → walk() 호출
           wasForgotten() 체크 → try-catch Graceful Degradation
Phase 3 — Import Finalize: imports.applyTo(sourceFile)
```

| 메서드                           | 책임                                   |
| -------------------------------- | -------------------------------------- |
| `register(walker)`               | Walker 등록 + priority 정렬            |
| `transform(sourceFile, context)` | 3-Phase 실행, `TransformResult[]` 반환 |

### 3.5 Walker 구현체

#### CvaWalker (priority: 10)

- **canWalk**: `CallExpression` + 함수명 `cva`
- **walk**:
    1. 첫 번째 인자 (base 문자열) → `analyzer.analyze()` → `buildObjectTree()` → base 객체
    2. 두 번째 인자 ObjectLiteral의 `variants` 프로퍼티 → 각 값을 Analyzer로 변환
    3. `defaultVariants` → JSDoc 주석으로 보존
    4. `compoundVariants` → 주석 블록으로 보존 (전략 A)
    5. `tw.variants({ base, variants })` 코드 생성 → `replaceWithText()`
    6. `context.imports.addNamedImport()`로 tw import 등록
    7. `cva` import를 제거 대상으로 등록

#### CnWalker (priority: 20)

- **canWalk**: `CallExpression` + 함수명 `cn` / `clsx` / `classNames`
- **walk**:
    1. 인자를 유형별 분류: StringLiteral → Analyzer, 기타 → 그대로 유지
    2. `tw.def([동적인자들], {정적객체})` 코드 생성
    3. 동적 인자만 있으면 `tw.join(...)`, 정적만 있으면 `tw.style({...}).class()`

#### ClassNameWalker (priority: 30)

- **canWalk**: `JsxAttribute` + 속성명 `className` + 값이 `StringLiteral`
- **walk**:
    1. 문자열을 Analyzer로 변환
    2. `tw.style({...}).class()` 코드 생성
    3. `className="..."` → `className={tw.style({...}).class()}`

### 3.6 CLI 엔트리포인트

**파일**: `src/index.ts`

```ts
export async function transform(
    sourceCode: string,
    options: TransformOptions
): Promise<TransformOutput> {
    // 1. ts-morph Project 생성 + sourceFile 파싱
    // 2. Resolver 확보 (외부 주입 또는 자체 생성)
    // 3. TokenAnalyzer 생성
    // 4. TransformerContext 구성
    // 5. TransformerRegistry 구성 + Walker 등록
    // 6. registry.transform() 실행
    // 7. sourceFile.getFullText() 반환
}

export interface TransformOptions {
    tailwindestIdentifier?: string
    tailwindestModulePath?: string
    resolver: CSSPropertyResolver
}

export interface TransformOutput {
    code: string
    results: TransformResult[]
    diagnostics: Diagnostic[]
}
```

### 3.7 골든 파일 E2E 테스트

**파일**: `tests/e2e/golden_file.test.ts`

```ts
// glob으로 fixtures/ 하위 디렉토리를 자동 탐색
// 각 fixture의 input.tsx → transform() → expected.tsx와 비교
```

**최소 5개 Fixture**:

| Fixture             | Walker          | 검증 포인트                                     |
| ------------------- | --------------- | ----------------------------------------------- |
| `cva_button`        | CvaWalker       | base + variants 변환, defaultVariants 주석 보존 |
| `cn_complex`        | CnWalker        | 혼합 인자 (문자열 + 조건부 + 변수)              |
| `classname_basic`   | ClassNameWalker | 단순 className 문자열 → tw.style                |
| `mixed_patterns`    | 복수 Walker     | cva + cn + className이 하나의 파일에 공존       |
| `edge_unresolvable` | 모두            | 해석 불가 클래스 → 원본 보존 + 경고             |

---

## 4. 산출물 체크리스트

- [ ] `src/context/import_collector.ts` — ImportCollector 클래스
- [ ] `src/context/transformer_context.ts` — Context + 팩토리 함수
- [ ] `src/registry/transformer_registry.ts` — 수집-역순실행 Registry
- [ ] `src/walkers/walker_interface.ts` — Walker 인터페이스, TransformResult
- [ ] `src/walkers/cva_walker.ts` — CvaWalker (compoundVariants 주석 보존)
- [ ] `src/walkers/cn_walker.ts` — CnWalker
- [ ] `src/walkers/classname_walker.ts` — ClassNameWalker
- [ ] `src/index.ts` — `transform()` 공개 API
- [ ] `tests/context/import_collector.test.ts` — 3+ 케이스
- [ ] `tests/registry/transformer_registry.test.ts` — 4+ 케이스
- [ ] `tests/walkers/cva_walker.test.ts` — 5+ 케이스
- [ ] `tests/walkers/cn_walker.test.ts` — 4+ 케이스
- [ ] `tests/walkers/classname_walker.test.ts` — 3+ 케이스
- [ ] `tests/fixtures/` — 5개 fixture (input.tsx + expected.tsx)
- [ ] `tests/e2e/golden_file.test.ts` — 골든 파일 러너
- [ ] **Phase 2의 테스트에 영향 없음**
- [ ] **Phase 1의 테스트에 영향 없음**

---

## 5. 완료 조건 (Exit Criteria)

1. `css-transformer` 패키지 내 `npm test` → **전체 통과** (Phase 2 테스트 포함).
2. 골든 파일 E2E 테스트 5개 **전체 통과**.
3. `transform()` 함수가 `shadcn/ui` 스타일의 `cva` 코드를 `tw.variants`로 정상 변환.
4. 변환 불가 패턴이 원본 보존 + `diagnostics`에 기록.
5. `ImportCollector`가 기존 import에 병합 또는 신규 추가 수행.
6. `create-tailwind-type`, `tailwindest` 패키지에 **변경 없음**.
