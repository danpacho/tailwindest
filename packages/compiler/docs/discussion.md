# Tailwindest Compiler: Dev/Prod Parity & Integration Research

본 문서는 컴파일러 설계 과정에서 논의된 개발(Dev)/운영(Prod) 환경 일관성 유지 전략과 Tailwind JIT 스캐너와의 통합 방안에 대한 기술 탐색 결과를 기록합니다.

## 1. 배경 (Background)

`tailwindest` 컴파일러는 중첩 객체를 분석하여 최종 클래스 문자열을 생성합니다. 그러나 Tailwind CSS의 기본 JIT 스캐너는 소스 코드를 텍스트 기반으로 스캔하므로, 런타임에 결정되거나 객체 깊숙이 숨겨진 클래스 목록을 완벽하게 찾아내지 못하는 한계가 있습니다.

## 2. 통합 방안 탐색 (Integration Options)

우리는 Tailwind JIT 엔진이 컴파일러가 생성한 클래스를 인식하게 만들기 위한 3가지 방안을 검토했습니다.

### [방안 A] Virtual CSS File (VFS)

- **방식**: 컴파일러가 추출한 클래스들을 `@apply`가 포함된 가상 CSS 파일로 생성.
- **장점**: 별도의 플러그인 없이 Tailwind가 가상 파일을 스캔하게 유도 가능.
- **단점**: 가상 파일 시스템에 대한 번들러 의존성이 높고, 대규모 프로젝트에서 파일 쓰기 오버헤드 발생 가능.

### [방안 B] Static Class Registry (Sidecar File)

- **방식**: 프로젝트 전체에서 사용된 클래스 목록을 정적 텍스트 파일(예: `.tw-extracted.txt`)로 기록.
- **장점**: Tailwind config의 `content` 설정에 추가하기만 하면 되어 구현이 매우 단순함.
- **단점**: 빌드 도중 실제 파일 쓰기가 발생하며, 동기화 시점에 따른 레이턴시 존재 가능.

### [방안 C] Direct Class Injection (Tailwind Plugin API) - **[최종 선정]**

- **방식**: `tailwindest` 전용 Tailwind 플러그인을 개발하여, 컴파일러가 수집한 클래스를 Tailwind 엔진의 `addUtilities` API에 직접 주입.
- **선정 이유**:
    - **무결성**: 중간 파일이나 가상 파일 없이 엔진 대 엔진으로 직접 통신하여 가장 정확함.
    - **성능**: I/O 오버헤드 없이 메모리 상에서 즉시 클래스 등록 가능.
    - **유연성**: Tailwind의 테마 시스템이나 레이어 시스템과 가장 긴밀하게 통합됨.

---

## 3. Dev/Prod Parity 확보 전략

개발 단계에서의 즉각적인 피드백(HMR)과 운영 단계의 최적화 결과가 100% 일치해야 합니다.

1.  **Shared Evaluation Engine**: 런타임 라이브러리와 컴파일러가 동일한 해석 로직을 공유하여 환경 간 결과값 차이를 원천 제거합니다.
2.  **Two-Tier Parsing**:
    - **Tier 1 (Fast Check)**: 단순 키워드 매칭으로 변환 대상 파일 신속 필터링.
    - **Tier 2 (Full AST)**: 추출이 필요한 파일만 `ts-morph`로 정밀 분석.
3.  **Communication Bridge**: 빌드 도구(Vite 등) 플러그인과 Tailwind 플러그인 간의 인메모리 데이터 공유 시스템을 구축하여 실시간 일관성을 유지합니다.

---

## 4. 엔지니어링 가이드라인

- 컴파일러 개발 시 `Evaluation Engine`은 **순수 함수(Pure Function)**로 작성하여 테스트 가능성을 높입니다.
- Tailwind 플러그인은 컴파일러로부터 전달받은 클래스 목록을 캐싱하여 불필요한 리렌더링을 방지합니다.
