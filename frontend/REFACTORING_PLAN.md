# Playce Frontend Refactoring Plan

## 개요

Playce는 스포츠 중계를 보여주는 식당을 지도 기반으로 탐색하는 서비스입니다.
기존 팀 프로젝트(1개월)를 개인적으로 리팩토링하여 코드 품질, UX, 성능, 테스트 커버리지를 개선합니다.

### 기술적 판단: React SPA 유지 (Next.js 전환 불필요)

Next.js 마이그레이션을 검토했으나, 다음 이유로 React SPA를 유지합니다:

- **카카오맵 기반 인터랙션이 핵심** — JavaScript 없이 지도를 렌더링할 수 없음
- **로그인 필수 콘텐츠** — 검색 크롤러가 접근할 수 없어 SSR의 SEO 이점이 제한적
- **모달 기반 네비게이션** — URL 라우팅이 `/` 하나뿐, SSR 대상 페이지가 없음
- **90% 이상 클라이언트 인터랙션** — `"use client"` 를 대부분 붙여야 하므로 Next.js 이점이 사라짐

> CSR이 적합한 앱에서 무리하게 SSR을 도입하면 오히려 복잡도만 증가합니다.

---

## 현재 상태 분석

### 기술 스택
| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript (strict) |
| 빌드 | Vite 6 + SWC |
| 상태관리 | Zustand 5 (10개 스토어) + React Query (1곳에서만 사용) |
| 스타일 | Tailwind CSS 3 + Ant Design (DatePicker만 사용) |
| 폼 | React Hook Form (로그인/회원가입만) / 나머지는 useState |
| 지도 | react-kakao-maps-sdk |
| API | Axios + 인터셉터 |

### 발견된 문제점

| # | 문제 | 심각도 | 설명 |
|---|------|--------|------|
| 1 | `alert()` 38개 사용 | **치명적** | 모든 에러/성공 메시지가 브라우저 alert. UX 파괴 |
| 2 | 반응형 미지원 | **치명적** | 고정 px 레이아웃 (430px, 370px, 850px). 모바일 사용 불가 |
| 3 | 폼 패턴 불일치 | **높음** | 로그인은 react-hook-form, 식당등록은 useState 11개 |
| 4 | React Query 미활용 | **높음** | 설치 후 1곳에서만 사용. 서버 상태 캐싱 미적용 |
| 5 | 성능 최적화 없음 | **중간** | React.memo 0개, useMemo 1개, useCallback 0개 |
| 6 | 테스트 없음 | **중간** | 테스트 파일 0개, 테스트 설정 없음 |
| 7 | antd 번들 비대 | **중간** | DatePicker 2개를 위해 antd 전체 설치 (~500KB) |
| 8 | framer-motion 미사용 | **낮음** | 설치만 하고 코드에서 사용하지 않음 |
| 9 | eslint-disable 13개 | **낮음** | useEffect deps 경고를 무시하는 주석 |
| 10 | 매직 스트링 | **낮음** | 탭/서브페이지 이름이 하드코딩된 문자열 |

---

## 리팩토링 계획

### Phase 1: 기반 정비 (Week 1~2)

> 코드를 건드리기 전에 개발 환경과 의존성을 정리합니다.

#### 1-1. 불필요한 의존성 제거
- [ ] `framer-motion` 제거 (설치만 되어있고 미사용)
- [ ] `antd` 제거 → DatePicker/TimePicker를 `react-datepicker` 또는 네이티브 input으로 교체
- [ ] `antd/dist/reset.css` import 제거
- [ ] `ConfigProvider` 래퍼 제거 (main.tsx)

**이유:** antd는 트리셰이킹이 잘 되지 않아 번들 사이즈를 불필요하게 키웁니다. DatePicker 2개를 위해 ~500KB를 추가하는 것은 비합리적입니다.

#### 1-2. 개발 환경 개선
- [ ] Vite path alias 설정 (`@/` → `src/`)
- [ ] `.env.example` 파일 추가
- [ ] ESLint 규칙 정리 (eslint-disable 주석 제거하고 근본 원인 해결)

**이유:** `../../stores/authStore` 같은 상대 경로는 리팩토링 시 파일 이동을 어렵게 합니다.

