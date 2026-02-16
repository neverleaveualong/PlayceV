# PlayceV 프론트엔드 리팩토링 순서

> 순서대로 따라가면 됩니다. 각 단계마다 커밋하세요.

---

## 전체 로드맵

```
Phase 0: 환경 세팅 + 현재 상태 파악
    ↓
Phase 1: 테스트 환경 구축 + 핵심 테스트 작성
    ↓
Phase 2: React Query 도입 (가장 큰 변화)
    ↓
Phase 3: 컴포넌트 정리 (안티패턴 제거)
    ↓
Phase 4: UX 개선 (에러 처리, 로딩, 반응형)
    ↓
Phase 5: 포트폴리오 마무리
```

---

## Phase 0: 환경 세팅 + 현재 상태 파악

> 목표: 프로젝트를 실행하고 모든 기능을 직접 확인한다.

### 0-1. 프로젝트 실행

```bash
# 백엔드 (터미널 1)
cd backend
npm install
npm run dev
# ✅ Redis 연결 성공 / 📦 DB 연결 성공 / 🚀 서버 실행 중 확인

# 프론트엔드 (터미널 2)
cd frontend
npm install
npm run dev
# → http://localhost:5173 접속
```

### 0-2. 기능 체크리스트

브라우저에서 아래 기능을 하나씩 클릭해보고, 되는지/안되는지 기록하세요.

```
[ ] 지도 표시되는지
[ ] 내 위치 기반 마커 표시
[ ] 마커 클릭 → 팝업
[ ] 팝업 클릭 → 식당 상세보기
[ ] 상세보기 탭 전환 (홈/메뉴/사진/중계)
[ ] 회원가입
[ ] 로그인
[ ] 로그인 후 즐겨찾기 추가/삭제
[ ] 즐겨찾기 사이드바에 반영되는지
[ ] 검색 (종목/지역 필터)
[ ] 마이페이지 열기
[ ] 마이페이지 → 즐겨찾기 목록
[ ] 마이페이지 → 내 정보
[ ] 마이페이지 → 식당 관리
[ ] 식당 등록
[ ] 식당 수정/삭제
[ ] 중계 일정 등록
[ ] 중계 일정 수정/삭제
[ ] 재탐색 버튼
```

> 안 되는 기능이 있으면 메모해두세요. 원래 버그인지 나중에 내가 만든 버그인지 구분해야 합니다.

### 0-3. 브랜치 생성

```bash
git checkout -b refactor/frontend
```

이후 모든 작업은 이 브랜치에서 진행. 단계마다 커밋하고, 완료되면 PR로 main에 머지.

---

## Phase 1: 테스트 환경 구축

> 목표: 리팩토링해도 기존 기능이 안 깨지는 안전망을 만든다.

### 1-1. Vitest 설치

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

### 1-2. Vitest 설정

```ts
// vite.config.ts 에 추가
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

```ts
// src/test/setup.ts (새로 생성)
import '@testing-library/jest-dom'
```

```json
// package.json scripts에 추가
"test": "vitest",
"test:run": "vitest run"
```

### 1-3. 유틸 함수 테스트 (가장 쉬운 것부터)

```
테스트할 파일:
  src/utils/formatTime.ts   → 시간 포맷 변환
  src/utils/distance.ts     → 거리 계산
```

```ts
// src/utils/__tests__/formatTime.test.ts
import { describe, it, expect } from 'vitest'
import { formatTime } from '../formatTime'

describe('formatTime', () => {
  it('14:30을 14시 30분으로 변환한다', () => {
    expect(formatTime('14:30')).toBe('14시 30분')
  })

  it('09:00을 9시 00분으로 변환한다', () => {
    expect(formatTime('09:00')).toBe('9시 00분')
  })
})
```

### 1-4. Store 테스트

```
테스트할 파일:
  stores/favoriteStore.ts   → 즐겨찾기 추가/삭제/초기화
  stores/authStore.ts       → 로그인/로그아웃 상태 전환
```

```ts
// src/stores/__tests__/favoriteStore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// API 모킹
vi.mock('../../api/favorite.api', () => ({
  getFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}))

