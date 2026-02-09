# Playce Frontend Refactoring Plan

## 개요

Playce는 스포츠 중계를 보여주는 식당을 지도 기반으로 탐색하는 서비스입니다.
기존 팀 프로젝트(1개월)를 개인적으로 리팩토링하여 **UI/UX 품질, 코드 구조, 성능, 테스트 커버리지**를 전면 개선합니다.

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
| 1 | **UI 완성도 부족** | **치명적** | 디자인 시스템 없음, 컬러/타이포/간격 일관성 없음, 학부 과제 수준 |
| 2 | **랜딩 페이지 없음** | **치명적** | 첫 진입 시 바로 지도 화면, 서비스 소개/브랜딩 없음 |
| 3 | `alert()` 38개 사용 | **치명적** | 모든 에러/성공 메시지가 브라우저 alert. UX 파괴 |
| 4 | 반응형 미지원 | **치명적** | 고정 px 레이아웃 (430px, 370px, 850px). 모바일 사용 불가 |
| 5 | 폼 패턴 불일치 | **높음** | 로그인은 react-hook-form, 식당등록은 useState 11개 |
| 6 | React Query 미활용 | **높음** | 설치 후 1곳에서만 사용. 서버 상태 캐싱 미적용 |
| 7 | 성능 최적화 없음 | **중간** | React.memo 0개, useMemo 1개, useCallback 0개 |
| 8 | 테스트 없음 | **중간** | 테스트 파일 0개, 테스트 설정 없음 |
| 9 | antd 번들 비대 | **중간** | DatePicker 2개를 위해 antd 전체 설치 (~500KB) |
| 10 | framer-motion 미사용 | **낮음** | 설치만 하고 코드에서 사용하지 않음 |
| 11 | eslint-disable 13개 | **낮음** | useEffect deps 경고를 무시하는 주석 |
| 12 | 매직 스트링 | **낮음** | 탭/서브페이지 이름이 하드코딩된 문자열 |

### 현재 UI 문제점 상세

#### 디자인 시스템 부재
```
현재 상태:
- 컬러: primary1~5 (초록 5단계)만 존재, 보조색/경고색/상태색 없음
- 타이포그래피: font-size가 컴포넌트마다 제각각 (text-sm, text-base, text-lg 무질서)
- 간격(spacing): padding/margin 값이 파일마다 다름 (px-3, px-4, px-6 혼재)
- 그림자/둥글기: 일관성 없음 (rounded, rounded-md, rounded-lg, rounded-xl 혼재)
- 애니메이션: 전무 (framer-motion 설치만 하고 미사용)
```

#### 컴포넌트별 UI 문제
| 컴포넌트 | 문제 |
|----------|------|
| `AppHeader` | 로고 없이 "Playce" 텍스트만. 높이 48px로 너무 작음. 브랜딩 전무 |
| `AuthHeader` | 지도 위 플로팅 버튼이 시각적 계층 없이 떠있음. 모바일에서 겹침 |
| `SearchPage` | `bg-primary4` 배경이 전체적으로 밋밋. 필터 버튼이 기본 HTML 느낌 |
| `SearchResultItem` | 호버 효과 미약, 카드 디자인 없음, 정보 밀도 낮음 |
| `RestaurantDetail` | 로딩 시 "로딩 중..." 텍스트, 탭 디자인 기본, 이미지 섹션 평범 |
| `LoginModal` | 최소한의 폼, 소셜 로그인/브랜딩 없음, 비주얼 임팩트 없음 |
| `ModalBase` | 고정 너비, 애니메이션 없이 즉시 표시, 백드롭 블러 없음 |
| `MypageModal` | 850px 고정, 사이드바 탭이 시각적으로 구분 약함 |

#### 빠져있는 UI 요소
- 랜딩 페이지 / 온보딩
- 로고 및 브랜드 아이덴티티
- Empty state 일러스트
- 마이크로 인터랙션 (호버, 클릭, 전환 애니메이션)
- 다크모드 (선택사항)
- 404 페이지
- 로딩 스켈레톤

---

## 리팩토링 계획

### Phase 1: 기반 정비 (Week 1~2)

> 코드를 건드리기 전에 개발 환경과 의존성을 정리합니다.