#### 1-3. TypeScript 개선
- [ ] 타입 네이밍 통일: `menu` → `Menu`, `latlng` → `LatLng` (PascalCase)
- [ ] 매직 스트링을 const enum으로 추출
  ```typescript
  // Before
  setRestaurantSubpage("restaurant-home");
  setSelectedTab("favorite");

  // After
  const MYPAGE_TAB = { FAVORITE: "favorite", PROFILE: "profile", RESTAURANT: "restaurant" } as const;
  const RESTAURANT_PAGE = { HOME: "restaurant-home", REGISTER: "register", ... } as const;
  ```
- [ ] API 응답 타입 명시 (현재 requestHandler의 반환 타입이 불명확)

**이유:** 타입 안전성은 리팩토링의 근간입니다. 타입이 불명확하면 리팩토링 중 버그를 잡을 수 없습니다.

#### 1-4. 테스트 환경 구축
- [ ] Vitest + React Testing Library + jsdom 설치 및 설정
- [ ] 테스트 디렉토리 구조 결정 (`__tests__/` 또는 `.test.tsx` 코로케이션)
- [ ] CI에서 테스트 실행할 수 있도록 `npm run test` 스크립트 추가

**이유:** 리팩토링 전에 테스트 인프라를 구축해야 변경 사항의 안전성을 보장할 수 있습니다.

---

### Phase 2: UX 핵심 개선 (Week 2~3)

> 사용자가 바로 느낄 수 있는 문제를 먼저 해결합니다.

#### 2-1. Toast 알림 시스템 도입
- [ ] `sonner` 또는 `react-hot-toast` 설치
- [ ] `alert()` 38개를 Toast로 전환
- [ ] 성공(초록), 에러(빨강), 정보(파랑) 토스트 스타일 통일
- [ ] 토스트 전용 유틸 함수 생성

```typescript
// Before
alert("로그인이 완료되었습니다.");
alert("오류가 발생했습니다.");

// After
toast.success("로그인이 완료되었습니다.");
toast.error("오류가 발생했습니다.");
```

**이유:** `alert()`은 UI 스레드를 차단하고, 모바일에서 제어 불가능하며, 스타일링이 불가능합니다. 현대적 웹앱에서는 비차단(non-blocking) 알림이 표준입니다.

#### 2-2. 로딩 상태 개선
- [ ] `Skeleton` 공통 컴포넌트 생성
- [ ] "로딩 중..." 텍스트를 스켈레톤 UI로 교체
- [ ] 식당 목록, 상세, 즐겨찾기 등에 적용
- [ ] API 호출 중 버튼 disabled + 로딩 스피너

**이유:** 로딩 텍스트는 레이아웃 시프트를 유발합니다. 스켈레톤은 콘텐츠 영역을 미리 확보하여 부드러운 전환을 제공합니다.

#### 2-3. 에러 처리 체계화
- [ ] React Error Boundary 구현 (전역 + 섹션별)
- [ ] API 에러 핸들링 중복 제거 → 커스텀 훅으로 추상화
- [ ] 401 응답 시 로그인 모달 자동 표시 (현재는 토큰만 삭제)
- [ ] 네트워크 오류 시 재시도 버튼 제공

```typescript
// Before: 20곳에서 반복되는 패턴
try {
  await someApiCall();
  alert("성공!");
} catch (error) {
  const errorList = [{ code: 400, message: "..." }];
  const message = apiErrorStatusMessage(error, errorList);
  alert(message);
}

// After: 커스텀 훅으로 추상화
const { mutate, isLoading } = useApiMutation(someApiCall, {
  successMessage: "성공!",
  errorMessages: { 400: "잘못된 요청입니다." },
});
```

**이유:** 동일한 에러 처리 패턴이 20곳 이상 반복되면 변경 시 누락이 발생합니다. 단일 추상화로 일관성을 보장합니다.

---

### Phase 3: 코드 품질 개선 (Week 3~4)

> 내부 코드 구조를 정리하여 유지보수성을 높입니다.

#### 3-1. 폼 패턴 통일
- [ ] 식당 등록/수정 폼을 react-hook-form으로 전환
- [ ] 방송 등록/수정 폼을 react-hook-form으로 전환
- [ ] 커스텀 validation → react-hook-form의 `register` 옵션으로 이관
- [ ] `broadcastFormStore` 제거 (react-hook-form이 폼 상태 관리)

```typescript
// Before: useState 11개로 폼 관리
const [storeName, setStoreName] = useState("");
const [businessNumber, setBusinessNumber] = useState("");
const [address, setAddress] = useState("");
// ... 8개 더

// After: react-hook-form으로 통일
const { register, handleSubmit, formState: { errors } } = useForm<RegisterStoreProps>();
```