describe('favoriteStore', () => {
  beforeEach(() => {
    // 매 테스트 전 store 초기화
  })

  it('resetFavorites는 즐겨찾기를 빈 배열로 초기화한다', () => {
    // ...
  })

  it('fetchFavorites는 API를 호출하고 결과를 저장한다', () => {
    // ...
  })
})
```

### 1-5. 컴포넌트 테스트 (중계 일정 로직)

```
테스트할 로직:
  RestaurantDetailBroadcastTab.tsx의 날짜 그룹핑 + 정렬 로직
```

> 이 로직은 컴포넌트 안에 섞여있음 → 리팩토링 때 유틸 함수로 분리 예정
> 지금은 컴포넌트 렌더링 테스트로 작성

```bash
# 테스트 실행
npm run test
```

### 커밋

```bash
git add -A
git commit -m "feat: add vitest setup and initial tests"
```

---

## Phase 2: React Query 도입

> 목표: store에서 API 호출하는 패턴 → React Query 커스텀 훅으로 전환.
> 이게 가장 큰 변화이고, 가장 임팩트 있는 리팩토링입니다.

### 전환 순서 (쉬운 것부터)

```
2-1. 고정 데이터 (종목/리그/지역) → 가장 단순, 연습용
2-2. 즐겨찾기 → CRUD 전체, 핵심 기능
2-3. 식당 상세 → 캐싱 효과 큼
2-4. 검색 → 복잡한 필터
2-5. 중계 일정 → 폼 연동
```

### 2-1. 고정 데이터 전환 (연습)

**현재 (hooks/useSports.ts):**
```tsx
// useEffect에서 직접 API 호출 → state에 저장
const [sports, setSports] = useState([])
useEffect(() => {
  const fetch = async () => {
    const res = await getSports()
    setSports(res.data)
  }
  fetch()
}, [])
```

**리팩토링 후:**
```tsx
// hooks/useSports.ts
import { useQuery } from '@tanstack/react-query'
import { getSports } from '../api/staticdata.api'

export const useSports = () => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: getSports,
    staleTime: 1000 * 60 * 60,  // 1시간 캐시 (고정 데이터니까)
  })
}

// 컴포넌트에서 사용
const { data: sports, isLoading } = useSports()
```

**같은 방식으로 전환:**
- `useLeagues.ts`
- `useRegions.ts`

```bash
git commit -m "refactor: migrate static data hooks to React Query"
```

### 2-2. 즐겨찾기 전환 (핵심)

**현재 구조:**
```
favoriteStore.ts (상태 + API 호출 섞여있음)
  → fetchFavorites()
  → addFavorite()
  → removeFavorite()
```

**리팩토링 후 구조:**
```
hooks/useFavorites.ts (React Query 훅)
  → useFavorites()        ← useQuery (목록 조회)
  → useAddFavorite()      ← useMutation (추가)
  → useRemoveFavorite()   ← useMutation (삭제)

stores/favoriteStore.ts   ← 삭제 또는 최소화
```

**새 코드:**
```tsx
// hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, addFavorite, removeFavorite } from '../api/favorite.api'

// 즐겨찾기 목록 조회
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 5,  // 5분 캐시
  })
}