#### 1-1. 불필요한 의존성 제거
- [ ] `framer-motion` 제거 → 나중에 필요하면 재설치 (Phase 2에서 애니메이션 도입 시)
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

### Phase 2: 디자인 시스템 구축 + UI 전면 개편 (Week 2~4)

> 학부 과제 수준 UI를 프로덕션 레벨로 끌어올립니다. 이 Phase가 포트폴리오에서 가장 큰 임팩트를 줍니다.

#### 2-1. 디자인 토큰 & 테마 시스템

현재 Tailwind 컬러가 `primary1~5` (초록)만 있고 체계가 없습니다. 전면 재설계합니다.

- [ ] 컬러 시스템 재설계
  ```javascript
  // tailwind.config.js - Before
  colors: {
    primary5: "#66A648",
    primary1: "#B0DB9C",
    // ... 초록만 5단계
  }

  // After: 체계적인 디자인 토큰
  colors: {
    brand: {
      50: '#f0fdf4', 100: '#dcfce7', ..., 600: '#16a34a', 700: '#15803d',
    },
    surface: { DEFAULT: '#ffffff', secondary: '#f8fafc', elevated: '#ffffff' },
    content: { primary: '#0f172a', secondary: '#475569', tertiary: '#94a3b8' },
    status: {
      success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6',
    },
    border: { DEFAULT: '#e2e8f0', strong: '#cbd5e1' },
  }
  ```

- [ ] 타이포그래피 스케일 정의
  ```javascript
  fontSize: {
    'display': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
    'heading-1': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
    'heading-2': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
    'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
    'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
    'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
  }
  ```

- [ ] 간격(spacing) 스케일 통일 (4px 기반: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px)
- [ ] 그림자 시스템 (`shadow-card`, `shadow-modal`, `shadow-dropdown`)
- [ ] 둥글기 통일 (`rounded-lg` = 카드, `rounded-xl` = 모달, `rounded-full` = 아바타/배지)

**이유:** 디자인 시스템 없이 컴포넌트를 만들면 매번 값을 즉흥적으로 넣게 되어 일관성이 무너집니다. 토큰을 먼저 정의하면 모든 UI가 자동으로 통일됩니다.

#### 2-2. 공통 컴포넌트 UI 개편

기존 공통 컴포넌트의 시각적 품질을 높입니다.

- [ ] **Button** — 호버/프레스/포커스 상태 시각 피드백 강화, 아이콘 버튼 변형 추가
- [ ] **InputText** — 라벨, 헬퍼텍스트, 에러 상태를 포함하는 `FormField` 컴포넌트로 확장
- [ ] **ModalBase** — 백드롭 블러(`backdrop-blur-sm`), 열림/닫힘 애니메이션 (fade + scale), 포커스 트랩
- [ ] **Card** — 새로 생성. 식당 카드, 즐겨찾기 카드 등에 공통 사용
- [ ] **Skeleton** — 새로 생성. 로딩 상태용 스켈레톤 컴포넌트
- [ ] **Badge/Tag** — 기존 Tag 개선. 상태 표시용 (경기중, 예정, 종료 등)
- [ ] **EmptyState** — 새로 생성. 데이터 없을 때 일러스트 + 안내 메시지

```typescript
// Before: "로딩 중..." 텍스트
if (loading) return <div>로딩 중...</div>;

// After: 스켈레톤 UI
if (loading) return <RestaurantDetailSkeleton />;

// Before: 빈 목록일 때 아무것도 안 보임
// After: Empty state
if (favorites.length === 0) return (
  <EmptyState
    icon={<HeartIcon />}
    title="즐겨찾기가 없습니다"
    description="마음에 드는 식당을 즐겨찾기에 추가해보세요"
  />
);
```

**이유:** 공통 컴포넌트의 품질이 앱 전체의 UI 품질을 결정합니다. 여기를 먼저 개선하면 이후 페이지 작업이 빨라집니다.

#### 2-3. 마이크로 인터랙션 & 애니메이션

정적인 UI에 생동감을 더합니다. `framer-motion`을 제거했으므로 CSS 트랜지션 + Tailwind로 구현합니다.

