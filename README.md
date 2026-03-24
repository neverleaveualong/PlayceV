<div align="center">

# Playce

**스포츠 중계 맛집 찾기**

[![Live](https://img.shields.io/badge/Live-playce--app.vercel.app-66A648?style=for-the-badge&logo=vercel&logoColor=white)](https://playce-app.vercel.app)

![Playce 랜딩](pic/landing-hero.png)

</div>

## 목차

- [소개](#소개) — 기획 의도, 팀, 기간
- [기술 스택](#기술-스택)
- [주요 화면](#주요-화면)
- [기능](#기능) — 리팩토링 전 담당 기능
- [리팩토링](#리팩토링-p1--p15) — 단독 15단계, 성과 수치
- [아키텍처](#아키텍처) — Full-stack 구조, 상태 관리, DB
- [테스트 & CI](#테스트--ci)
- [실행 방법](#실행-방법)

---

## 소개

> "직관은 비싸고, 혼자 보기엔 아쉽다. 근처 식당에서 같이 응원하자."

카카오맵 위에 스포츠 중계를 하는 식당을 표시하고, 종목·지역·날짜로 검색하고, 즐겨찾기로 관리하는 위치 기반 플랫폼.

| 항목 | 내용 |
|------|------|
| 프로젝트 기간 | **2025.06 ~ 2025.07** (팀 개발) |
| 리팩토링 기간 | **2026.03** (단독) |
| 팀 구성 | 6명 (FE 3 + BE 3) |
| 역할 | **프론트엔드 메인 개발자** — FE 코드 52% 직접 작성 |
| 리팩토링 | 단독 **15단계, 61 PR** |

---

## 기술 스택

**Frontend** &nbsp; `React 19` `TypeScript` `Vite 6` `Zustand 5` `TanStack Query 5` `React Hook Form 7` `Tailwind CSS` `Framer Motion`

**Backend** &nbsp; `Express 5` `TypeORM` `MySQL` `Redis` `AWS S3` `JWT`

**Testing & CI** &nbsp; `Vitest` `Playwright` `GitHub Actions` `npm audit`

**Deploy** &nbsp; `Vercel` (FE) · `Render` (BE)

---

## 주요 화면

| 지도 + 검색 + 오늘의 중계 | 마커 팝업 |
|:---:|:---:|
| ![지도](pic/map-main.png) | ![마커](pic/03-map-marker-popup.png) |

| 오늘의 중계 (모바일) | 즐겨찾기 |
|:---:|:---:|
| ![중계](pic/06-broadcast-today-mobile.png) | ![즐겨찾기](pic/07-favorites-mobile.png) |

| 식당 등록 | 중계 캘린더 |
|:---:|:---:|
| ![식당등록](pic/10-mypage-store-register.png) | ![캘린더](pic/11-mypage-broadcast-calendar.png) |

---

## 기능

### 리팩토링 전 — 팀 개발 시 담당 기능

| 기능 | 설명 |
|------|------|
| **카카오맵 검색** | SDK 연동, Geolocation 현위치, 다중 필터(종목/리그/지역/날짜) 검색, 도시 퀵네비 12개, 마커→팝업→상세 |
| **식당 상세보기** | 탭 구조(홈/메뉴/사진/중계), 날짜별 그룹핑, 시간순 정렬, 즐겨찾기 토글 |
| **오늘의 중계** | LIVE 하이라이트, 종목 탭 필터, 거리순 정렬 |
| **즐겨찾기** | 비로그인 차단 + 유도 UI, 가게별 중계 토글, API 연동 |
| **마이페이지** | 프로필, 식당 등록/수정/삭제, 중계 캘린더 관리 |
| **인증** | JWT 토큰, 로그인/회원가입 모달, 401 인터셉터, 비밀번호 초기화 |

### 리팩토링 후 — 추가된 것

| 추가 항목 | 내용 |
|-----------|------|
| **React Query** | 서버 상태 분리 — 캐싱, 자동 리페칭, 로딩/에러 선언적 처리 |
| **React Hook Form** | 폼 관리 일원화 — 검증, 에러, 상태 선언적 처리 |
| **코드 스플리팅** | lazy() + Suspense — 마이페이지 모달 90% 감소 |
| **렌더링 최적화** | memo 10 + useMemo 17 + useCallback 11 + 셀렉터 34 |
| **번들 분리** | manualChunks 7개 — 메인 번들 42% 감소 |
| **테스트 137개** | Vitest 단위 109 + Playwright E2E 28 |
| **GitHub Actions CI** | PR 자동 테스트 + npm audit 보안 검사 |
| **ErrorBoundary** | 크래시 복구 UI |
| **Skeleton UI** | 로딩 시 스켈레톤 (스피너 → 카드형) |
| **Web Vitals** | LCP/FCP/CLS/FID/TTFB 실시간 측정 |
| **랜딩 리디자인** | B2C 스타일 인터랙티브 랜딩페이지 |
| **반응형** | 모바일 터치 대응 + 레이아웃 |

---

## 리팩토링 (P1 ~ P15)

팀 개발 종료 후, **단독으로 15단계에 걸쳐 코드 품질·성능·테스트·CI를 개선.**

![아키텍처 & 리팩토링](pic/architecture.png)

### 핵심 수치

| 항목 | Before | After | 변화 |
|------|:------:|:-----:|:----:|
| 메인 번들 | 510KB | 295KB | **-42%** |
| MypageModal | 311KB | 31KB | **-90%** |
| TBT (Lighthouse) | 280ms | 180ms | **-36%** |
| 테스트 | 0개 | 137개 | Unit 109 + E2E 28 |
| CI | 없음 | GitHub Actions | 테스트 + 보안 감사 |

### 왜 이 리팩토링을 했는가

| 단계 | 핵심 | 문제 → 해결 |
|:---:|------|------------|
| **P4** | React Query | 서버 데이터가 Zustand에 혼재 → 캐싱/리페칭 수동 관리 → 선언적 분리 |
| **P5** | Hook Form | useState 수동 폼 → 검증·에러 처리 누락 → 선언적 폼 관리 |
| **P6** | 코드 스플리팅 | MypageModal 311KB가 초기 로딩에 포함 → lazy()로 필요할 때만 로드 |
| **P7** | 렌더링 최적화 | Profiler로 병목 확인 → 리스트/비싼 계산/이벤트 핸들러에 memo 선별 적용 |
| **P13** | 테스트 | 테스트 0개 → 로직은 Vitest, 유저 시나리오는 Playwright로 분리 |
| **P14** | CI | 수동 테스트 → PR마다 자동 실행 + npm audit 보안 게이트 |
| **P15** | 에러/로딩 UX | 에러 시 빈 화면 → ErrorBoundary, 스피너 → Skeleton UI |

---

## 아키텍처

### Full-stack 구조

```
Frontend (Vercel)                          Backend (Render)
React 19 + Vite 6                          Express 5 + TypeORM
├── Pages (3)                              ├── Routes (6) — 26 endpoints
├── Components (68)          ← Axios →     ├── Controllers (6)
├── Hooks (15)                  JSON        ├── Services (6)
├── Stores (9) — Zustand                   ├── Entities (10) — MySQL
└── Utils (9)                              ├── Middlewares (6) — JWT + Redis
                                           └── AWS S3 — 이미지 업로드
```

### 상태 관리

```
Zustand (UI 상태)                    React Query (서버 상태)
├── mapStore — 좌표, 줌, 마커        ├── useNearbyRestaurants — 주변 가게
├── searchStore — 검색 조건          ├── useSearchResults — 검색 결과
├── authStore — 로그인, 토큰         ├── useFavorites — 즐겨찾기
├── toastStore — 알림 큐             ├── useStoreDetail — 가게 상세
├── regionStore — 지역 필터          ├── useBroadcasts — 중계 일정
└── sportStore — 종목 필터           └── useMyStores — 내 가게
```

### DB (MySQL + TypeORM, 10 entities)

```
User ──→ Store ──→ StoreImage
  │        │──→ Broadcast ──→ Sport ──→ League
  └──→ Favorite     └──→ BigRegion ──→ SmallRegion
                          └──→ BusinessNumber
```

---

## 테스트 & CI

```
Unit (Vitest · 109개 · ~7초)                E2E (Playwright · 28개 · ~2분)
├── formatTime, dateUtils, openStatus       ├── auth — 로그인, 회원가입
├── sortUtils, regionUtils, sportUtils      ├── favorites — 즐겨찾기
└── mapStore, searchStore, toastStore       ├── broadcast — 오늘의 중계
                                            ├── search — 검색 + 필터 모달
                                            ├── map — 지도, 도시 퀵네비
                                            └── mypage — 식당/중계 관리
```

**CI 파이프라인** — PR 생성 시 3개 job 병렬 실행

```
PR → Unit Tests (Vitest 109, ~20s)
   → E2E Tests (Playwright 28, ~2m)
   → Security Audit (npm audit, high/critical)
```

---

## 실행 방법

```bash
cd frontend && npm install && npm run dev    # http://localhost:5173
npm test                                      # Unit 109개
npm run test:e2e                              # E2E 28개
```

---

> 리팩토링 이전 README: [before_readme.md](./before_readme.md)