// 즐겨찾기 추가
export const useAddFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storeId: number) => addFavorite(storeId),
    onSuccess: () => {
      // 성공하면 즐겨찾기 목록 캐시 무효화 → 자동 재조회
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

// 즐겨찾기 삭제
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storeId: number) => removeFavorite(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
```

**컴포넌트 수정:**
```tsx
// FavoriteSidebar.tsx (Before)
const { favorites, fetchFavorites, removeFavorite } = useFavoriteStore()
useEffect(() => { fetchFavorites() }, [])

// FavoriteSidebar.tsx (After)
const { data: favorites, isLoading } = useFavorites()
const removeMutation = useRemoveFavorite()
// fetchFavorites() 호출 필요 없음! React Query가 자동으로 함
```

**수정해야 할 컴포넌트:**
```
FavoriteSidebar.tsx      → useFavorites() 사용
FavoriteList.tsx         → useFavorites() + useRemoveFavorite()
RestaurantDetail.tsx     → useAddFavorite() + useRemoveFavorite()
App.tsx                  → favoriteStore 연동 제거
```

```bash
git commit -m "refactor: migrate favorites to React Query with cache invalidation"
```

### 2-3. 식당 상세 전환

```tsx
// hooks/useStoreDetail.ts
export const useStoreDetail = (storeId: number) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => getStoreDetail(storeId),
    enabled: !!storeId,  // storeId가 있을 때만 호출
  })
}
```

```bash
git commit -m "refactor: migrate store detail to React Query"
```

### 2-4. 검색 전환

```tsx
// hooks/useSearch.ts
export const useSearchStores = (filters) => {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => fetchSearchResults(filters),
    enabled: false,  // 수동으로 호출 (버튼 클릭 시)
  })
}
```

```bash
git commit -m "refactor: migrate search to React Query"
```

### 2-5. 중계 일정 전환

```tsx
// hooks/useBroadcasts.ts
export const useBroadcasts = (storeId: number) => {
  return useQuery({
    queryKey: ['broadcasts', storeId],
    queryFn: () => getBroadcast(storeId),
    enabled: !!storeId,
  })
}

export const useCreateBroadcast = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBroadcast,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['broadcasts', variables.store_id]
      })
    },
  })
}
```

```bash
git commit -m "refactor: migrate broadcasts to React Query"
```

### Phase 2 완료 후 정리

**삭제 가능한 store:**
```
favoriteStore.ts      → React Query로 대체됨
searchStore.ts        → results 부분만 React Query로 (필터 상태는 유지)
```

**축소되는 store:**
```
broadcastStore.ts     → API 호출 부분 제거, UI 상태만 남김
```

```bash
git commit -m "refactor: remove unused store code after React Query migration"
```

---

## Phase 3: 컴포넌트 정리

> 목표: 안티패턴 제거, 코드 중복 정리

### 3-1. broadcastStore에서 DOM ref 제거

**현재 (안티패턴):**
```tsx
// broadcastStore.ts
tabRef: null as HTMLDivElement | null,
itemRefs: {} as Record<string, HTMLDivElement | null>,
setTabRef: (ref) => set({ tabRef: ref }),
```

**리팩토링:**
```tsx
// BroadcastView.tsx (컴포넌트 안에서 관리)
const tabRef = useRef<HTMLDivElement>(null)
const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
```

```bash
git commit -m "refactor: move DOM refs from broadcastStore to component useRef"
```

### 3-2. 중복 함수 정리

**현재:**
```
RestaurantDetailBroadcastTab.tsx 안에 formatTime() 직접 구현
TodayBroadCasts.tsx 안에 formatTime() 직접 구현
utils/formatTime.ts 에도 있음
```

**리팩토링:**
```
모든 곳에서 utils/formatTime.ts 하나만 import해서 사용
```

같은 방식으로 중복된 유틸 함수 모두 정리:
- 날짜 포맷
- 거리 계산
- 에러 메시지 매핑

```bash
git commit -m "refactor: deduplicate utility functions"
```

### 3-3. 중계 일정 로직 분리

**현재 (RestaurantDetailBroadcastTab.tsx):**
```
컴포넌트 안에 비즈니스 로직이 섞여있음:
- 날짜별 그룹핑
- 미래/과거 분리
- 정렬
```

**리팩토링:**
```tsx
// utils/broadcastUtils.ts (새로 생성)
export const groupBroadcastsByDate = (broadcasts) => { ... }
export const separateFutureAndPast = (grouped) => { ... }
export const sortBroadcasts = (broadcasts) => { ... }

// RestaurantDetailBroadcastTab.tsx
import { groupBroadcastsByDate, separateFutureAndPast } from '../../utils/broadcastUtils'
// 컴포넌트는 UI만 담당
```

> 이렇게 분리하면 테스트도 쉬워짐 (컴포넌트 렌더링 없이 로직만 테스트 가능)

```bash
git commit -m "refactor: extract broadcast logic to utility functions"
```

### 3-4. alert() 제거

```
찾아서 바꿀 것:
  alert("...") → message.error("...") 또는 message.success("...")
