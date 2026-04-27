# Walker Registry (변환 엔진) 설계 상세

이 문서는 AST 노드를 순회하고 특수한 패턴(`cva`, `cn`, `clsx` 등)을 식별하여 `tailwindest` API로 재조립하는 **Walker Registry 시스템**의 아키텍처 상세를 정의합니다.

## 1. 목적 및 철학

일반적인 AST 변환기는 거대한 `if-else` 분기문으로 인해 유지보수가 급격히 어려워집니다.
이를 해결하기 위해, 각 패턴별 변환 로직을 캡슐화한 `ClassTransformerWalker` 객체들을 **우선순위 기반 Registry**에 플러그인처럼 등록하고, 코어가 이들에게 변환 책임을 위임하는 **Strategy Pattern**을 채택합니다.

---

## 2. 코어 인터페이스

### 2.1 ClassTransformerWalker

```ts
import { Node } from "ts-morph"

export interface ClassTransformerWalker {
    /** Walker의 고유 이름 (디버깅/로깅 용도) */
    name: string

    /**
     * Walker의 실행 우선순위. 낮을수록 먼저 매칭됩니다.
     * - 10: 최우선 (cva — 가장 구체적인 패턴)
     * - 20: 중간 (cn, clsx — 함수 호출 패턴)
     * - 30: 기본 (className 속성 — 가장 일반적)
     */
    priority: number

    /**
     * 해당 AST 노드가 이 Walker에서 처리 가능한지 여부를 반환합니다.
     * 이 메서드는 부작용(side-effect) 없이 순수 판별만 수행해야 합니다.
     */
    canWalk(node: Node): boolean

    /**
     * AST 노드를 분석하고 tailwindest 코드로 변환/교체합니다.
     * 성공/실패 여부와 변환 상세 정보를 TransformResult로 반환합니다.
     */
    walk(node: Node, context: TransformerContext): TransformResult
}
```

### 2.2 우선순위 시스템

등록 순서에 결과가 의존하는 문제를 방지합니다. Registry는 등록 시 `priority` 기준으로 정렬합니다.

| Walker                    | Priority | 근거                                                      |
| ------------------------- | -------- | --------------------------------------------------------- |
| `CvaWalker`               | 10       | `cva()` 호출은 가장 구체적. 내부에 variants 구조까지 포함 |
| `CnWalker` / `ClsxWalker` | 20       | `cn()`, `clsx()` 함수 호출 패턴                           |
| `ClassNameWalker`         | 30       | `className="..."` — 가장 일반적이므로 마지막              |

동일 노드에 여러 Walker가 매칭 가능할 때, 가장 낮은 priority의 Walker만 실행됩니다(first-match-wins after sort).

### 2.3 TransformResult 인터페이스

모든 `walk()` 호출의 결과를 추적합니다. Dry-run, 리포팅, 에러 복구에 사용됩니다.

```ts
export interface TransformResult {
    /** 변환 성공 여부 */
    success: boolean
    /** 변환된 노드의 위치 정보 */
    location: { line: number; column: number }
    /** 원본 코드 스니펫 */
    original: string
    /** 변환된 코드 스니펫 */
    transformed: string
    /** 경고 메시지 (부분 변환, 해석 불가 토큰 등) */
    warnings: string[]
}
```

### 2.4 TransformerContext 확장

Walker가 공유하는 실행 컨텍스트입니다. Import 관리와 진단 수집 책임이 추가되었습니다.

```ts
export interface Diagnostic {
    level: "info" | "warning" | "error"
    walkerName: string
    message: string
    location?: { line: number; column: number }
}

export interface TransformerContext {
    /** Token Analyzer 인스턴스 */
    analyzer: TokenAnalyzer
    /** 프로젝트 내 tailwindest 생성자 이름 (e.g., "tw") */
    tailwindestIdentifier: string
    /** tailwindest 모듈 경로 (e.g., "~/tw", "@/lib/tw") */
    tailwindestModulePath: string

    /**
     * 변환 중 필요한 import를 수집합니다.
     * 모든 Walker 실행 완료 후 일괄 적용됩니다.
     */
    imports: ImportCollector

    /**
     * 진단 메시지(경고, 에러)를 수집합니다.
     * 최종 리포트 출력에 사용됩니다.
     */
    diagnostics: Diagnostic[]
}
```