- [ ] 모달 열림/닫힘: `opacity` + `scale` 트랜지션
- [ ] 사이드바 슬라이드: `transform: translateX` 트랜지션
- [ ] 카드 호버: `shadow` 확대 + 미세 `translateY(-2px)`
- [ ] 탭 전환: 하단 인디케이터 슬라이드 애니메이션
- [ ] 즐겨찾기 하트: 클릭 시 스케일 바운스
- [ ] 페이지 전환: 부드러운 fade-in
- [ ] 토스트: 우측 상단에서 슬라이드 인/아웃

**이유:** 애니메이션은 사용자에게 "이 앱은 잘 만들어졌다"는 인상을 줍니다. 과하지 않게, 의미 있는 곳에만 적용합니다.

#### 2-4. 페이지별 UI 개편

| 페이지/컴포넌트 | Before | After |
|----------------|--------|-------|
| **AppHeader** | "Playce" 텍스트만, h-12 | 로고 + 네비게이션, 브랜드 아이덴티티 확립 |
| **AuthHeader** | 지도 위 플로팅 텍스트 버튼 | 우상단 아바타/프로필 드롭다운 메뉴 |
| **SearchPage** | `bg-primary4` 단색 배경, 기본 HTML 필터 | 카드형 필터 패널, 시각적 계층 구분 |
| **SearchResultItem** | 텍스트 나열, 밋밋한 호버 | 카드 디자인, 이미지 비율 통일, 경기 정보 배지 |
| **RestaurantDetail** | 기본 사이드바, "로딩 중..." | 세련된 이미지 갤러리, 스켈레톤, 탭 인디케이터 |
| **LoginModal** | 최소한의 폼 | 좌측 브랜딩 이미지 + 우측 폼 레이아웃 (또는 풀스크린 모달) |
| **MypageModal** | 850px 고정 박스 | 풀스크린 또는 슬라이드오버 패널, 시각적 섹션 구분 |
| **FavoriteSidebar** | 단순 리스트 | 카드 그리드, 빈 상태 일러스트 |
| **TodayBroadcasts** | 텍스트 리스트 | 타임라인 뷰, 경기 시간 강조, 라이브 배지 |

**이유:** UI는 포트폴리오의 첫인상입니다. 면접관이 앱을 열었을 때 3초 안에 "이건 잘 만들었다"라는 느낌을 줘야 합니다.

---

### Phase 3: 랜딩 페이지 제작 (Week 4~5)

> 서비스의 첫인상을 결정하는 랜딩 페이지를 만듭니다.

#### 3-1. 랜딩 페이지 구조

현재는 `/` 접속 시 바로 지도 화면이 뜹니다. 비로그인 사용자에게 서비스를 소개하는 랜딩 페이지를 추가합니다.

```
라우팅 변경:
/           → 랜딩 페이지 (비로그인 시) 또는 메인 앱 (로그인 시)
/app        → 메인 앱 (지도 + 검색)
/app/store/:id → 식당 상세 (URL 공유 가능)
```

- [ ] 라우터 구조 변경 (React Router)
- [ ] 랜딩 페이지 레이아웃 및 컴포넌트 구현
- [ ] 로그인 상태에 따른 리다이렉트 처리

#### 3-2. 랜딩 페이지 섹션 구성

```
┌─────────────────────────────────────────┐
│              Hero Section               │
│                                         │
│  "경기 보면서 먹자,                      │
│   Playce에서 찾자"                       │
│                                         │
│  [시작하기]  [둘러보기]                   │
│                                         │
│  (배경: 지도 스크린샷 또는 일러스트)       │
├─────────────────────────────────────────┤
│           Feature Section               │
│                                         │
│  📍 내 근처 식당     🏆 경기 일정 검색    │
│  ⭐ 즐겨찾기        📋 식당 등록         │
│                                         │
├─────────────────────────────────────────┤
│           How It Works                  │
│                                         │
│  1. 위치 허용 → 2. 식당 탐색 → 3. 경기!  │
│  (단계별 스크린샷/일러스트)               │
│                                         │
├─────────────────────────────────────────┤
│           CTA Section                   │
│                                         │
│  "지금 바로 내 근처 스포츠 식당을         │
│   찾아보세요"                            │
│  [무료로 시작하기]                        │
│                                         │
├─────────────────────────────────────────┤
│              Footer                     │
│  Playce | GitHub | Contact              │
└─────────────────────────────────────────┘
```

