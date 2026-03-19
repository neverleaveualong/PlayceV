/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      colors: {
        primary5: "#66A648",
        primary1: "#B0DB9C",
        primary2: "#CAE8BD",
        primary3: "#DDF6D2",
        primary4: "#ECFAE5",
        lightgray: "#F5F5F5",
        middlegray: "#CCCCCC",
        darkgray: "#6A7282",
        mainText: "#3A3A3A",
        subText: "#9CA3AF",
      },
      spacing: {
        // 사이드바/패널 너비
        sidebar: "430px",
        // 모달 너비
        "modal-sm": "320px",
        "modal-auth": "400px",
        "modal-md": "600px",
        "modal-lg": "850px",
        // 모달 높이
        "modal-h": "600px",
      },
      borderRadius: {
        // 카드/입력 기본
        card: "0.75rem",    // 12px = rounded-xl 급
        modal: "0.75rem",
      },
      fontSize: {
        // 커스텀 픽셀 사이즈 통일
        "heading-page": ["1.75rem", { lineHeight: "2.25rem" }],
        "heading-section": ["1.25rem", { lineHeight: "1.75rem" }],
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.25s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
  ],
};