**이유:** 하나의 앱에서 3가지 폼 관리 방식(react-hook-form, useState, Zustand store)을 사용하면 일관성이 깨지고 유지보수 비용이 증가합니다.

#### 3-2. React Query 활용 확대
- [ ] 기존 `useMap`, `useSearch` 등의 데이터 페칭을 React Query로 전환
- [ ] 서버 상태 캐싱 적용 (식당 상세, 즐겨찾기, 정적 데이터)
- [ ] `staleTime`, `gcTime` 설정으로 불필요한 API 호출 감소
- [ ] `useMutation` 활용으로 생성/수정/삭제 시 캐시 무효화

**이유:** Zustand에서 서버 데이터를 관리하면 캐싱, 재검증, 로딩/에러 상태를 직접 구현해야 합니다. React Query는 이를 자동으로 처리합니다.

#### 3-3. 컴포넌트 분리
- [ ] `RestaurantRegisterEdit.tsx` (314줄) → 폼 로직 훅 + 프레젠테이션 컴포넌트 분리
- [ ] `BroadcastRegisterEdit.tsx` (265줄) → 동일 패턴 적용
- [ ] `Home.tsx` → 레이아웃 컴포넌트 + 비즈니스 로직 훅 분리
- [ ] `SearchPage.tsx` → 필터 로직과 UI 분리

**이유:** 200줄 이상의 컴포넌트는 테스트하기 어렵고, 한 파일의 변경이 의도치 않은 영향을 줍니다.

---

### Phase 4: 반응형 디자인 (Week 4~5)

> 모바일 사용자를 위한 반응형 레이아웃을 구현합니다.

#### 4-1. 레이아웃 시스템 리팩토링
- [ ] 고정 px → Tailwind 반응형 클래스 (`sm:`, `md:`, `lg:`)
- [ ] 모바일: 전체 화면 지도 + 하단 시트 (검색/결과)
- [ ] 태블릿: 축소된 사이드바 + 지도
- [ ] 데스크톱: 현재 레이아웃 유지

```
모바일 레이아웃           데스크톱 레이아웃 (현재)
┌───────────────┐      ┌──────────┬──────────┐
│               │      │          │          │
│    지도       │      │  사이드바  │   지도    │
│               │      │          │          │
├───────────────┤      │          │          │
│ 하단 시트     │      │          │          │
│ (드래그 업)   │      │          │          │
└───────────────┘      └──────────┴──────────┘
```

#### 4-2. 모바일 최적화
- [ ] 모달 → 모바일에서는 전체 화면 또는 바텀 시트
- [ ] 터치 제스처 고려 (스와이프로 사이드바 열기/닫기)
- [ ] 검색 필터 UI 모바일 최적화 (접이식 패널)

**이유:** 현재 앱은 모바일에서 사용이 불가능합니다. 식당 탐색 앱의 특성상 모바일 사용 비율이 높을 수밖에 없습니다.

---

### Phase 5: 성능 최적화 (Week 5~6)

> 렌더링 성능과 번들 사이즈를 최적화합니다.

#### 5-1. 렌더링 최적화
- [ ] `React.memo` 적용: `PlayceMapMarker`, `RestaurantCardList` 아이템, 모달 컴포넌트
- [ ] `useMemo` 적용: 필터링된 검색 결과, 정렬된 목록
- [ ] `useCallback` 적용: 이벤트 핸들러 (특히 지도 이벤트)
- [ ] eslint-disable 주석의 useEffect deps 문제 해결

**이유:** 지도 위 마커가 많을 때, 하나의 마커 클릭이 전체 마커를 리렌더링시키면 성능이 저하됩니다.

#### 5-2. 코드 스플리팅
- [ ] `React.lazy` + `Suspense`로 모달 컴포넌트 지연 로딩
- [ ] 마이페이지, 식당 상세 등 조건부 렌더링 컴포넌트 분리
- [ ] Vite dynamic import 활용

```typescript
// Before: 항상 번들에 포함
import MypageModal from "../components/Mypage/MypageModal";

// After: 필요할 때만 로드
const MypageModal = lazy(() => import("../components/Mypage/MypageModal"));

<Suspense fallback={<Skeleton />}>
  {isMypageOpen && <MypageModal onClose={handleClose} />}
</Suspense>
```

**이유:** 초기 번들에 모든 모달/사이드바를 포함하면 첫 로딩이 느려집니다. 지연 로딩으로 초기 로드 시간을 단축합니다.