- [ ] Hero 섹션: 메인 카피 + CTA 버튼 + 배경 비주얼
- [ ] Feature 섹션: 핵심 기능 4가지 카드 (아이콘 + 설명)
- [ ] How It Works 섹션: 3단계 사용 방법 (일러스트)
- [ ] CTA 섹션: 최종 전환 유도
- [ ] Footer: 링크, 크레딧
- [ ] 스크롤 애니메이션: Intersection Observer로 섹션 진입 시 fade-in

#### 3-3. 라우팅 개선

기존 모달 기반 네비게이션에 URL을 부여합니다.

```typescript
// Before: 모달로만 열림 (URL 없음)
{openedModal === storeId && <RestaurantDetail />}

// After: URL 기반 (공유 가능)
<Route path="/app" element={<MainApp />} />
<Route path="/app/store/:id" element={<MainApp />} />  // 식당 상세가 열린 상태
```

**이유:** URL이 없으면 식당 정보를 친구에게 공유할 수 없습니다. 또한 브라우저 뒤로가기가 동작하지 않아 UX가 나쁩니다.

---

### Phase 4: UX 핵심 개선 (Week 5~6)

> 사용자가 바로 느낄 수 있는 기능적 UX 문제를 해결합니다.

#### 4-1. Toast 알림 시스템 도입
- [ ] `sonner` 설치
- [ ] `alert()` 38개를 Toast로 전환
- [ ] 성공(초록), 에러(빨강), 정보(파랑) 토스트 스타일 통일
- [ ] 토스트 전용 유틸 함수 생성

```typescript
// Before
alert("로그인이 완료되었습니다.");

// After
toast.success("로그인이 완료되었습니다.");
```

**이유:** `alert()`은 UI 스레드를 차단하고, 모바일에서 제어 불가능하며, 스타일링이 불가능합니다. 현대적 웹앱에서는 비차단(non-blocking) 알림이 표준입니다.

#### 4-2. 로딩 상태 개선
- [ ] Phase 2에서 만든 `Skeleton` 컴포넌트를 전 페이지에 적용
- [ ] API 호출 중 버튼 disabled + 로딩 스피너
- [ ] 이미지 lazy loading + placeholder

#### 4-3. 에러 처리 체계화
- [ ] React Error Boundary 구현 (전역 + 섹션별)
- [ ] API 에러 핸들링 중복 제거 → 커스텀 훅으로 추상화
- [ ] 401 응답 시 로그인 모달 자동 표시 (현재는 토큰만 삭제)
- [ ] 네트워크 오류 시 재시도 버튼 제공
- [ ] 404 페이지 추가