### 2.5 ImportCollector

```ts
export class ImportCollector {
    /** module path → named imports */
    private required = new Map<string, Set<string>>()

    /** 필요한 import를 등록합니다 */
    addNamedImport(modulePath: string, name: string): void {
        if (!this.required.has(modulePath)) {
            this.required.set(modulePath, new Set())
        }
        this.required.get(modulePath)!.add(name)
    }

    /**
     * SourceFile의 기존 import를 분석하고, 누락된 것만 추가합니다.
     * 기존에 동일 모듈에서 다른 심볼을 이미 import하고 있다면 해당 구문에 병합합니다.
     */
    applyTo(sourceFile: SourceFile): void {
        for (const [modulePath, names] of this.required) {
            const existing = sourceFile.getImportDeclaration(modulePath)
            if (existing) {
                // 기존 import에 누락된 named import만 추가
                for (const name of names) {
                    if (
                        !existing
                            .getNamedImports()
                            .some((n) => n.getName() === name)
                    ) {
                        existing.addNamedImport(name)
                    }
                }
            } else {
                sourceFile.addImportDeclaration({
                    moduleSpecifier: modulePath,
                    namedImports: Array.from(names),
                })
            }
        }
    }

    /**
     * 불필요해진 기존 import(e.g., cva, cn, clsx)를 제거합니다.
     */
    removeUnusedImports(sourceFile: SourceFile, names: string[]): void {
        // 변환 후 해당 심볼이 더 이상 참조되지 않으면 제거
    }
}
```

---

## 3. Stale Node 방지 전략 (Collect → Reverse Execute)

### 3.1 문제

`ts-morph`에서 `node.replaceWithText()`를 호출하면 해당 노드 주변의 **모든 형제/후손 노드 참조가 무효화**됩니다. `forEachDescendant` 순회 중 교체를 수행하면:

- `Error: This node was already forgotten` 런타임 에러
- 조용한 누락(silent skip) — 교체 후 새 노드 내부의 중첩 패턴 미처리

### 3.2 해결: 2-Phase 패턴

```ts
export class TransformerRegistry {
    private walkers: ClassTransformerWalker[] = []

    public register(walker: ClassTransformerWalker): void {
        this.walkers.push(walker)
        this.walkers.sort((a, b) => a.priority - b.priority)
    }

    public transform(
        sourceFile: SourceFile,
        context: TransformerContext
    ): TransformResult[] {
        // ═══════════════════════════════════════════════
        // Phase 1: 수집 (Collect)
        //   순회만 하고 변환 대상 + 매칭 Walker를 기록합니다.
        //   이 단계에서는 AST를 절대 변경하지 않습니다.
        // ═══════════════════════════════════════════════
        const targets: Array<{
            node: Node
            walker: ClassTransformerWalker
        }> = []

        sourceFile.forEachDescendant((node) => {
            for (const walker of this.walkers) {
                if (walker.canWalk(node)) {
                    targets.push({ node, walker })
                    break // first-match-wins (priority 정렬 기준)
                }
            }
        })

        // ═══════════════════════════════════════════════
        // Phase 2: 역순 실행 (Reverse Execute)
        //   소스 파일의 뒤쪽 노드부터 교체하여
        //   앞쪽 노드의 위치(offset)가 변하지 않도록 합니다.
        // ═══════════════════════════════════════════════
        const results: TransformResult[] = []

        for (let i = targets.length - 1; i >= 0; i--) {
            const { node, walker } = targets[i]!

            // 이전 교체로 인해 이미 무효화된 노드는 skip
            if (node.wasForgotten()) {
                context.diagnostics.push({
                    level: "warning",
                    walkerName: walker.name,
                    message: `Node was already modified by a prior transformation. Skipped.`,
                })
                continue
            }

            try {
                const result = walker.walk(node, context)
                results.push(result)
            } catch (error) {
                // Graceful Degradation: 단일 노드 실패가 전체를 중단시키지 않음
                context.diagnostics.push({
                    level: "error",
                    walkerName: walker.name,
                    message: `Transform failed: ${error instanceof Error ? error.message : String(error)}`,
                    location: {
                        line: node.getStartLineNumber(),
                        column: node.getStartLinePos(),
                    },
                })
            }
        }

        // ═══════════════════════════════════════════════
        // Phase 3: Import 정리
        //   수집된 import 요구사항을 일괄 적용합니다.
        // ═══════════════════════════════════════════════
        context.imports.applyTo(sourceFile)

        return results
    }
}
```

