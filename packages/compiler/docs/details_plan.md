# Tailwindest Compiler 상세 구현 계획

본 문서는 `@tailwindest/compiler`의 단계별 구현 로드맵과 각 핵심 모듈의 기술적 상세를 정의합니다.

## 📅 로드맵 (Roadmap)

### Phase 1: 기반 인프라 및 공유 엔진 (Foundation & Shared Engine)

- **Shared Evaluation Engine**: 런타임 라이브러리(`@tailwindest/core`)의 스타일 해석 로직을 컴파일러에서도 사용할 수 있도록 공통 모듈화.
- **AST 인프라**: `ts-morph` 기반의 스캔 파이프라인 및 HMR 대응 캐싱 전략 구축.
- **호출부 탐지 (Call Detection)**: 정적 분석이 가능한 `tw.style`, `tw.variants` 호출부 식별 로직.

### Phase 2: Tailwind Plugin 개발 (Tailwind Integration)

- **Class Injection API**: 컴파일러에서 수집된 클래스를 Tailwind JIT 엔진의 `addUtilities` 등에 전달하는 전용 플러그인 구현.
- **Communication Bridge**: 빌드 도구(Vite 등) 플러그인과 Tailwind 플러그인 간의 실시간 클래스 목록 공유 메커니즘 구축.

### Phase 3: 정적 치환 및 최적화 (Substitution & Optimization)

- **CallExpr to Literal**: 런타임 함수 호출을 최종 문자열 리터럴로 교체.
- **Table Optimization**: `tw.variants`를 정적 룩업 테이블로 변환.

### Phase 4: 변리언트 최적화 (Variant Optimization)

- **Pre-computed Table**: `tw.variants`를 런타임 연산이 필요 없는 정적 룩업 객체로 변환.
- **Conditional Logic Inlining**: 단순한 조건부 변리언트는 삼항 연산자 등으로 인라이닝(Inlining).

### Phase 5: 통합 플러그인 (Integration)

- **Vite Plugin**: Vite 환경에서 개발 및 빌드 시 스타일 컴파일 수행.
- **CLI Mode**: 독립적인 CLI 도구로 제공하여 CI/CD 파이프라인 대응.

---

## 🛠️ 핵심 모듈 설계 상세

### 1. Evaluation Engine 설계

엔진은 스타일 객체를 입력받아 `string`을 반환하는 순수 함수여야 합니다.

- **Stateful Prefix**: 재귀 호출 시 현재의 `prefix` 경로를 누적 관리합니다.
- **Array Handling**: `padding: ["p-2", "p-4"]`와 같은 배열 형태의 멀티 클래스를 지원합니다.

### 2. AST Transformation 전략

`css-transformer`에서 사용한 **Collect → Reverse Execute** 패턴을 계승합니다.

- 변환 도중 AST가 깨지는 것을 방지하기 위해 모든 치환 대상 노드를 먼저 수집한 뒤, 파일 하단부터 역순으로 치환을 수행합니다.

### 3. 검증 전략 (Testing)

- **Input/Output Fixtures**: 컴파일 전/후의 코드를 비교하는 Golden File 테스트.
- **Zero-runtime Check**: 컴파일된 결과물에 `tailwindest` 런타임 라이브러리 참조가 남아있지 않은지 검증.

---

## 🚀 기대 효과

- **Bundle Size**: 런타임 엔진(약 2~5KB) 제거.
- **Performance**: JS가 스타일 객체를 파싱하고 클래스를 합치는 데 걸리는 시간(수 ms)을 0으로 단축.
- **DX**: 중첩 객체 프리픽스 자동화를 통한 생산성 극대화.