#### 5-3. 번들 분석
- [ ] `rollup-plugin-visualizer` 설치 → 번들 크기 시각화
- [ ] 큰 의존성 식별 및 대체안 검토
- [ ] Tree shaking 확인

---

### Phase 6: 테스트 코드 작성 (Week 6~7)

> 핵심 로직과 사용자 플로우에 대한 테스트를 작성합니다.

#### 6-1. 유틸 함수 단위 테스트
- [ ] `apiErrorStatusMessage` — 에러 코드별 올바른 메시지 반환
- [ ] `distanceUtils` — 거리 계산 정확성
- [ ] `formatTime`, `getDay`, `getDaysInMonth` — 날짜/시간 포맷
- [ ] `sortUtils`, `regionUtils`, `sportUtils` — 정렬/필터 로직

#### 6-2. 커스텀 훅 테스트
- [ ] `useAuth` — 로그인/로그아웃 플로우, 토큰 저장/제거
- [ ] `useSearch` — 필터 적용, 결과 정렬, 거리 계산
- [ ] `useGeoLocation` — 위치 권한 허용/거부 시나리오

#### 6-3. 컴포넌트 테스트
- [ ] `Button` — 각 variant 렌더링, 클릭 이벤트, disabled 상태
- [ ] `ModalBase` — 열기/닫기, 외부 클릭, Portal 렌더링
- [ ] `Login` — 폼 제출, 유효성 검사, 에러 표시
- [ ] `RestaurantDetail` — 탭 전환, 데이터 표시, 즐겨찾기 토글

#### 6-4. 통합 테스트
- [ ] 검색 플로우: 필터 설정 → 검색 → 결과 표시 → 상세 열기
- [ ] 인증 플로우: 로그인 → 토큰 저장 → 보호된 기능 접근 → 로그아웃

**이유:** 테스트 없는 리팩토링은 위험합니다. 특히 폼 패턴 통일, 에러 처리 변경 등은 기존 동작을 깨뜨릴 수 있습니다.

---

### Phase 7: 마무리 (Week 7~8)

#### 7-1. 접근성(a11y) 개선
- [ ] 모달에 포커스 트랩(focus trap) 추가
- [ ] 인터랙티브 요소에 `aria-label` 보완
- [ ] 키보드 네비게이션 지원 (Tab, Enter, Escape)

#### 7-2. 코드 정리
- [ ] 주석 처리된 코드 제거
- [ ] console.log/console.error 정리
- [ ] 사용하지 않는 import 제거

---

## 작업 원칙

1. **한 번에 하나씩** — 각 Phase를 완료하고 PR을 올린 후 다음으로 진행
2. **테스트와 함께** — 변경할 때마다 관련 테스트를 함께 작성
3. **기존 동작 유지** — 리팩토링은 동작을 변경하지 않으면서 구조를 개선하는 것
4. **커밋 단위** — 하나의 커밋에 하나의 변경 목적 (feat, refactor, test, chore)

## 예상 일정

| Phase | 기간 | 핵심 산출물 |
|-------|------|------------|
| Phase 1: 기반 정비 | Week 1~2 | 의존성 정리, 테스트 환경, 타입 개선 |
| Phase 2: UX 핵심 개선 | Week 2~3 | Toast 시스템, 스켈레톤, 에러 바운더리 |
| Phase 3: 코드 품질 | Week 3~4 | 폼 통일, React Query, 컴포넌트 분리 |
| Phase 4: 반응형 | Week 4~5 | 모바일 레이아웃, 바텀 시트 |
| Phase 5: 성능 | Week 5~6 | memo, lazy loading, 번들 최적화 |
| Phase 6: 테스트 | Week 6~7 | 유틸/훅/컴포넌트/통합 테스트 |
| Phase 7: 마무리 | Week 7~8 | 접근성, 코드 정리 |

---

## 포트폴리오 어필 포인트

이 리팩토링을 통해 보여줄 수 있는 역량:

- **기술 선택의 근거** — Next.js vs React SPA 판단, SSR/CSR 이해
- **문제 분석 능력** — 기존 코드의 문제를 구체적으로 식별하고 수치화
- **체계적 개선** — 우선순위를 정하고 단계적으로 개선
- **UX 감각** — alert → Toast, 로딩 상태, 에러 처리 등 사용자 경험 개선
- **성능 의식** — 번들 최적화, 렌더링 최적화, 코드 스플리팅
- **테스트 문화** — 테스트 없는 코드에 테스트를 추가하는 실무적 역량
- **코드 일관성** — 흩어진 패턴을 하나로 통일하는 리팩토링 능력
