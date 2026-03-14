# PlayceV 프론트엔드 리팩토링 로드맵

> 학습 목적 리팩토링 — 면접에서 왜 이렇게 했는지 설명할 수 있어야 함

---

## 완료된 단계

### P1: 죽은 코드 제거 — PR #3 (merged)
- 사용하지 않는 컴포넌트, 변수, import 정리
- 불필요한 파일 삭제

### P2: 구조 정리 — PR #4, #5, #6 (merged)
- **P2-1**: 디렉토리 구조 정리 + Path Alias(`@/` → `src/`) + 네이밍 컨벤션(Airbnb 스타일)
- **P2-2**: 중복 코드 통합 (타입·컴포넌트·유틸)
- **P2-3**: 공통 훅·컴포넌트 추출

### P3: 버그 수정 + QA — PR #10 (merged)
- 전체 기능 수동 테스트 후 버그 수정
- 에러 메시지 개선, 로딩 상태 추가, GPS 관련 버그 수정

### P4: React Query 도입 — PR #13, #14 (merged)
- 즐겨찾기·식당 상세·중계·검색·지도 주변 식당 → React Query 전환
- mapStore에서 서버 데이터 분리, searchPosition/radius 도입

### P5: React Hook Form 도입 — PR #15 (merged)
- 식당 등록/수정, 중계 등록/수정 폼에 React Hook Form 적용

### P6: 코드 스플리팅 — PR #16 (merged)
- 모달/마이페이지 lazy 로딩 적용

### P7: 성능 최적화 — PR #17 (merged)
- 렌더링 성능 최적화 및 번들 청크 분리

---

## 남은 단계

### P8: 버그 수정 + 잔여 안티패턴 정리

#### 버그 수정
- [ ] `Login.tsx` + `useAuth.ts` — 로그인 실패해도 모달이 닫히는 버그
  - `userLogin(data)` 비동기인데 await 안 하고 바로 `setIsLoginModalOpen(false)` 실행
  - `onSubmit`에서 모달 닫기 제거, `useAuth` 내부에서만 처리
- [ ] `PasswordResetModal.tsx` — 비밀번호 리셋 실패해도 성공 토스트 + navigate 실행
  - `userPasswordReset` 결과를 await하고, 성공 시에만 토스트 + navigate
- [ ] `api/http.ts` — GET 요청 `URLSearchParams`가 number/배열 처리 못함
  - `search.api.ts`만 `qs`로 우회 중 → `requestHandler` GET 경로도 `qs`로 통일
- [ ] `toastStore.ts` — `Date.now()` id 충돌 가능성
  - `crypto.randomUUID()` 또는 `++counter`로 교체

#### 잔여 안티패턴 제거
- [ ] `broadcastStore.ts` — DOM ref(`tabRef`, `itemRefs`)가 store에 저장됨
  - `TabLists.tsx` 내부 `useRef`로 이동, `scrollDateCenter` 로직도 컴포넌트로
  - 해결하면 `TabLists.tsx`의 `eslint-disable` 주석 2개도 자연 제거
- [ ] `broadcastFormStore.ts` — P5에서 Hook Form 도입했는데 아직 살아있음
  - `editingId` 상태를 사용하는 곳 확인 후 정리/제거
- [ ] `Home.tsx` — `useMypageStore()` 3번 따로 호출 → 하나로 합치기
- [ ] `window.confirm()` 3곳 제거
  - `RestaurantHome.tsx` — 식당 삭제 확인
  - `RestaurantManager.tsx` — 수정 취소 확인
  - `TabLists.tsx` — 중계 삭제 확인
  - → 커스텀 ConfirmModal 컴포넌트로 교체

---

### P9: UX/UI 개선

#### 에러 처리
- [ ] `http.ts` 401 인터셉터 — 토큰 만료 시 사용자 알림 추가
  - `useToastStore.getState().addToast("로그인이 만료되었습니다", "info")`
- [ ] `useFavorites.ts` — 즐겨찾기 추가/삭제 `onError` 핸들러 누락
- [ ] `useAuth.ts` — `userLogout` try-catch 데드코드 정리

#### 로딩 상태
- [ ] 즐겨찾기 사이드바 — 로딩 스켈레톤 없음
- [ ] 오늘의 중계 사이드바 — 로딩 스켈레톤 없음 (Render 콜드스타트 시 30초)
- [ ] 식당 상세 — 로딩 상태 개선

#### 중복 제출 방어
- [ ] 로그인/회원가입 — submit 버튼에 `isPending` 연동
- [ ] 중계 등록 — `BroadcastRegisterEdit.tsx` submit 버튼 로딩 상태
- [ ] 즐겨찾기 토글 — `useFavoriteToggle`에서 `isPending` 반환 + 버튼 비활성화

#### UI 디테일
- [ ] `window.confirm()` → 커스텀 확인 다이얼로그 (P8에서 컴포넌트 만들고 여기서 스타일)
- [ ] `PlayceModal.tsx` — 외부 placeholder URL(`placehold.co`) → 로컬 fallback 통일
- [ ] `SearchPage.tsx` — 인라인 SVG 반복 → `react-icons` 교체
- [ ] `BroadcastView.tsx` — 매직 넘버 `2`(개월) → 상수 분리
- [ ] `useMyStores.ts` — `enabled: isLoggedIn` guard 추가 (다른 훅과 일관성)

