# PlayceV 프론트엔드 완전 가이드

> 리액트 초보를 위한 코드 구조 분석 + 리팩토링 가이드
> 15분이면 전체 구조가 머릿속에 들어옵니다.

---

## 목차

1. [이 프로젝트가 뭔데?](#1-이-프로젝트가-뭔데)
2. [기술 스택 한눈에 보기](#2-기술-스택-한눈에-보기)
3. [리액트 기초 용어 정리](#3-리액트-기초-용어-정리)
4. [폴더 구조와 역할](#4-폴더-구조와-역할)
5. [화면 구성 (어떻게 생겼나)](#5-화면-구성)
6. [데이터가 흐르는 방식](#6-데이터가-흐르는-방식)
7. [핵심 라이브러리 설명](#7-핵심-라이브러리-설명)
8. [주요 기능별 코드 흐름](#8-주요-기능별-코드-흐름)
9. [현재 코드의 문제점](#9-현재-코드의-문제점)
10. [리팩토링 계획](#10-리팩토링-계획)

---

## 1. 이 프로젝트가 뭔데?

**Playce** = Play + Place

스포츠 중계를 보여주는 식당/술집을 지도에서 찾아볼 수 있는 서비스입니다.

**핵심 기능:**
- 카카오맵에서 내 주변 식당 검색
- 종목/리그/지역으로 필터링 검색
- 식당 상세보기 (메뉴, 사진, 중계 일정)
- 즐겨찾기 추가/삭제
- 식당 등록/수정/삭제 (사장님 기능)
- 중계 일정 등록/수정/삭제

---

## 2. 기술 스택 한눈에 보기

| 역할 | 라이브러리 | 왜 쓰나? |
|------|-----------|----------|
| UI 프레임워크 | **React 19** | 컴포넌트 기반으로 UI를 만드는 핵심 |
| 언어 | **TypeScript** | 자바스크립트 + 타입 안전성 |
| 빌드 도구 | **Vite** | 빠른 개발 서버 + 빌드 |
| 상태 관리 | **Zustand** | 전역 상태 관리 (Redux보다 간단) |
| 서버 상태 | **React Query** | API 데이터 캐싱 + 자동 재요청 |
| HTTP 통신 | **Axios** | 백엔드 API 호출 |
| CSS | **Tailwind CSS** | 클래스명으로 스타일링 |
| UI 컴포넌트 | **Ant Design** | 미리 만들어진 UI 컴포넌트 (DatePicker 등) |
| 지도 | **react-kakao-maps-sdk** | 카카오맵 연동 |
| 폼 관리 | **react-hook-form** | 폼 입력값 관리 |
| 애니메이션 | **framer-motion** | 모달 슬라이드 등 애니메이션 |
| 라우팅 | **react-router-dom** | 페이지 이동 |

---

## 3. 리액트 기초 용어 정리

### 컴포넌트 (Component)
UI의 조각. 레고 블록이라고 생각하면 됨.
```tsx
// Button.tsx = 하나의 컴포넌트
function Button({ text }) {
  return <button>{text}</button>;
}
```

### Props
부모 → 자식으로 데이터를 전달하는 방법.
```tsx
// 부모가 자식에게 "안녕"을 전달
<Button text="안녕" />
```

### State (상태)
컴포넌트가 기억하고 있는 데이터. 바뀌면 화면이 다시 그려짐.
```tsx
const [count, setCount] = useState(0);
// count가 바뀌면 → 화면 자동 업데이트
```

### Hook (훅)
`use`로 시작하는 함수. 리액트의 기능을 빌려 쓰는 것.
- `useState` → 상태 관리
- `useEffect` → 컴포넌트가 화면에 나타날 때/데이터 바뀔 때 뭔가 실행
- `useRef` → DOM 요소 직접 접근
- 커스텀 훅 → 내가 만든 훅 (예: `useAuth`, `useMap`)

### useEffect 쉽게 이해하기
```tsx
useEffect(() => {
  // "이 컴포넌트가 화면에 나타나면 이걸 해줘"
  fetchData();
}, []);  // [] = 처음 한 번만

useEffect(() => {
  // "isLoggedIn이 바뀔 때마다 이걸 해줘"
  if (isLoggedIn) fetchFavorites();
}, [isLoggedIn]);  // isLoggedIn 바뀔 때마다
```

### Zustand (전역 상태 관리)
여러 컴포넌트에서 같은 데이터를 공유할 때 사용.
```
일반 state: 하나의 컴포넌트에서만 사용
Zustand:   앱 전체에서 공유 (로그인 여부, 즐겨찾기 목록 등)
```

```tsx
// 스토어 만들기
const useAuthStore = create((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
}));

// 아무 컴포넌트에서나 가져다 쓰기
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
```

### React Query (서버 상태 관리)
API에서 가져온 데이터를 똑똑하게 관리.
```
일반 fetch: 매번 서버에 요청 → 느림
React Query: 한번 가져오면 캐시 → 빠름, 자동 갱신
```

> 이 프로젝트에서는 React Query를 설치만 해놓고 거의 안 쓰고 있음.
> Zustand에서 직접 API를 호출하는 패턴을 쓰는 중 → 리팩토링 대상!

---

## 4. 폴더 구조와 역할

```
src/
│
├── main.tsx              # 앱의 시작점
│   └── React Query, Ant Design 테마 설정 후 <App /> 렌더링
│
├── App.tsx               # 라우터 (페이지 연결)
│   └── "/" → Home 페이지
│   └── "/reset-password/:token" → 비밀번호 재설정
│
├── pages/                # 📄 페이지 단위 컴포넌트
│   ├── Home.tsx          # 메인 페이지 (모든 것이 여기서 조합됨)
│   └── SearchPage.tsx    # 왼쪽 검색 사이드바
│
├── components/           # 🧩 UI 조각들
│   ├── Auth/             # 로그인, 회원가입, 비밀번호 재설정
│   ├── Map/              # 카카오맵 관련
│   ├── Search/           # 검색 필터, 결과 리스트
│   ├── RestaurantDetail/ # 식당 상세보기 모달
│   ├── FavoriteSidebar/  # 즐겨찾기 사이드바
│   ├── Mypage/           # 마이페이지 (식당 관리, 중계 관리)
│   ├── TodayBroadcasts/  # 오늘의 중계 정보
│   ├── Common/           # 공통 UI (버튼, 모달, 인풋)
│   └── Select/           # 종목/리그 드롭다운
│
├── stores/               # 🗃️ Zustand 전역 상태 (8개)
│   ├── authStore.ts          # 로그인 상태, 토큰, 모달 열기/닫기
│   ├── mapStore.ts           # 지도 위치, 식당 마커 목록, 줌 레벨
│   ├── favoriteStore.ts      # 즐겨찾기 목록 (추가/삭제/조회)
│   ├── searchStore.ts        # 검색어, 필터 (종목/지역/정렬), 검색 결과
│   ├── broadcastStore.ts     # 중계 일정 목록, 날짜 상태, 뷰 옵션
│   ├── broadcastFormStore.ts # 중계 등록/수정 폼 데이터
│   ├── mypageStore.ts        # 마이페이지 모달 상태, 탭 선택
│   └── restaurantDetailStore.ts # 식당 상세 모달 상태
│
├── api/                  # 🌐 백엔드 API 호출
│   ├── http.ts           # Axios 설정 (토큰 자동 주입, 에러 처리)
│   ├── auth.api.ts       # 로그인, 회원가입, 비밀번호 재설정
│   ├── favorite.api.ts   # 즐겨찾기 추가/삭제/목록
│   ├── broadcast.api.ts  # 중계 등록/수정/삭제/조회
│   ├── restaurant.api.ts # 식당 등록/수정/삭제/상세
│   ├── map.api.ts        # 주변 식당 검색
│   ├── search.api.ts     # 필터 검색
│   ├── staticdata.api.ts # 종목/리그/지역 데이터
│   └── user.api.ts       # 사용자 정보
│
├── hooks/                # 🎣 커스텀 훅 (비즈니스 로직)
│   ├── useAuth.ts        # 로그인/로그아웃/회원가입 처리
│   ├── useMap.ts         # 지도 식당 불러오기
│   ├── useSearch.ts      # 검색 실행 + 거리 계산
│   ├── useGeoLocation.ts # 내 위치 가져오기 (GPS)
│   ├── useSports.ts      # 종목 데이터 가져오기
│   ├── useLeagues.ts     # 리그 데이터 가져오기
│   ├── useRegions.ts     # 지역 데이터 가져오기
│   └── useUser.ts        # 유저 정보 가져오기
│
├── types/                # 📝 타입 정의 (TypeScript)
│   ├── restaurant.types.ts   # 식당 관련 타입
│   ├── broadcast.ts          # 중계 일정 타입
│   ├── Favorite.ts           # 즐겨찾기 타입
│   ├── search.ts             # 검색 결과 타입
│   ├── staticdata.ts         # 종목/리그/지역 타입
│   └── ...
│
├── utils/                # 🔧 유틸 함수
│   ├── formatTime.ts     # 시간 포맷 ("14:30" → "14시 30분")
│   ├── distance.ts       # 거리 계산
│   └── ...
│
├── constant/             # 📌 상수 값
└── data/                 # 📊 정적 데이터
```

---

## 5. 화면 구성

### 메인 화면 레이아웃

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐  ┌──────────────────────────────────┐ │
│  │ 검색바    │  │                                  │ │
│  │          │  │         카카오맵                   │ │
│  │ 종목필터  │  │                                  │ │
│  │          │  │    [재탐색 버튼]     [로그인 버튼]  │ │
│  │ 지역필터  │  │                                  │ │
│  │          │  │    마커들...                       │ │
│  │ 검색결과  │  │      📍 📍 📍                    │ │
│  │ 리스트   │  │                                   │ │
│  │          │  │                                   │ │
│  │ ⭐즐겨찾기│  │                                   │ │
│  └──────────┘  └──────────────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 사용자 흐름

```
지도에서 마커 클릭
    → 팝업 (간단 정보)
        → 클릭하면 식당 상세보기 모달 열림
            → [홈] 기본 정보
            → [메뉴] 메뉴판
            → [사진] 식당 사진들
            → [중계] 중계 일정 목록
            → ⭐ 즐겨찾기 추가/삭제

로그인
    → 마이페이지
        → 즐겨찾기 관리
        → 내 정보 수정
        → 내 식당 관리
            → 식당 등록/수정/삭제
            → 중계 일정 등록/수정/삭제
```

---

## 6. 데이터가 흐르는 방식

### 현재 아키텍처

```
[사용자 클릭]
     │
     ▼
[Component]  ← UI만 담당
     │
     ▼
[Hook]  ← 비즈니스 로직 (useAuth, useSearch 등)
     │
     ▼
[API 함수]  ← 백엔드 서버 호출 (axios)
     │
     ▼
[Store (Zustand)]  ← 전역 상태 업데이트
     │
     ▼
[Component 자동 리렌더링]  ← 상태가 바뀌니 화면도 바뀜
```

### 예시: 즐겨찾기 추가 흐름

```
1. 유저가 ⭐ 버튼 클릭
2. RestaurantDetail.tsx에서 addFavorite(store_id) 호출
3. favoriteStore.ts → favorite.api.ts의 addFavorite(store_id) 호출
4. 백엔드 POST /favorites/{store_id}
5. 성공하면 fetchFavorites()로 전체 목록 다시 가져옴
6. favorites 상태 업데이트
7. FavoriteSidebar가 자동으로 새 목록 렌더링
```

### 예시: 검색 흐름

```
1. 유저가 종목/지역 선택 후 검색 버튼 클릭
2. SearchPage.tsx → useSearch 훅의 doSearch() 호출
3. searchStore에서 필터값 가져옴
4. search.api.ts → GET /search (필터 파라미터 전달)
5. 결과에 거리 계산 추가 (distance.ts)
6. searchStore.results 업데이트
7. SearchResultList.tsx가 자동으로 결과 렌더링
```

---

## 7. 핵심 라이브러리 설명

### Zustand - 전역 상태 관리

```
왜 필요한가?
    로그인 여부를 Header에서도 알아야 하고
    FavoriteSidebar에서도 알아야 하고
    RestaurantDetail에서도 알아야 함
    → 하나의 store에 넣고 어디서든 꺼내 쓰기
```

```tsx
// 만들기 (stores/authStore.ts)
const useAuthStore = create((set) => ({
  isLoggedIn: false,
  storeLogin: () => set({ isLoggedIn: true }),
  storeLogout: () => set({ isLoggedIn: false }),
}));

// 쓰기 (아무 컴포넌트에서)
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
const login = useAuthStore((state) => state.storeLogin);
```

**이 프로젝트의 store 8개:**
| Store | 하는 일 |
|-------|---------|
| authStore | 로그인 상태, 토큰, 로그인/회원가입 모달 |
| mapStore | 지도 위치, 식당 마커들, 줌 레벨 |
| favoriteStore | 즐겨찾기 목록 CRUD |
| searchStore | 검색어, 필터값, 검색 결과 |
| broadcastStore | 중계 일정 목록, 날짜, 뷰 모드 |
| broadcastFormStore | 중계 등록/수정 폼 입력값 |
| mypageStore | 마이페이지 모달, 탭, 서브페이지 |
| restaurantDetailStore | 식당 상세 모달 상태 |

### React Query - 서버 상태 관리

```
설치는 되어있지만 거의 안 쓰는 중!
현재: store에서 직접 API 호출 → 캐싱 없음, 로딩 상태 수동 관리
리팩토링 후: React Query 활용 → 자동 캐싱, 로딩/에러 상태 자동 관리
```

```tsx
// 현재 방식 (직접 호출)
const fetchFavorites = async () => {
  const res = await getFavorites();
  set({ favorites: res.data });
};

// 리팩토링 후 (React Query)
const { data, isLoading, error } = useQuery({
  queryKey: ['favorites'],
  queryFn: getFavorites,
});
// → 캐싱 자동, 로딩 상태 자동, 에러 처리 자동, 재요청 자동
```

**React Query의 핵심 개념:**
- `useQuery` → 데이터 조회 (GET 요청)
- `useMutation` → 데이터 변경 (POST, PATCH, DELETE)
- `queryKey` → 캐시 키 (같은 키면 캐시에서 가져옴)
- `invalidateQueries` → 캐시 무효화 (데이터 다시 가져옴)

### Axios - HTTP 클라이언트

```tsx
// api/http.ts에서 설정된 것들:
// 1. 모든 요청에 자동으로 JWT 토큰 붙이기
// 2. 401 에러 (로그인 만료) 시 자동으로 토큰 삭제
// 3. BASE_URL 자동 적용

// 그래서 API 함수에서는 간단하게:
export const getFavorites = () =>
  requestHandler<FavoriteStore[]>("get", "/favorites");
```

### Tailwind CSS - 유틸리티 CSS

```tsx
// 일반 CSS:  className="button" + 별도 CSS 파일
// Tailwind:  클래스명에 스타일을 직접 씀
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow">
//             ↑ 가로배치  ↑ 세로정렬  ↑ 간격  ↑ 패딩  ↑ 흰배경  ↑ 둥근모서리  ↑ 그림자
```

자주 쓰이는 Tailwind 클래스:
| 클래스 | 뜻 |
|--------|-----|
| `flex` | 가로 배치 |
| `flex-col` | 세로 배치 |
| `items-center` | 세로 중앙 정렬 |
| `justify-between` | 양쪽 끝 정렬 |
| `p-4` | 패딩 16px |
| `m-2` | 마진 8px |
| `text-sm` | 작은 글씨 |
| `font-bold` | 굵은 글씨 |
| `bg-white` | 흰 배경 |
| `rounded-lg` | 둥근 모서리 |
| `w-full` | 너비 100% |
| `h-screen` | 높이 화면 전체 |
| `hidden` | 숨김 |
| `cursor-pointer` | 마우스 포인터 |

---

## 8. 주요 기능별 코드 흐름

### 즐겨찾기

**관련 파일:**
```
api/favorite.api.ts        → 서버 통신 (3개 API)
stores/favoriteStore.ts    → 상태 관리
components/FavoriteSidebar/FavoriteSidebar.tsx  → 사이드바 UI
components/Mypage/FavoriteList.tsx              → 마이페이지 목록
components/RestaurantDetail/RestaurantDetail.tsx → ⭐ 토글 버튼
```

**API 엔드포인트:**
- `GET /favorites` → 즐겨찾기 목록 조회
- `POST /favorites/{store_id}` → 추가
- `DELETE /favorites/{store_id}` → 삭제

**현재 문제:**
- 추가/삭제할 때마다 전체 목록을 다시 불러옴 (비효율)
- 로딩 상태 없음 (느리면 유저가 모름)
- 에러 처리 없음 (실패해도 알려주지 않음)

### 중계 일정

**관련 파일:**
```
api/broadcast.api.ts       → 서버 통신
stores/broadcastStore.ts   → 일정 목록 상태
stores/broadcastFormStore.ts → 등록/수정 폼 상태
components/RestaurantDetail/RestaurantDetailBroadcastTab.tsx → 상세보기 내 중계 탭
components/Mypage/RestaurantManage/Broadcasts/  → 중계 관리 (폴더 전체)
```

**핵심 로직 (RestaurantDetailBroadcastTab.tsx):**
1. 중계 일정을 날짜별로 그룹핑
2. 미래 일정 / 과거 일정 분리
3. 날짜순 → 시간순 정렬
4. 과거 일정은 접기/펼치기

### 식당 상세보기 모달

**관련 파일:**
```
components/RestaurantDetail/
    RestaurantDetail.tsx         → 메인 컨테이너 (430px 고정 너비)
    RestaurantDetailImageSection.tsx → 대표 이미지 + ⭐ 버튼
    RestaurantDetailHeader.tsx   → 식당 이름
    RestaurantDetailTabs.tsx     → [홈|메뉴|사진|중계] 탭 전환
    RestaurantDetailHomeTab.tsx  → 기본 정보 (주소, 전화, 영업시간)
    RestaurantDetailMenuTab.tsx  → 메뉴 목록
    RestaurantDetailPhotoTab.tsx → 사진 갤러리
    RestaurantDetailBroadcastTab.tsx → 중계 일정
```

### 인증 (로그인/회원가입)

**흐름:**
```
AuthHeader.tsx (로그인 버튼)
    → authStore.setIsLoginModalOpen(true)
    → Login.tsx 모달 표시
    → useAuth.userLogin() 호출
    → auth.api.ts → POST /users/login
    → 토큰 localStorage 저장
    → authStore.storeLogin()
    → 모달 닫힘, UI 업데이트
```

---

## 9. 현재 코드의 문제점

### 심각도 높음

| 문제 | 파일 | 설명 |
|------|------|------|
| 테스트 코드 0개 | 전체 | 리팩토링 시 뭘 망가뜨렸는지 알 수 없음 |
| React Query 미활용 | stores/ 전체 | 설치해놓고 안 쓰는 중. store에서 직접 API 호출 |
| alert() 하드코딩 | RestaurantDetail.tsx:114 | `alert("중계일정 관리 기능을 여기에 구현하세요!")` |
| 에러 처리 부재 | 대부분의 API 호출 | try-catch 안 하거나, catch에서 아무것도 안 함 |
| 즐겨찾기 비효율 | favoriteStore.ts | 추가/삭제마다 전체 목록 재조회 |

### 심각도 중간

| 문제 | 파일 | 설명 |
|------|------|------|
| DOM ref를 store에 저장 | broadcastStore.ts:29-32 | Zustand에 React ref 넣으면 안 됨 |
| 모달 고정 너비 | ModalBase.tsx | 400px, 600px, 850px 고정 → 모바일 안 됨 |
| 함수 중복 | formatTime.ts vs 컴포넌트 내 | 같은 함수가 여러 군데 구현됨 |
| useEffect 의존성 | Home.tsx:46 | eslint 경고 무시 (주석으로 끔) |
| 모달 상태 혼재 | mypageStore.ts | 모달 상태와 식당 편집 상태가 한 store에 섞임 |

### 심각도 낮음

| 문제 | 파일 | 설명 |
|------|------|------|
| localStorage 토큰 | authStore.ts | XSS 취약점 가능성 (포폴에선 OK) |
| 401 처리 미흡 | http.ts | 토큰 만료 시 조용히 삭제만 함, 유저에게 알림 없음 |
| 접근성 부족 | 전체 | 키보드 네비게이션, aria 레이블 부족 |

---

## 10. 리팩토링 계획

### Phase 1: 기반 작업 (먼저 해야 함)

**1-1. 프로젝트 실행 + 현재 상태 확인**
```bash
# 백엔드 (이미 실행 중)
cd backend && npm run dev

# 프론트엔드
cd frontend && npm install && npm run dev
```
- 모든 기능 직접 클릭해보면서 현재 동작 파악
- 버그인지 미구현인지 구분

**1-2. 테스트 환경 세팅**
- Vitest 설치 (Vite 프로젝트니까 Vitest가 맞음)
- 핵심 기능 테스트 먼저 작성:
  - 즐겨찾기 추가/삭제
  - 중계 일정 날짜 그룹핑/정렬
  - 시간 포맷 함수

### Phase 2: API 레이어 리팩토링

**2-1. React Query 도입**

현재:
```tsx
// store에서 직접 API 호출 (나쁜 패턴)
const favoriteStore = create((set) => ({
  favorites: [],
  fetchFavorites: async () => {
    const res = await getFavorites();
    set({ favorites: res.data });
  },
}));
```

리팩토링 후:
```tsx
// React Query로 (좋은 패턴)
const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });
};

// 컴포넌트에서
const { data: favorites, isLoading, error } = useFavorites();
```

**이렇게 바꾸면:**
- 자동 캐싱 (같은 데이터 다시 안 불러옴)
- 로딩/에러 상태 자동 관리
- 낙관적 업데이트 (추가 버튼 누르면 바로 UI 반영, 서버 실패 시 롤백)
- store 코드가 절반으로 줄어듦

**2-2. 에러 처리 추가**
- 모든 API 호출에 에러 토스트 (antd message.error)
- 로딩 상태 표시 (skeleton UI)

### Phase 3: 컴포넌트 리팩토링

**3-1. 모달 시스템 정리**
- 고정 너비 → 반응형
- 모달 상태 관리 일원화

**3-2. broadcastStore에서 ref 제거**
- DOM ref는 컴포넌트 안에서 useRef로

**3-3. 중복 함수 정리**
- formatTime 등 유틸 함수 통일

**3-4. alert() 제거**
- antd message 또는 toast로 교체

### Phase 4: 포트폴리오 품질

**4-1. 반응형 디자인**
- 모바일 대응 (Tailwind 브레이크포인트 활용)

**4-2. 코드 품질**
- ESLint 경고 0개 목표
- 불필요한 eslint-disable 주석 제거

**4-3. README 작성**
- 프로젝트 소개, 기술 스택, 실행 방법
- 본인이 리팩토링한 부분 명시
- 스크린샷/GIF

---

## 리팩토링 시 핵심 원칙

```
1. 테스트 먼저 → 코드 수정 → 테스트 확인
   (안전망 없이 코드 바꾸지 말 것)

2. 한 번에 하나만 바꾸기
   (여러 개 동시에 바꾸면 뭐가 문제인지 모름)

3. 작동하는 상태 유지
   (큰 리팩토링도 작은 단계로 나눠서)

4. 커밋 자주 하기
   (git commit을 자주 해서 되돌릴 수 있게)
```

---

## 빠른 참고: 파일별 코드 라인 수

| 카테고리 | 파일 수 | 대략적 코드량 |
|----------|---------|-------------|
| Components | ~50개 | ~4,000줄 |
| Stores | 8개 | ~400줄 |
| API | 9개 | ~200줄 |
| Hooks | 8개 | ~300줄 |
| Types | 8개 | ~150줄 |
| Utils | ~5개 | ~100줄 |
| **전체** | **~88개** | **~5,500줄** |

작은 프로젝트이므로 전체 리팩토링 충분히 가능합니다!
