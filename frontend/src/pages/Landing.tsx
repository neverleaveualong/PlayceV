import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiMapPin, FiTv, FiSearch, FiStar, FiCalendar, FiArrowRight, FiMap,
  FiNavigation, FiEye, FiGlobe, FiZap, FiFilter, FiClock, FiHeart,
  FiBookmark, FiChevronRight, FiEdit, FiGrid, FiUsers,
} from "react-icons/fi";
import useScrollReveal from "@/hooks/useScrollReveal";

/* ─── 공통 컴포넌트 ─── */

const RevealSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const { ref: wrapRef, isVisible } = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, target]);

  return (
    <span ref={wrapRef}>
      <span ref={ref} className="tabular-nums">{count}</span>{suffix}
    </span>
  );
};

const BulletItem = ({ icon: Icon, text }: { icon: IconType; text: string }) => (
  <li className="flex items-center gap-3">
    <div className="w-7 h-7 rounded-lg bg-primary4 flex items-center justify-center flex-shrink-0">
      <Icon className="text-primary5 text-xs" />
    </div>
    <span>{text}</span>
  </li>
);

/* ─── Feature 섹션 ─── */

const FeatureSection = ({
  label,
  heading,
  desc,
  bullets,
  imgSrc,
  imgAlt,
  reverse = false,
  phone = false,
  glow = "primary5",
}: {
  label: string;
  heading: string;
  desc: string;
  bullets: { icon: IconType; text: string }[];
  imgSrc: string;
  imgAlt: string;
  reverse?: boolean;
  phone?: boolean;
  glow?: string;
}) => (
  <RevealSection>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
      <div className={reverse ? "order-2 md:order-1" : ""}>
        <span className="text-sm font-semibold text-primary5 bg-primary4 px-3 py-1 rounded-full">
          {label}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-mainText tracking-tight mt-4 leading-tight whitespace-pre-line">
          {heading}
        </h2>
        <p className="mt-4 text-darkgray text-lg leading-relaxed">
          {desc}
        </p>
        <ul className="mt-6 space-y-3.5 text-darkgray">
          {bullets.map(({ icon, text }) => (
            <BulletItem key={text} icon={icon} text={text} />
          ))}
        </ul>
      </div>
      <div className={reverse ? "order-1 md:order-2" : ""}>
        <div className={`relative group ${phone ? "max-w-[320px] mx-auto" : ""}`}>
          {/* 글로우 배경 */}
          <div className={`absolute -inset-4 bg-${glow}/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          <img
            src={imgSrc}
            alt={imgAlt}
            className="relative w-full rounded-2xl shadow-lg border border-gray-200/60 group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-500"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </RevealSection>
);

/* ─── Trust Strip ─── */

const TRUST_ITEMS = [
  { icon: FiTv, text: "5개 종목", value: 5 },
  { icon: FiMapPin, text: "전국 주요 도시", value: 12 },
  { icon: FiZap, text: "실시간 LIVE", value: null },
  { icon: FiHeart, text: "무료 서비스", value: null },
];

/* ─── 메인 ─── */

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary5 tracking-tight">
              Playce
            </span>
          </div>
          <Link
            to="/map"
            className="px-5 py-2 bg-primary5 text-white text-sm font-medium rounded-full hover:brightness-95 transition-all"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary4/40 via-white to-white -z-10" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary1/15 rounded-full blur-[140px] -z-10" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary4/80 backdrop-blur-sm rounded-full text-sm text-primary5 font-medium mb-8 animate-bounce-slow">
            <FiMapPin className="text-sm" />
            스포츠 중계 맛집 찾기
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-mainText leading-[1.15] tracking-tight">
            경기장은 멀어도
            <br />
            <span className="bg-gradient-to-r from-primary5 to-[#4A9030] bg-clip-text text-transparent">
              응원은 가까이
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-darkgray leading-relaxed max-w-xl mx-auto">
            직관은 어렵지만, 근처에서 함께 응원할 수는 있잖아요.
            <br className="hidden md:block" />
            내 주변 중계 식당을 찾고, 무료로 Playce를 시작해보세요.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/map"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary5 text-white font-semibold rounded-2xl text-base hover:brightness-95 hover:scale-[1.02] transition-all shadow-lg shadow-primary5/25"
            >
              <FiMap className="text-lg" />
              무료로 시작하기
            </Link>
          </div>

          {/* Hero 이미지 */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-200/60 group-hover:shadow-3xl group-hover:scale-[1.005] transition-all duration-700">
              <img
                src="/landing/hero.png"
                alt="Playce 메인 화면 — 지도에서 중계 식당 찾기"
                className="w-full"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {TRUST_ITEMS.map(({ icon: Icon, text, value }) => (
            <RevealSection key={text} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-primary4 flex items-center justify-center mx-auto mb-2">
                <Icon className="text-primary5 text-lg" />
              </div>
              <p className="text-2xl font-bold text-mainText">
                {value !== null ? <CountUp target={value} suffix="+" /> : <FiZap className="inline text-primary5" />}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{text}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Feature: 지도 검색 */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FeatureSection
            label="지도 탐색"
            heading={"내 주변 중계 식당을\n지도에서 한눈에"}
            desc="마커를 탭하면 가게 정보와 다음 중계 일정을 바로 확인할 수 있어요. 원하는 경기를 중계하는 곳을 빠르게 찾아보세요."
            bullets={[
              { icon: FiNavigation, text: "위치 기반 주변 가게 자동 탐색" },
              { icon: FiEye, text: "마커 탭으로 가게 미리보기" },
              { icon: FiGlobe, text: "도시 퀵네비로 전국 이동" },
            ]}
            imgSrc="/landing/feature-map.png"
            imgAlt="지도에서 중계 식당 마커와 팝업"
            phone
          />
        </div>
      </section>

      {/* Feature: 오늘의 중계 */}
      <section className="py-20 md:py-28 bg-lightgray">
        <div className="max-w-6xl mx-auto px-6">
          <FeatureSection
            label="오늘의 중계"
            heading={"지금 어디서\n경기 보지?"}
            desc="오늘 열리는 경기와 중계 장소를 종목별로 탐색하세요. LIVE 경기는 상단에 하이라이트되고, 거리순으로 가까운 가게를 추천해드려요."
            bullets={[
              { icon: FiZap, text: "LIVE 배지로 실시간 중계 확인" },
              { icon: FiFilter, text: "전체 · 축구 · 야구 등 종목 필터" },
              { icon: FiMapPin, text: "가게 지역 + 거리 정보 표시" },
            ]}
            imgSrc="/landing/feature-broadcast.png"
            imgAlt="오늘의 중계 LIVE 카드 리스트"
            reverse
            phone
          />
        </div>
      </section>

      {/* Feature: 스마트 검색 */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FeatureSection
            label="스마트 검색"
            heading={"종목, 지역, 날짜로\n딱 맞는 곳"}
            desc="보고 싶은 경기의 종목과 리그, 지역, 날짜를 조합해서 검색하세요. 원하는 조건에 맞는 중계 식당을 정확하게 찾아줍니다."
            bullets={[
              { icon: FiSearch, text: "종목 · 리그 필터 (K리그, KBO, NBA 등)" },
              { icon: FiMapPin, text: "시/도 · 구/군 지역 선택" },
              { icon: FiClock, text: "오늘 · 이번 주말 · 이번 주 프리셋" },
            ]}
            imgSrc="/landing/feature-search.png"
            imgAlt="검색 필터 화면"
            phone
          />
        </div>
      </section>

      {/* Feature: 가게 상세 */}
      <section className="py-20 md:py-28 bg-lightgray">
        <div className="max-w-6xl mx-auto px-6">
          <FeatureSection
            label="식당 상세"
            heading={"중계 일정부터\n메뉴까지 한눈에"}
            desc="식당의 중계 스케줄을 월별 달력으로 확인하고, LIVE 경기는 하이라이트로 바로 찾을 수 있어요. 메뉴, 사진, 영업시간까지 한 곳에서."
            bullets={[
              { icon: FiCalendar, text: "월별 중계 일정 + LIVE 하이라이트" },
              { icon: FiGrid, text: "메뉴 · 사진 · 영업시간 · 위치" },
              { icon: FiChevronRight, text: "즐겨찾기 저장 + 카카오톡 공유" },
            ]}
            imgSrc="/landing/feature-detail.png"
            imgAlt="식당 상세 — 중계 탭"
            reverse
          />
        </div>
      </section>

      {/* Feature: 즐겨찾기 */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <FeatureSection
            label="즐겨찾기"
            heading={"자주 가는 곳은\n따로 저장"}
            desc="마음에 드는 스포츠 펍을 즐겨찾기하면, 다가오는 중계 일정을 가게별로 한눈에 확인할 수 있어요."
            bullets={[
              { icon: FiBookmark, text: "가게별 다가오는 중계 토글" },
              { icon: FiStar, text: "한 번 탭으로 저장 · 해제" },
              { icon: FiChevronRight, text: "즐겨찾기 가게의 상세 바로가기" },
            ]}
            imgSrc="/landing/feature-favorite.png"
            imgAlt="즐겨찾기 — 가게별 중계 토글"
            phone
          />
        </div>
      </section>

      {/* For Owners */}
      <section className="py-20 md:py-28 bg-lightgray">
        <div className="max-w-6xl mx-auto px-6">
          <FeatureSection
            label="사장님이라면"
            heading={"중계 일정을\n직접 등록하세요"}
            desc="내 가게에서 중계하는 경기를 달력으로 관리하세요. 등록된 중계는 주변 스포츠 팬들에게 자동으로 노출됩니다."
            bullets={[
              { icon: FiCalendar, text: "월별 달력으로 중계 일정 관리" },
              { icon: FiEdit, text: "종목 · 리그 · 팀 정보 입력" },
              { icon: FiUsers, text: "식당 정보 등록 · 수정 · 삭제" },
            ]}
            imgSrc="/landing/feature-calendar.png"
            imgAlt="중계 일정 캘린더 관리"
            reverse
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <RevealSection>
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative bg-gradient-to-br from-primary5 to-[#4A9030] rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4" />

              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight relative z-10">
                경기장까지 가긴 어렵지만
                <br />
                같이 응원은 하고 싶다면
              </h2>
              <p className="mt-4 text-white/80 text-lg relative z-10">
                가까운 곳에서 좋아하는 팀을 함께 응원하세요. 무료로 시작할 수 있어요.
              </p>
              <Link
                to="/map"
                className="mt-8 inline-flex items-center gap-2 px-10 py-4 bg-white text-primary5 font-bold rounded-2xl text-lg hover:scale-[1.03] transition-all shadow-lg relative z-10"
              >
                Playce 시작하기
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="w-6 h-6" />
            <span className="text-sm font-semibold text-darkgray">Playce</span>
          </div>
          <p className="text-sm text-subText">
            &copy; 2026 Playce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