---

### P10: 접근성(a11y) 개선

#### 시맨틱 HTML
- [ ] `RestaurantHome.tsx` — `<ul>` 안 `<div>` → `<li>`로 교체
- [ ] 클릭 가능한 `<div>` → `<button>` 또는 `role="button"` + `tabIndex` + `onKeyDown`
  - `RestaurantHome.tsx` — 식당 항목
  - `TabLists.tsx` — 날짜 선택
  - `TodayBroadcastSidebar.tsx` — 중계 항목

#### aria 속성
- [ ] 아이콘 버튼에 `aria-label` 추가
  - `BroadcastView.tsx` — 이전/다음 달, 뷰 전환 버튼
  - `TabLists.tsx` — 날짜 스크롤 좌/우 버튼
  - `Toast.tsx` — 닫기 버튼
  - `SectionHeader.tsx` — 닫기 버튼
- [ ] `RestaurantManager.tsx` — `<FaArrowLeft>` onClick → `<button>`으로 감싸기

#### 키보드 접근성
- [ ] `ModalBase.tsx` — ESC 키 닫기 + focus trap 구현
- [ ] `ImageUpload.tsx` — 업로드 영역에 `tabIndex` + `onKeyDown` 추가

#### 폼 접근성
- [ ] `MenuInputList.tsx` — `<input>`에 `id` + `<label htmlFor>` 연결

---

### P11: 반응형 디자인

#### 메인 레이아웃
- [ ] `Home.tsx` — 3패널(검색 + 지도 + 마이페이지) → 모바일은 스택/오버레이
- [ ] breakpoint 전략 수립 (sm: 640px / md: 768px / lg: 1024px)

#### 사이드바 & 패널
- [ ] `SearchPage.tsx` — `w-[430px]` → 반응형 (모바일: 전체 너비, 데스크톱: 고정)
- [ ] `RestaurantDetail` — `w-[430px]` → 반응형
- [ ] `PlayceMap.tsx` — 상세 패널 `w-[370px]` → 모바일 오버레이

#### 모달
- [ ] `ModalBase.tsx` — 고정 너비 → `w-full max-w-[px]` + 모바일 padding
  - auth: `w-[400px]` → `w-full max-w-[400px] mx-4`
  - mypage: `w-[850px]` → `w-full max-w-[850px] mx-4`

#### 기타
- [ ] `PlayceModal.tsx` — 마커 팝업 `w-[440px]` 모바일 대응
- [ ] `Toast.tsx` — `min-w-[280px]` 모바일 오버플로우 방지
- [ ] `BroadcastRegisterEdit.tsx` — 폼 2열 레이아웃 → 모바일 1열
- [ ] 이미지 고정 크기 → 반응형 조정

---

### P12: 랜딩 페이지
- [ ] 서비스 소개 페이지 제작
- [ ] 주요 기능 안내, CTA(시작하기) 버튼
- [ ] 포트폴리오용 비주얼 강화
- [ ] 반응형 랜딩 (P11 완료 후이므로 처음부터 반응형으로)

---

### P13: 테스트 코드 작성
- [ ] Vitest + Testing Library 환경 구축
- [ ] 유틸 함수 테스트 (formatTime, distance, dateUtils 등)
- [ ] React Query 훅 테스트
- [ ] 주요 컴포넌트 렌더링 테스트
- [ ] Store 테스트

---

### P14: Lighthouse 점수 개선
- [ ] 현재 점수 측정 (Performance / Accessibility / Best Practices / SEO)
- [ ] Performance — 이미지 최적화 (WebP, lazy loading)
- [ ] Accessibility — P10에서 대부분 처리, 잔여 항목 마무리
- [ ] Best Practices — HTTPS, 콘솔 에러 제거 등
- [ ] SEO — 메타태그, Open Graph, 시맨틱 마크업
- [ ] 최종 점수 기록 및 Before/After 비교

---

## 커밋 컨벤션

```
[YYMMDD] P{n} refactor: 한글 설명
[YYMMDD] P{n} fix: 한글 설명
[YYMMDD] P{n} feat: 한글 설명
```

## 포트폴리오 어필 포인트

1. **React Query 도입** — store 직접 API 호출 → 자동 캐싱, 자동 재요청
2. **React Hook Form 도입** — 수동 state 관리 → 선언적 폼 관리
3. **코드 스플리팅 + 성능 최적화** — lazy loading, 번들 청크 분리, 렌더링 최적화
4. **안티패턴 식별 및 개선** — Zustand DOM ref 제거, 비즈니스 로직/UI 분리
5. **접근성 개선** — 시맨틱 HTML, aria 속성, 키보드 네비게이션, focus trap
6. **반응형 디자인** — 모바일 ~ 데스크톱 대응, breakpoint 전략
7. **테스트 코드 작성** — Vitest + Testing Library로 리팩토링 안전망 확보
8. **UX 개선** — 에러/로딩 처리 통합, 중복 제출 방어, 사용자 피드백 강화
