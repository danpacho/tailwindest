# Tailwindest CSS Transformer Architecture

`css-transformer`는 기존의 문자열 기반 Tailwind CSS 코드(특히 `shadcn/ui` 등에서 주로 사용되는 `cva`, `clsx`, `cn` 패턴)를 `tailwindest`의 타입 안전한 중첩 객체(Nested Object) 형태로 자동 변환하는 CLI 도구입니다.

## 🎯 설계 철학 (Design Principles)

1.  **정밀한 1:1 매핑**: `create-tailwind-type` 패키지의 검증된 매핑 로직을 **의존성 주입(DI)** 기반으로 분리·재사용하여 완벽한 변환을 보장합니다.
2.  **확장 가능한 파서 (Strategy/Registry)**: `cva`, `cn`, 일반 `className` 등 다양한 형태의 클래스 선언 방식을 **우선순위 기반 플러그인**으로 처리합니다.
3.  **독립적인 관심사 분리**: AST 탐색, 문자열 분석, 속성 해석, 코드 조립, Import 관리의 책임을 완벽히 분리합니다.
4.  **안전한 변환 (Graceful Degradation)**: 변환 불가능한 패턴은 원본을 보존하고 경고를 수집합니다. 단일 노드의 실패가 전체 파일 변환을 중단시키지 않습니다.
5.  **추적 가능한 결과**: 모든 변환은 `TransformResult`를 반환하여 리포팅, Dry-run, 디버깅이 가능합니다.

---

## 🏗️ 전체 파이프라인 (The Pipeline)

파이프라인은 5개의 단계로 나뉘며, 각 컴포넌트는 독립적으로 동작합니다.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CSS Transformer CLI                        │
├──────┬──────────┬──────────────┬────────────────┬──────────────────┤
│  1   │    2     │      3       │       4        │        5         │
│ AST  │ Property │    Token     │    Walker      │     Output       │
│Parse │ Resolver │   Analyzer   │   Registry     │   & Finalize     │
│      │  (DI)    │              │ (Collect →     │                  │
│      │          │              │  Reverse Exec) │                  │
├──────┼──────────┼──────────────┼────────────────┼──────────────────┤
│ts-   │generator │ Split →      │ Priority-based │ ImportCollector   │
│morph │.ts 로직   │ Extract →    │ Walker 매칭     │ → 누락 import 삽입│
│소스   │DI로 분리  │ Resolve →    │ 수집 → 역순 실행 │ Prettier 포맷팅   │
│파싱   │          │ BuildTree    │ TransformResult│ 결과 리포트 출력   │
└──────┴──────────┴──────────────┴────────────────┴──────────────────┘
```

1.  **AST 생성 (AST Extraction)**: `ts-morph`를 통해 소스 코드를 구문 트리로 파싱합니다.
2.  **[CSS Property Resolver (속성 해석 엔진)](./details_resolver.md)**: `generator.ts`의 매핑 로직을 DI 기반 독립 모듈로 분리합니다.
3.  **[Token Analyzer (매핑 엔진)](./details_analyzer.md)**: Resolver를 활용하여 클래스 문자열을 `tailwindest`의 속성명으로 1:1 변환합니다.
4.  **[Walker Registry (변환 엔진)](./details_walker.md)**: AST를 순회하며 특정 패턴(`cva`, `cn` 등)을 감지하고, **수집-역순실행(Collect-Reverse Execute)** 패턴으로 안전하게 코드를 재조립합니다.
5.  **Output & Finalize (출력)**: `ImportCollector`가 필요한 import를 삽입하고, `prettier`를 거쳐 소스 코드로 기록합니다. `TransformResult` 기반 리포트를 출력합니다.

---

## 🔑 핵심 설계 결정 사항 (Key Design Decisions)

### D-1. Stale Node 문제 방지

`ts-morph`에서 AST 노드를 교체하면 주변 노드 참조가 무효화됩니다. 이를 방지하기 위해 **수집(Collect) → 역순 실행(Reverse Execute)** 패턴을 채택합니다.

> 👉 상세: [Walker Registry §3. Stale Node 방지 전략](./details_walker.md#3-stale-node-방지-전략-collect--reverse-execute)

### D-2. `generator.ts` DI 기반 분리

`getPropertyName` 등 핵심 함수는 5개 이상의 인스턴스 상태에 결합되어 있어, 단순 파일 이동이 불가합니다. **의존성 주입(DI)** 기반의 `CSSPropertyResolver`로 추출합니다.

> 👉 상세: [CSS Property Resolver 상세 설계](./details_resolver.md)

### D-3. Walker 우선순위 시스템

등록 순서에 결과가 의존하는 문제를 방지하기 위해, 각 Walker에 명시적 `priority` 값을 부여합니다.

> 👉 상세: [Walker Registry §2.2 우선순위 시스템](./details_walker.md#22-우선순위-시스템)

### D-4. 변환 결과 추적 (`TransformResult`)

모든 `walk()` 호출은 `TransformResult`를 반환하여 dry-run, 리포팅, 에러 복구를 가능하게 합니다.

> 👉 상세: [Walker Registry §2.3 TransformResult](./details_walker.md#23-transformresult-인터페이스)

### D-5. `TransformerContext` 확장

Import 관리(`ImportCollector`), 진단 메시지 수집(`Diagnostics`)을 Context에 통합합니다.

> 👉 상세: [Walker Registry §2.4 TransformerContext](./details_walker.md#24-transformercontext-확장)

### D-6. 골든 파일 테스트

Snapshot 기반의 입력/기대출력 비교 테스트로 파이프라인 전체의 정합성을 검증합니다.

> 👉 상세: [테스트 전략 상세 설계](./details_testing.md)

---

## 📚 상세 아키텍처 문서 (Detailed Documents)

각 모듈에 대한 정밀한 설계와 인터페이스는 아래의 상세 문서에서 확인할 수 있습니다.

- **[👉 CSS Property Resolver 상세 설계 (details_resolver.md)](./details_resolver.md)** `[NEW]`
    - `generator.ts`로부터의 DI 기반 분리 전략
    - `CSSPropertyResolver` 인터페이스 및 의존성 구조
    - Property Ambiguity (다중 매핑) 해결 정책
- **[👉 Token Analyzer 상세 설계 (details_analyzer.md)](./details_analyzer.md)**
    - `CSSPropertyResolver`를 활용한 속성 해석 메커니즘
    - 문자열 분해 및 Variant 추출 프로세스
    - 키 충돌(Key Collision) 처리 정책
- **[👉 Walker Registry 상세 설계 (details_walker.md)](./details_walker.md)**
    - `ClassTransformerWalker` 인터페이스 규격 (우선순위, `TransformResult`)
    - 수집-역순실행(Collect-Reverse Execute) 안전 패턴
    - `TransformerContext` 확장 (`ImportCollector`, `Diagnostics`)
    - `CvaWalker` (`compoundVariants`, `defaultVariants` 포함), `CnWalker`, `ClassNameWalker` 전략
- **[👉 테스트 전략 상세 설계 (details_testing.md)](./details_testing.md)** `[NEW]`
    - 골든 파일(Golden File) 테스트 인프라
    - 단위/통합 테스트 경계 정의
    - Fixture 관리 방안
