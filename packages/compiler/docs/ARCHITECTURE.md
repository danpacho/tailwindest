# Tailwindest Compiler Architecture

`compiler`는 개발자가 작성한 `tailwindest`의 타입 안전한 중첩 객체 스타일을 빌드 타임에 분석하여, 런타임 오버헤드가 전혀 없는 **순수 Tailwind CSS 문자열 리터럴**로 치환하는 Zero-runtime 최적화 엔진입니다.

## 🎯 설계 철학 (Design Principles)

1.  **Zero Runtime Overhead**: 실행 시점의 스타일 연산을 제거하고 정적 결과물로 치환합니다.
2.  **Shared Compiler Engine (Dev/Prod Parity)**: 개발(Dev)과 운영(Prod) 환경에서 동일한 컴파일 엔진을 공유하여 결과물의 100% 일관성을 보장합니다.
3.  **Direct Class Injection**: Tailwind JIT 스캐너에 의존하지 않고, 컴파일러가 수집한 클래스를 Tailwind 엔진에 직접 주입(방안 C)합니다.
4.  **Type-Safe DX, Static UX**: 개발자는 타입 안전한 객체를 작성하고, 사용자는 최적화된 클래스 문자열을 받습니다.

---

## 🏗️ 전체 파이프라인 (The Pipeline)

컴파일러는 스타일을 "추출 → 해석 → 주입 → 치환"하는 4단계 파이프라인으로 동작합니다.

```
┌───────────────────────────────────────────────────────────────────────┐
│                        Tailwindest Compiler                           │
├──────┬──────────────┬────────────────┬────────────────┬───────────────┤
│  1   │      2       │       3        │       4        │       5       │
│ AST  │   Static     │   Evaluation   │ Class Injection│ Substitution  │
│ Scan │  Detection   │    Engine      │ (TW Plugin)    │   (AST Mod)   │
├──────┼──────────────┼────────────────┼────────────────┼───────────────┤
│ts-   │ tw.style     │ Shared Engine  │ Direct Report  │ CallExpr →    │
│morph │ tw.variants  │ Recursive      │ to Tailwind    │ String        │
│구문   │ 호출부 탐지    │ Flattening     │ JIT Engine     │ Literal       │
└──────┴──────────────┴────────────────┴────────────────┴───────────────┘
```

1.  **AST Scan**: `ts-morph`를 사용하여 소스 코드의 전체 구조를 파악합니다. (HMR 시 변경된 파일만 타겟팅)
2.  **Static Detection**: 컴파일 가능한 정적 호출부를 식별합니다.
3.  **Evaluation Engine**: 중첩된 객체를 순회하며 최종 클래스 문자열을 생성합니다. **이 엔진은 모든 환경에서 동일하게 동작합니다.**
4.  **Class Injection**: 추출된 클래스들을 `tailwindest` 전용 Tailwind 플러그인을 통해 Tailwind 엔진에 직접 등록합니다. 이로써 Tailwind는 우리가 생성한 클래스를 즉시 인식합니다.
5.  **Substitution**: 분석된 결과를 바탕으로 소스 코드의 함수 호출부를 정적 리터럴로 치환합니다.

---

## 🔑 핵심 설계 결정 사항 (Key Design Decisions)

### D-1. Shared Evaluation Engine

개발 서버(Vite 등)의 플러그인과 빌드 스크립트가 동일한 `Evaluation Engine`을 호출합니다. 이를 통해 "개발 때는 보였는데 배포하니 깨지는" 고질적인 문제를 원천 봉쇄합니다.

### D-2. Tailwind Plugin 기반의 공생 (방안 C)

Tailwind의 JIT 스캐너가 소스 파일을 텍스트로 긁는 방식은 중첩 객체를 완벽히 이해할 수 없습니다. 따라서 컴파일러가 스타일을 완전히 해석한 후, **Tailwind 플러그인 API**를 사용하여 완성된 클래스 목록을 직접 전달합니다.

### D-3. Two-Tier Parsing (성능 최적화)

실시간 HMR 속도를 위해, 먼저 단순 키워드 매칭으로 대상을 필터링(Tier 1)하고, 필요한 경우에만 정밀 AST 분석(Tier 2)을 수행합니다.

### D-2. Static vs Dynamic 분리

- **Static Style**: 인자가 없는 정적 스타일은 순수 문자열(`"bg-blue-500 ..."`)로 치환합니다.
- **Dynamic Variants**: 변리언트 로직은 빌드 타임에 미리 계산된 **Pre-computed Table**로 치환하여 런타임 연산을 최소화합니다.

### D-3. Plug-and-Play Integration

Vite 플러그인 인터페이스를 제공하여 유저의 빌드 파이프라인에 자연스럽게 녹아듭니다.

> Vite plugin = https://vite.dev/guide/api-plugin, 최신 v8 기준 개발 요구됨.

---

## 📚 상세 계획 (Implementation Plan)

- **[👉 컴파일러 상세 구현 계획 (details_plan.md)](./details_plan.md)**
    - Phase 1: 기반 인프라 구축 및 호출부 탐지
    - Phase 2: 재귀적 Evaluation 엔진 개발
    - Phase 3: AST 치환 및 최적화 로직
    - Phase 4: 변리언트 매핑 테이블 최적화
    - Phase 5: 빌드 도구 플러그인 패키징
- **[👉 기술 탐색 및 통합 전략 논의 (discussion.md)](./discussion.md)**
    - Dev/Prod Parity 확보 전략 (Shared Engine)
    - Tailwind JIT 통합을 위한 방안(A, B, C) 비교 분석
    - 최종 선정된 방안 C (Direct Class Injection) 상세