```typescript
// Before: 20곳에서 반복되는 패턴
try {
  await someApiCall();
  alert("성공!");
} catch (error) {
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

### Phase 5: 코드 품질 개선 (Week 6~7)

> 내부 코드 구조를 정리하여 유지보수성을 높입니다.

#### 5-1. 폼 패턴 통일
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

**이유:** 하나의 앱에서 3가지 폼 관리 방식을 사용하면 일관성이 깨지고 유지보수 비용이 증가합니다.

#### 5-2. React Query 활용 확대
- [ ] 기존 `useMap`, `useSearch` 등의 데이터 페칭을 React Query로 전환
- [ ] 서버 상태 캐싱 적용 (식당 상세, 즐겨찾기, 정적 데이터)
- [ ] `staleTime`, `gcTime` 설정으로 불필요한 API 호출 감소
- [ ] `useMutation` 활용으로 생성/수정/삭제 시 캐시 무효화

**이유:** Zustand에서 서버 데이터를 관리하면 캐싱, 재검증, 로딩/에러 상태를 직접 구현해야 합니다. React Query는 이를 자동으로 처리합니다.

#### 5-3. 컴포넌트 분리
- [ ] `RestaurantRegisterEdit.tsx` (314줄) → 폼 로직 훅 + 프레젠테이션 컴포넌트 분리
- [ ] `BroadcastRegisterEdit.tsx` (265줄) → 동일 패턴 적용
- [ ] `Home.tsx` → 레이아웃 컴포넌트 + 비즈니스 로직 훅 분리
- [ ] `SearchPage.tsx` → 필터 로직과 UI 분리

**이유:** 200줄 이상의 컴포넌트는 테스트하기 어렵고, 한 파일의 변경이 의도치 않은 영향을 줍니다.

---

### Phase 6: 반응형 디자인 (Week 7~8)

> 모바일 사용자를 위한 반응형 레이아웃을 구현합니다.

#### 6-1. 레이아웃 시스템 리팩토링
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

#### 6-2. 모바일 최적화
- [ ] 모달 → 모바일에서는 전체 화면 또는 바텀 시트
- [ ] 터치 제스처 고려 (스와이프로 사이드바 열기/닫기)
- [ ] 검색 필터 UI 모바일 최적화 (접이식 패널)
- [ ] 랜딩 페이지 모바일 반응형

**이유:** 현재 앱은 모바일에서 사용이 불가능합니다. 식당 탐색 앱의 특성상 모바일 사용 비율이 높을 수밖에 없습니다.

---

### Phase 7: 성능 최적화 (Week 8~9)

> 렌더링 성능과 번들 사이즈를 최적화합니다.

#### 7-1. 렌더링 최적화
- [ ] `React.memo` 적용: `PlayceMapMarker`, `RestaurantCardList` 아이템, 모달 컴포넌트
- [ ] `useMemo` 적용: 필터링된 검색 결과, 정렬된 목록
- [ ] `useCallback` 적용: 이벤트 핸들러 (특히 지도 이벤트)
- [ ] eslint-disable 주석의 useEffect deps 문제 해결

**이유:** 지도 위 마커가 많을 때, 하나의 마커 클릭이 전체 마커를 리렌더링시키면 성능이 저하됩니다.

#### 7-2. 코드 스플리팅
- [ ] `React.lazy` + `Suspense`로 모달 컴포넌트 지연 로딩
- [ ] 마이페이지, 식당 상세 등 조건부 렌더링 컴포넌트 분리
- [ ] 랜딩 페이지 / 메인 앱 청크 분리
- [ ] Vite dynamic import 활용

#### 7-3. 번들 분석
- [ ] `rollup-plugin-visualizer` 설치 → 번들 크기 시각화
- [ ] 큰 의존성 식별 및 대체안 검토
- [ ] Tree shaking 확인

---

### Phase 8: 테스트 코드 작성 (Week 9~10)

> 핵심 로직과 사용자 플로우에 대한 테스트를 작성합니다.

#### 8-1. 유틸 함수 단위 테스트
- [ ] `apiErrorStatusMessage` — 에러 코드별 올바른 메시지 반환
- [ ] `distanceUtils` — 거리 계산 정확성
- [ ] `formatTime`, `getDay`, `getDaysInMonth` — 날짜/시간 포맷
- [ ] `sortUtils`, `regionUtils`, `sportUtils` — 정렬/필터 로직

#### 8-2. 커스텀 훅 테스트
- [ ] `useAuth` — 로그인/로그아웃 플로우, 토큰 저장/제거
- [ ] `useSearch` — 필터 적용, 결과 정렬, 거리 계산
- [ ] `useGeoLocation` — 위치 권한 허용/거부 시나리오

#### 8-3. 컴포넌트 테스트
- [ ] `Button` — 각 variant 렌더링, 클릭 이벤트, disabled 상태
- [ ] `ModalBase` — 열기/닫기, 외부 클릭, Portal 렌더링
- [ ] `Login` — 폼 제출, 유효성 검사, 에러 표시
- [ ] `RestaurantDetail` — 탭 전환, 데이터 표시, 즐겨찾기 토글

#### 8-4. 통합 테스트
- [ ] 검색 플로우: 필터 설정 → 검색 → 결과 표시 → 상세 열기
- [ ] 인증 플로우: 로그인 → 토큰 저장 → 보호된 기능 접근 → 로그아웃

**이유:** 테스트 없는 리팩토링은 위험합니다. 특히 폼 패턴 통일, 에러 처리 변경 등은 기존 동작을 깨뜨릴 수 있습니다.

---

### Phase 9: 마무리 & 폴리시 (Week 10~11)

#### 9-1. 접근성(a11y) 개선
- [ ] 모달에 포커스 트랩(focus trap) 추가
- [ ] 인터랙티브 요소에 `aria-label` 보완
- [ ] 키보드 네비게이션 지원 (Tab, Enter, Escape)
- [ ] 색상 대비 검증 (WCAG AA 기준)

#### 9-2. 코드 정리
- [ ] 주석 처리된 코드 제거
- [ ] console.log/console.error 정리
- [ ] 사용하지 않는 import 제거

#### 9-3. 최종 점검
- [ ] Lighthouse 점수 측정 (Performance, Accessibility, Best Practices)
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)
- [ ] 모바일 실기기 테스트

---

## 작업 원칙

1. **한 번에 하나씩** — 각 Phase를 완료하고 PR을 올린 후 다음으로 진행
2. **테스트와 함께** — 변경할 때마다 관련 테스트를 함께 작성
3. **기존 동작 유지** — 리팩토링은 동작을 변경하지 않으면서 구조를 개선하는 것
4. **커밋 단위** — 하나의 커밋에 하나의 변경 목적 (feat, refactor, test, chore)
5. **디자인 먼저** — UI 변경 시 Tailwind 클래스를 즉흥으로 넣지 말고, 디자인 토큰을 참조

## 예상 일정

| Phase | 기간 | 핵심 산출물 |
|-------|------|------------|
| Phase 1: 기반 정비 | Week 1~2 | 의존성 정리, 테스트 환경, 타입 개선 |
| **Phase 2: 디자인 시스템 + UI 개편** | **Week 2~4** | **디자인 토큰, 공통 컴포넌트, 페이지별 UI 개편** |
| **Phase 3: 랜딩 페이지** | **Week 4~5** | **랜딩 페이지, 라우팅 개선, URL 공유** |
| Phase 4: UX 핵심 개선 | Week 5~6 | Toast 시스템, 스켈레톤, 에러 바운더리 |
| Phase 5: 코드 품질 | Week 6~7 | 폼 통일, React Query, 컴포넌트 분리 |
| Phase 6: 반응형 | Week 7~8 | 모바일 레이아웃, 바텀 시트 |
| Phase 7: 성능 | Week 8~9 | memo, lazy loading, 번들 최적화 |
| Phase 8: 테스트 | Week 9~10 | 유틸/훅/컴포넌트/통합 테스트 |
| Phase 9: 마무리 | Week 10~11 | 접근성, Lighthouse, 크로스브라우저 |

---

## 포트폴리오 어필 포인트

이 리팩토링을 통해 보여줄 수 있는 역량:

### 기술적 판단력
- **Next.js vs React SPA** — SSR/CSR 차이를 이해하고, 앱 특성에 맞는 기술을 선택

### UI/UX 역량
- **디자인 시스템 구축** — 토큰 기반 일관된 디자인 체계 수립
- **학부 수준 → 프로덕션 수준** — Before/After 비교로 개선 효과 시각화
- **랜딩 페이지** — 서비스 소개, 사용자 전환 유도, 브랜딩

### 코드 품질
- **문제 분석** — 기존 코드의 문제를 구체적으로 식별하고 수치화
- **체계적 개선** — 우선순위를 정하고 단계적으로 개선
- **패턴 통일** — 흩어진 3가지 폼 패턴을 하나로 통합
- **상태 관리 전략** — 서버 상태(React Query) vs UI 상태(Zustand) 분리

### 실무 역량
- **성능 의식** — 번들 500KB 절감, 렌더링 최적화, 코드 스플리팅
- **테스트 문화** — 0% → N% 테스트 커버리지 확보
- **접근성** — WCAG 기준 준수, 키보드 네비게이션

### 면접 킬러 답변
- "왜 이 순서로?" → UI가 포트폴리오 첫인상이라 먼저, 내부 코드는 그 다음
- "가장 어려웠던 건?" → 기존 동작 유지하면서 폼 패턴 통일
- "성과를 수치로?" → 번들 500KB↓, alert 38개→0개, 테스트 0%→N%, Lighthouse N점