```

```tsx
import { message } from 'antd'

// Before
alert("중계일정 관리 기능을 여기에 구현하세요!")

// After
message.info("중계일정 관리 기능은 마이페이지에서 이용해주세요.")
```

```bash
git commit -m "refactor: replace alert() with antd message"
```

### 3-5. mypageStore 분리

**현재 (하나에 다 섞여있음):**
```tsx
// mypageStore.ts
isMypageOpen        // 모달 상태
selectedTab         // 모달 상태
restaurantSubpage   // 모달 상태
restaurantEditId    // 식당 편집 상태 ← 성격이 다름
restaurantEditName  // 식당 편집 상태 ← 성격이 다름
```

**리팩토링:**
```tsx
// stores/mypageStore.ts (모달 상태만)
isMypageOpen
selectedTab
restaurantSubpage

// stores/restaurantEditStore.ts (편집 상태)
editId
editName
```

```bash
git commit -m "refactor: split mypageStore into modal and edit stores"
```

---

## Phase 4: UX 개선

> 목표: 사용자 경험 향상. 포트폴리오에서 "이 사람은 UX도 신경 쓴다"는 인상.

### 4-1. 에러 처리 통합

```tsx
// utils/errorHandler.ts (새로 생성)
import { message } from 'antd'

export const handleApiError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    switch (status) {
      case 401:
        message.error('로그인이 필요합니다.')
        break
      case 404:
        message.error('데이터를 찾을 수 없습니다.')
        break
      default:
        message.error(`${context} 중 오류가 발생했습니다.`)
    }
  }
}
```

**React Query의 onError에서 사용:**
```tsx
export const useAddFavorite = () => {
  return useMutation({
    mutationFn: addFavorite,
    onError: (error) => handleApiError(error, '즐겨찾기 추가'),
    onSuccess: () => {
      message.success('즐겨찾기에 추가되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
```

```bash
git commit -m "feat: add unified error handling with user-facing messages"
```

### 4-2. 로딩 상태 추가

```tsx
// Before (아무것도 안 보임)
{favorites.map(f => <FavoriteItem key={f.store_id} {...f} />)}

// After (로딩 중이면 스켈레톤)
import { Skeleton } from 'antd'

{isLoading ? (
  <Skeleton active paragraph={{ rows: 3 }} />
) : (
  favorites?.map(f => <FavoriteItem key={f.store_id} {...f} />)
)}
```

**추가할 곳:**
```
[ ] 식당 상세보기 로딩
[ ] 즐겨찾기 목록 로딩
[ ] 검색 결과 로딩
[ ] 중계 일정 로딩
```

```bash
git commit -m "feat: add loading skeletons for better UX"
```

### 4-3. 모달 반응형 대응

**현재 (고정 너비):**
```tsx
// ModalBase.tsx
const widthClass = type === "auth" ? "w-[400px]"
                 : type === "mypage" ? "w-[850px]"
                 : "w-[600px]"
```

**리팩토링:**
```tsx
const widthClass = type === "auth"
  ? "w-full max-w-[400px]"
  : type === "mypage"
  ? "w-full max-w-[850px]"
  : "w-full max-w-[600px]"

// + 모바일 패딩 추가
className="mx-4 md:mx-0"
```

```bash
git commit -m "feat: make modals responsive for mobile screens"
```

### 4-4. 401 자동 로그아웃 개선

**현재 (조용히 토큰만 삭제):**
```tsx
// http.ts
if (error.response?.status === 401) {
  removeToken()
}
```

**리팩토링:**
```tsx
if (error.response?.status === 401) {
  removeToken()
  useAuthStore.getState().storeLogout()
  message.warning('로그인이 만료되었습니다. 다시 로그인해주세요.')
}
```

```bash
git commit -m "feat: improve 401 handling with user notification"
```

---

## Phase 5: 포트폴리오 마무리

> 목표: 면접관이 봤을 때 "잘 했다"고 느끼게 만들기.

### 5-1. ESLint 정리

```bash
npm run lint
# 모든 경고/에러 0개 될 때까지 수정
```

특히:
```
[ ] eslint-disable 주석 모두 제거하고 근본 원인 수정
[ ] useEffect 의존성 배열 정리
[ ] 미사용 import 제거
[ ] 미사용 변수 제거
```

```bash
git commit -m "chore: fix all ESLint warnings"
```

### 5-2. 테스트 보강

```
Phase 1에서 만든 테스트에 추가:
[ ] React Query 훅 테스트
[ ] broadcastUtils 유틸 테스트
[ ] 에러 핸들러 테스트
```

```bash
git commit -m "test: add comprehensive tests for refactored code"
```

### 5-3. README 작성

```markdown
# Playce - 스포츠 중계 맛집 찾기

## 프로젝트 소개
(스크린샷/GIF 넣기)

## 기술 스택
(뱃지로 예쁘게)

## 내가 한 것 (리팩토링 내역)
- React Query 도입으로 서버 상태 관리 개선
- 테스트 코드 작성 (Vitest)
- 에러 처리 통합
- 반응형 모달
- ...

## 실행 방법

## 폴더 구조
```

```bash
git commit -m "docs: add project README"
```

### 5-4. PR 만들기

```bash
git push origin refactor/frontend
# GitHub에서 PR 생성
# PR 설명에 변경 내역 상세히 작성
```

---

## 체크리스트 (전체)

### Phase 0
- [ ] 백엔드 실행 확인
- [ ] 프론트엔드 실행 확인
- [ ] 모든 기능 수동 테스트
- [ ] refactor/frontend 브랜치 생성

### Phase 1
- [ ] Vitest 설치 + 설정
- [ ] formatTime 테스트
- [ ] distance 유틸 테스트
- [ ] favoriteStore 테스트
- [ ] 중계 일정 로직 테스트

### Phase 2
- [ ] 고정 데이터 React Query 전환
- [ ] 즐겨찾기 React Query 전환
- [ ] 식당 상세 React Query 전환
- [ ] 검색 React Query 전환
- [ ] 중계 일정 React Query 전환
- [ ] 불필요한 store 코드 제거

### Phase 3
- [ ] broadcastStore에서 DOM ref 제거
- [ ] 중복 함수 정리
- [ ] 중계 일정 로직 유틸로 분리
- [ ] alert() → antd message
- [ ] mypageStore 분리

### Phase 4
- [ ] 에러 처리 통합
- [ ] 로딩 스켈레톤 추가
- [ ] 모달 반응형
- [ ] 401 자동 로그아웃 개선

### Phase 5
- [ ] ESLint 경고 0개
- [ ] 테스트 보강
- [ ] README 작성
- [ ] PR 생성 + 상세 설명

---

## 예상 소요 시간

| Phase | 내용 | 예상 |
|-------|------|------|
| Phase 0 | 환경 세팅 + 파악 | 1일 |
| Phase 1 | 테스트 환경 + 작성 | 2-3일 |
| Phase 2 | React Query 전환 | 3-5일 |
| Phase 3 | 컴포넌트 정리 | 2-3일 |
| Phase 4 | UX 개선 | 2-3일 |
| Phase 5 | 마무리 | 1-2일 |
| **합계** | | **약 2-3주** |

> 하루에 집중해서 4-5시간 기준입니다.
> 리액트 공부하면서 하면 3-4주 걸릴 수 있습니다.

---

## 포트폴리오에서 어필할 포인트

면접에서 이렇게 말할 수 있습니다:

1. **"React Query를 도입해서 서버 상태 관리를 개선했습니다"**
   - Before: store에서 직접 API 호출, 캐싱 없음, 로딩 상태 수동
   - After: 자동 캐싱, 자동 재요청, 낙관적 업데이트

2. **"테스트 코드를 작성해서 리팩토링 안전성을 확보했습니다"**
   - 테스트 0개 → 핵심 기능 테스트 커버

3. **"안티패턴을 식별하고 개선했습니다"**
   - Zustand에 DOM ref 저장 → useRef로 이동
   - 비즈니스 로직과 UI 분리
   - 중복 코드 제거

4. **"사용자 경험을 개선했습니다"**
   - 에러 알림, 로딩 표시, 반응형 디자인
