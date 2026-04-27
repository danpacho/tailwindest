# 테스트 전략 상세 설계

이 문서는 `css-transformer`의 테스트 인프라 설계를 정의합니다. **골든 파일(Golden File) 기반 통합 테스트**를 중심으로, 각 레이어의 단위 테스트 경계를 명확히 합니다.

## 1. 테스트 계층 구조

```
┌────────────────────────────────────────────────┐
│        E2E / Golden File Tests                 │  파이프라인 전체 정합성
│   input.tsx → transform() → expected.tsx 비교   │
├────────────────────────────────────────────────┤
│        Integration Tests                       │  레이어 간 연동
│   Analyzer + Resolver 연동                      │
│   Walker + Analyzer + Registry 연동             │
├────────────────────────────────────────────────┤
│        Unit Tests                              │  개별 모듈 격리
│   CSSPropertyResolver.resolve()                │
│   TokenAnalyzer.analyze() / buildObjectTree()  │
│   각 Walker.canWalk() / walk()                  │
│   ImportCollector.applyTo()                    │
│   splitByColon() 등 유틸리티 함수               │
└────────────────────────────────────────────────┘
```

---

## 2. 골든 파일(Golden File) 테스트

### 2.1 디렉토리 구조

```
packages/css-transformer/
  tests/
    fixtures/
      cva_button/
        input.tsx           ← shadcn/ui button.tsx 원본
        expected.tsx        ← 변환 기대 결과
        options.json        ← (선택) 변환 옵션 오버라이드
      cva_with_compound/
        input.tsx
        expected.tsx
      cn_complex/
        input.tsx
        expected.tsx
      cn_with_ternary/
        input.tsx
        expected.tsx
      classname_basic/
        input.tsx
        expected.tsx
      mixed_patterns/
        input.tsx
        expected.tsx
      edge_arbitrary_value/
        input.tsx
        expected.tsx
      edge_template_literal/
        input.tsx
        expected.tsx
      edge_unresolvable/
        input.tsx
        expected.tsx
```

### 2.2 테스트 러너

```ts
import { glob } from "glob"
import { readFileSync } from "fs"
import { basename } from "path"
import { transform } from "../src"

describe("css-transformer e2e", () => {
    const fixtureRoot = "tests/fixtures"
    const fixtures = glob.sync(`${fixtureRoot}/*/`)

    fixtures.forEach((fixture) => {
        const name = basename(fixture)

        it(`transforms: ${name}`, async () => {
            const input = readFileSync(`${fixture}/input.tsx`, "utf-8")
            const expected = readFileSync(`${fixture}/expected.tsx`, "utf-8")

            // 옵션 파일이 있으면 로드
            let options = { tailwindestIdentifier: "tw" }
            try {
                const optionsRaw = readFileSync(
                    `${fixture}/options.json`,
                    "utf-8"
                )
                options = { ...options, ...JSON.parse(optionsRaw) }
            } catch {
                /* 기본 옵션 사용 */
            }

            const result = await transform(input, options)

            expect(result.code).toBe(expected.trimEnd())
            expect(result.errors).toHaveLength(0)
        })
    })
})
```

### 2.3 Fixture 작성 가이드

| Fixture 이름            | 검증 대상             | 핵심 Edge Case                 |
| ----------------------- | --------------------- | ------------------------------ |
| `cva_button`            | CvaWalker 기본 동작   | base + variants 구조           |
| `cva_with_compound`     | compoundVariants 처리 | 주석 보존 전략 검증            |
| `cn_complex`            | CnWalker 복합 인자    | 조건부, 변수, 배열 혼합        |
| `cn_with_ternary`       | Ternary 분기 처리     | 각 분기별 독립 변환            |
| `classname_basic`       | ClassNameWalker       | 단순 문자열 → tw.style()       |
| `mixed_patterns`        | 다중 Walker 공존      | cva + cn + className 혼합 파일 |
| `edge_arbitrary_value`  | `px-[2.25px]` 등      | Analyzer 파싱 정확성           |
| `edge_template_literal` | 템플릿 리터럴         | 정적 부분 추출 or skip         |
| `edge_unresolvable`     | 해석 불가 클래스      | 원본 보존 + 경고               |

---

## 3. 단위 테스트 경계

### 3.1 CSSPropertyResolver

```ts
describe("CSSPropertyResolver", () => {
    // Mock deps 주입으로 격리 테스트
    const mockDeps: PropertyResolverDeps = {
        candidatesToCss: (candidates) =>
            candidates.map((c) => `/* mock css for ${c} */`),
        parseStyleBlock: (css) => ({
            rootSelector: ".mock",
            styles: { backgroundColor: "red" },
        }),
        typeAliasMap: new Map(/* ... */),
        variants: ["hover", "focus", "dark", "sm"],
        colorVariableSet: new Set(["red", "blue"]),
    }

    it("resolves bg-accent → backgroundColor", () => {
        /* ... */
    })
    it("resolves size-4 → disambiguated result", () => {
        /* ... */
    })
    it("returns null for unknown utility", () => {
        /* ... */
    })
})
```

### 3.2 TokenAnalyzer

```ts
describe("TokenAnalyzer", () => {
    it("splits and extracts variants correctly", () => {
        /* ... */
    })
    it("handles arbitrary variant [&:hover]:text-sm", () => {
        /* ... */
    })
    it("handles key collision with array promotion", () => {
        /* ... */
    })
    it("preserves group prefix in object keys", () => {
        /* ... */
    })
    it("marks unresolvable tokens with warning", () => {
        /* ... */
    })
})
```

### 3.3 Walker 격리 테스트

각 Walker는 `ts-morph`의 인메모리 `Project`를 사용하여 격리 테스트합니다:

```ts
describe("CvaWalker", () => {
    it("detects cva() call expression", () => {
        const project = new Project({ useInMemoryFileSystem: true })
        const source = project.createSourceFile(
            "test.tsx",
            `
      const x = cva("flex", { variants: { size: { sm: "text-sm" } } })
    `
        )

        const walker = new CvaWalker()
        const cvaNode = source.getDescendantsOfKind(
            SyntaxKind.CallExpression
        )[0]!

        expect(walker.canWalk(cvaNode)).toBe(true)
    })

    it("transforms cva to tw.variants", () => {
        /* ... */
    })
    it("preserves compoundVariants as comment", () => {
        /* ... */
    })
    it("preserves defaultVariants as JSDoc", () => {
        /* ... */
    })
})
```

### 3.4 ImportCollector

```ts
describe("ImportCollector", () => {
    it("adds new import when none exists", () => {
        /* ... */
    })
    it("merges into existing import from same module", () => {
        /* ... */
    })
    it("does not duplicate already imported names", () => {
        /* ... */
    })
})
```

---

## 4. Snapshot 업데이트 워크플로

Fixture의 `expected.tsx`가 의도적으로 변경되어야 할 때:

```bash
# 모든 fixture의 expected.tsx를 현재 변환 결과로 갱신
npx css-transformer test --update-snapshots

# 특정 fixture만 갱신
npx css-transformer test --update-snapshots --filter cva_button
```

갱신 후 반드시 `git diff`로 변경 내용을 검토합니다.

---

## 5. CI 통합

```yaml
# .github/workflows/test.yml
- name: Run css-transformer tests
  run: |
      cd packages/css-transformer
      npm test
  env:
      NODE_OPTIONS: "--experimental-vm-modules"
```

골든 파일 테스트 실패 시 CI가 실패하여, 회귀를 즉시 감지합니다.
