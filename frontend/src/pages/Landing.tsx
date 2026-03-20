import { Link } from "react-router-dom";
import { FiMapPin, FiSearch, FiStar, FiShare2, FiCalendar, FiArrowRight, FiMap } from "react-icons/fi";
import useScrollReveal from "@/hooks/useScrollReveal";

const FEATURES = [
  {
    icon: FiSearch,
    title: "스마트 검색",
    desc: "종목, 리그, 지역, 날짜를 조합해 원하는 중계 장소를 빠르게 찾아보세요.",
  },
  {
    icon: FiCalendar,
    title: "중계 일정 확인",
    desc: "어떤 경기를 언제 중계하는지 한눈에. LIVE 표시로 지금 보는 경기도 바로 확인.",
  },
  {
    icon: FiStar,
    title: "즐겨찾기",
    desc: "자주 가는 스포츠 펍을 저장하고, 다가오는 중계 일정까지 놓치지 마세요.",
  },
  {
    icon: FiShare2,
    title: "카카오톡 공유",
    desc: "마음에 드는 가게를 친구에게 바로 공유. 링크 하나로 상세 페이지까지.",
  },
];

const STEPS = [
  {
    src: "/landing/hero-main.png",
    video: "/landing/hero-video.webm",
    label: "01",
    title: "지도에서 탐색",
    desc: "내 위치 주변 중계 식당을 지도에서 한눈에 확인",
  },
  {
    src: "/landing/detail-from-search.png",
    label: "02",
    title: "중계 일정 확인",
    desc: "LIVE 경기부터 예정된 중계까지, 식당별로 상세 조회",
  },
  {
    src: "/landing/mobile-main.png",
    label: "03",
    title: "오늘의 중계",
    desc: "오늘 열리는 경기와 중계 장소를 종목별로 탐색",
    mobile: true,
  },
];

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
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary4/60 via-white to-primary3/30 -z-10" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary1/20 rounded-full blur-[120px] -z-10" />

        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary4 rounded-full text-sm text-primary5 font-medium mb-6">
              <FiMapPin className="text-sm" />
              스포츠 중계 맛집 찾기
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-mainText leading-tight tracking-tight">
              경기장은 멀어도
              <br />
              <span className="text-primary5">응원은 가까이</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-darkgray leading-relaxed max-w-lg">
              직관은 어렵지만, 근처에서 함께 응원할 수는 있잖아요.
              <br className="hidden md:block" />
              내 주변 중계 식당을 찾고, 무료로 Playce를 시작해보세요.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary5 text-white font-semibold rounded-2xl text-base hover:brightness-95 hover:scale-[1.02] transition-all shadow-lg shadow-primary5/25"
              >
                <FiMap className="text-lg" />
                무료로 시작하기
              </Link>
            </div>
          </div>

          {/* Hero 영상 */}
          <div className="mt-16 md:mt-20">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-200/60">
              <video
                src="/landing/search-video.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
                poster="/landing/search-results.png"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-32 bg-lightgray">
        <div className="max-w-6xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-mainText tracking-tight">
                이런 기능이 있어요
              </h2>
              <p className="mt-4 text-darkgray text-lg">
                스포츠 중계 장소를 찾는 가장 쉬운 방법
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, i) => (
              <RevealSection key={feat.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                  <div className="w-12 h-12 bg-primary4 rounded-xl flex items-center justify-center mb-5">
                    <feat.icon className="text-primary5 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-mainText mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-darkgray leading-relaxed">{feat.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-mainText tracking-tight">
                이렇게 사용해요
              </h2>
              <p className="mt-4 text-darkgray text-lg">
                원하는 경기를 중계하는 곳, 3단계면 찾을 수 있어요
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item, i) => (
              <RevealSection key={item.label} delay={i * 150}>
                <div className="group">
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-5 bg-lightgray ${
                      item.mobile ? "max-w-[280px] mx-auto" : ""
                    }`}
                  >
                    {item.video ? (
                      <video
                        src={item.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full"
                        poster={item.src}
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm font-bold text-primary5 bg-primary4 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {item.label}
                    </span>
                    <div>
                      <h3 className="font-bold text-mainText">{item.title}</h3>
                      <p className="text-sm text-darkgray mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Broadcast detail showcase */}
      <section className="py-20 md:py-28 bg-lightgray">
        <div className="max-w-6xl mx-auto px-6">
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-semibold text-primary5 bg-primary4 px-3 py-1 rounded-full">
                  중계 일정
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-mainText tracking-tight mt-4">
                  오늘 어디서
                  <br />
                  경기 볼까?
                </h2>
                <p className="mt-4 text-darkgray text-lg leading-relaxed">
                  식당마다 어떤 경기를 중계하는지 날짜별로 확인하세요.
                  지금 중계 중인 경기는 LIVE로 표시되고,
                  다가오는 일정도 한눈에 볼 수 있어요.
                </p>
                <ul className="mt-6 space-y-3 text-darkgray">
                  {[
                    "축구 · 야구 · 농구 · e스포츠 등 다양한 종목",
                    "LIVE 표시로 실시간 중계 확인",
                    "월별 · 날짜별 일정 정리",
                    "즐겨찾기 식당의 새 중계 알림",
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary5 rounded-full flex-shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/landing/detail-from-search.png"
                  alt="식당 중계 일정 상세"
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* For owners */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src="/landing/broadcast-tab.png"
                  alt="중계 일정 관리 화면"
                  className="w-full"
                  loading="lazy"
                />
              </div>
              <div className="order-1 md:order-2">
                <span className="text-sm font-semibold text-primary5 bg-primary4 px-3 py-1 rounded-full">
                  사장님이라면
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-mainText tracking-tight mt-4">
                  중계 일정을
                  <br />
                  직접 등록하세요
                </h2>
                <p className="mt-4 text-darkgray text-lg leading-relaxed">
                  내 가게에서 중계하는 경기를 등록하면,
                  주변의 스포츠 팬들이 자연스럽게 찾아옵니다.
                </p>
                <ul className="mt-6 space-y-3 text-darkgray">
                  {[
                    "식당 정보 등록 · 수정 · 삭제",
                    "중계 일정 달력으로 관리",
                    "종목 · 리그 · 팀 정보 입력",
                    "이미지 최대 5장 업로드",
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary5 rounded-full flex-shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <RevealSection>
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative bg-gradient-to-br from-primary5 to-[#4A9030] rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />

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
            &copy; 2025 Playce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
