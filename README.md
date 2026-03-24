<div align="center">

# Playce

**스포츠 중계 맛집 찾기**

[![Live](https://img.shields.io/badge/Live-playce--app.vercel.app-66A648?style=for-the-badge&logo=vercel&logoColor=white)](https://playce-app.vercel.app)

![Playce 랜딩](pic/landing-hero.png)

</div>

---

## 소개

카카오맵 위에 스포츠 중계를 하는 식당을 표시하고, 종목·지역·날짜로 검색하고, 즐겨찾기로 관리하는 **위치 기반 플랫폼**.

6인 팀(FE 3 + BE 3)에서 **프론트엔드 메인 개발자**로 참여, 이후 **단독 15단계 리팩토링** 수행.

| 코드 기여 | 리팩토링 | 테스트 | CI |
|:---:|:---:|:---:|:---:|
| FE 125파일 중 **97개 (52%)** | **15단계, 61 PR** | **137개** | GitHub Actions |

`React 19` `TypeScript` `Zustand` `TanStack Query` `Tailwind CSS` `Vite` `Vitest` `Playwright`

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

## 담당 기능

- **카카오맵 검색** — SDK 연동, 다중 필터(종목/리그/지역/날짜) 검색, 도시 퀵네비, 마커→팝업→상세보기
- **식당 상세보기** — 탭 구조(홈/메뉴/사진/중계), 날짜별 그룹핑, 즐겨찾기 토글
- **오늘의 중계** — LIVE 하이라이트, 종목 탭 필터, 거리순 정렬
- **즐겨찾기** — 비로그인 차단, 가게별 중계 토글, Zustand + React Query 연동
- **마이페이지** — 식당 등록/수정/삭제(React Hook Form), 중계 캘린더 관리
- **인증** — JWT 토큰, 401 인터셉터, 비밀번호 초기화

---

## 리팩토링 (P1 ~ P15)

팀 개발 종료 후, **단독으로 코드 품질·성능·테스트·CI를 15단계에 걸쳐 개선.**

![리팩토링 아키텍처](pic/refactoring-stats.png)

### 핵심 성과

| 항목 | Before | After | 변화 |
|------|:------:|:-----:|:----:|
| 메인 번들 | 510KB | 295KB | **-42%** |
| MypageModal | 311KB | 31KB | **-90%** |
| TBT | 280ms | 180ms | **-36%** |
| 테스트 | 0개 | 137개 | Unit 109 + E2E 28 |

### 주요 리팩토링

| 단계 | 핵심 | 왜 했는가 |
|:---:|------|----------|
| **P4** | React Query 도입 | 서버 데이터가 Zustand에 혼재 → 캐싱/리페칭 수동 관리 문제 |
| **P5** | React Hook Form | useState 수동 폼 → 검증·에러·상태 선언적 처리 |
| **P6** | 코드 스플리팅 | MypageModal 311KB가 초기 로딩에 포함 → lazy()로 분리 |
| **P7** | 렌더링 + 번들 최적화 | Profiler로 병목 확인 → memo/useMemo 선별 적용, 청크 7개 분리 |
| **P13** | 테스트 137개 | 테스트 0개 → Vitest(로직) + Playwright(유저 시나리오) |
| **P14** | GitHub Actions CI | 수동 테스트 → PR마다 자동 실행 + npm audit 보안 검사 |
| **P15** | ErrorBoundary + Skeleton | 에러 시 빈 화면 → 복구 UI, 로딩 시 스피너 → 스켈레톤 |

---

## 실행

```bash
cd frontend && npm install && npm run dev    # http://localhost:5173
npm test                                      # Unit 109개
npm run test:e2e                              # E2E 28개
```

---

> 리팩토링 이전 README: [before_readme.md](./before_readme.md)