---

## 4. Walker 구현체 설계

### 4.1 `CvaWalker`

**목적**: `cva(...)` 호출을 `tw.variants(...)` 로 변환합니다.

**`canWalk` 로직**: 노드가 `CallExpression`이고 호출 함수 이름이 `cva`인지 확인합니다.

**`walk` 로직 — `cva`의 전체 구조 대응**:

```ts
// shadcn/ui의 실제 cva 구조
cva(baseClasses, {
  variants: { ... },
  defaultVariants: { ... },
  compoundVariants: [ ... ],
})
```

| cva 요소                   | tailwindest 대응         | 변환 전략                                                                            |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| 첫 번째 인자 (base 문자열) | `base: {...}`            | Analyzer로 객체 트리 생성                                                            |
| `variants`                 | `variants: {...}`        | 각 variant 값의 문자열을 Analyzer로 변환                                             |
| `defaultVariants`          | `// @default` 주석       | `tailwindest`에 직접 대응 API가 없으므로 주석으로 보존하거나, 호출부에서 기본값 적용 |
| `compoundVariants`         | `// @compound` 주석 블록 | 아래 §4.1.1 참조                                                                     |

#### 4.1.1 `compoundVariants` 대응 전략

`tailwindest`의 `VariantsStyler`에는 `compoundVariants` API가 없습니다. 두 가지 전략을 선택할 수 있습니다:

**전략 A: 주석 보존 (안전 우선)**

```ts
// 변환 결과
const buttonVariants = tw.variants({
    base: {
        /* ... */
    },
    variants: {
        variant: {
            default: {
                /* ... */
            },
            destructive: {
                /* ... */
            },
        },
        size: {
            default: {
                /* ... */
            },
            sm: {
                /* ... */
            },
        },
    },
})

// ⚠️ compoundVariants는 자동 변환이 불가합니다. 수동 처리가 필요합니다:
// compoundVariants: [
//   { variant: "outline", size: "sm", class: "border-2" }
// ]
```

**전략 B: 래퍼 함수 생성 (완전 자동화)**

```ts
// compoundVariants 로직을 별도 함수로 추출
function applyCompoundVariants(
    props: VariantOptions,
    baseClass: string
): string {
    let result = baseClass
    if (props.variant === "outline" && props.size === "sm") {
        result = tw.join(result, "border-2")
    }
    return result
}
```

> **권장**: 초기 버전에서는 **전략 A(주석 보존)**를 채택합니다. `compoundVariants`는 실무에서 사용 빈도가 낮으며, 잘못된 자동 변환보다 명시적 수동 처리가 안전합니다.

#### 4.1.2 `defaultVariants` 대응

```ts
// 원본
cva("...", {
    variants: { variant: { default: "...", destructive: "..." } },
    defaultVariants: { variant: "default" },
})

// 변환 결과 — defaultVariants는 JSDoc 주석으로 보존
/**
 * @defaultVariants { variant: "default" }
 */
const buttonVariants = tw.variants({
    base: {
        /* ... */
    },
    variants: {
        /* ... */
    },
})
```

### 4.2 `CnWalker` / `ClsxWalker`

**목적**: `cn(...)` 또는 `clsx(...)` 호출을 `tw.def(...)` 로 변환합니다.

**`canWalk` 로직**: 함수 이름이 `cn`, `clsx`, `classNames` 등인지 확인합니다.

**`walk` 로직**: 인자를 유형별로 분류합니다.

```ts
cn(
    "flex items-center", // → 고정 문자열: Analyzer로 객체 트리 생성
    isDisabled && "opacity-50", // → 조건부: tw.join() 인자로 유지
    size === "lg" ? "px-4" : "px-2", // → Ternary: 각 분기 문자열만 변환
    dynamicVar // → 변수 참조: 그대로 유지
)
```

**변환 결과**:

```ts
tw.def(
    [isDisabled && "opacity-50", size === "lg" ? "px-4" : "px-2", dynamicVar],
    { display: "flex", alignItems: "items-center" }
)
```

**인자 유형 분류 표**:

| AST 노드 타입                   | 처리 방식                                        |
| ------------------------------- | ------------------------------------------------ |
| `StringLiteral`                 | Analyzer로 변환 → styleList에 병합               |
| `BinaryExpression` (`&&`)       | 우변이 문자열이면 변환, 전체를 classList에 유지  |
| `ConditionalExpression` (`? :`) | 각 분기의 문자열만 변환, 구조는 classList에 유지 |
| `Identifier` (변수 참조)        | 그대로 classList에 유지                          |
| `TemplateExpression`            | 정적 부분만 추출 시도, 실패 시 그대로 유지       |
| `CallExpression` (중첩 함수)    | 그대로 classList에 유지                          |

### 4.3 `ClassNameWalker`

**목적**: `<div className="text-sm font-bold" />` 구문을 변환합니다.

**`canWalk` 로직**: 노드가 `JsxAttribute`이고 속성명이 `className`이며 값이 `StringLiteral`인지 확인합니다.

**변환 결과**:

```tsx
// Before
<div className="flex items-center hover:bg-accent" />

// After
<div className={tw.style({
  display: "flex",
  alignItems: "items-center",
  hover: { backgroundColor: "hover:bg-accent" }
}).class()} />
```

**Walker가 수행하는 import 등록**:

```ts
// walk() 내부
context.imports.addNamedImport(
    context.tailwindestModulePath,
    context.tailwindestIdentifier
)
```

---

## 5. 전체 실행 흐름 요약

```
CLI Entry
  │
  ├── 1. TailwindTypeGenerator.init()
  │       └── CSSPropertyResolver 생성 (싱글턴 캐시)
  │
  ├── 2. TokenAnalyzer 생성 (Resolver 주입)
  │
  ├── 3. TransformerContext 구성
  │       ├── analyzer
  │       ├── imports: new ImportCollector()
  │       └── diagnostics: []
  │
  ├── 4. TransformerRegistry 구성
  │       ├── register(new CvaWalker())       // priority: 10
  │       ├── register(new CnWalker())        // priority: 20
  │       └── register(new ClassNameWalker()) // priority: 30
  │
  ├── 5. 파일별 변환 루프
  │       ├── ts-morph로 SourceFile 파싱
  │       ├── registry.transform(sourceFile, context)
  │       │     ├── Phase 1: Collect (순회 + 매칭)
  │       │     ├── Phase 2: Reverse Execute (역순 교체)
  │       │     └── Phase 3: Import 정리
  │       └── sourceFile.saveSync() + prettier
  │
  └── 6. 최종 리포트 출력
          ├── 변환 성공: N개 cva, M개 cn, K개 className
          ├── 경고: L개 (부분 변환, 해석 불가 등)
          └── 에러: E개 (변환 실패, 원본 보존)
```
