/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "ink" now holds the light peach surface tones (page bg, panels, borders) —
        // kept the same token names so every existing bg-ink/border-ink-line class
        // just resolves to the new light palette without touching component files.
        // Soft blush-peach, matched to the reference moodboard (rose-petal editorial look).
        ink: {
          DEFAULT: "#fde3cf",
          soft: "#fdd6bb",
          line: "#f0b98e",
        },
        // "ivory" now holds the dark warm-brown text tones (was light text on dark bg,
        // is now dark text on light bg) for the same reason.
        ivory: {
          DEFAULT: "#2b1d12",
          deep: "#1c1109",
        },
        // Coral-terracotta accent (matched to reference's "Perfect Scent" heading color
        // #cd571d) instead of yellow-gold. 200 darkened from the reference tone to
        // ~4.8:1 contrast against the new ink background for small-text legibility.
        gold: {
          50: "#fce4cf",
          100: "#a8451a",
          200: "#a8451a",
          300: "#8a3814",
          400: "#6b2a0f",
          500: "#552107",
          600: "#431a06",
          700: "#331404",
          DEFAULT: "#a8451a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        wrap: "1360px",
      },
      backgroundImage: {
        // Coral shine for small decorative fills (badges, icon circles) — matches
        // the reference moodboard's terracotta-orange rather than yellow-gold.
        "gold-gradient": "linear-gradient(135deg, #c0491c 0%, #f2905a 45%, #d9651f 70%, #8a3010 100%)",
        "ink-gradient": "linear-gradient(180deg, #fef2e6 0%, #fdd6bb 100%)",
        // Horizontal brown-to-coral shine, matched directly to the reference's
        // "SHOP NOW" button (left #882d14 deep brown, right #eb7834 bright orange).
        "accent-gradient": "linear-gradient(90deg, #7a2812 0%, #c04a1c 45%, #d4651f 100%)",
      },
      boxShadow: {
        gold: "0 20px 60px -20px rgba(202,161,75,0.35)",
        soft: "0 24px 60px -24px rgba(0,0,0,0.55)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(48px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        couponPulse: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(.22,1,.36,1) forwards",
        fadeIn: "fadeIn 0.2s ease-out forwards",
        scaleUp: "scaleUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
        shimmer: "shimmer 5s ease-in-out infinite alternate",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        slideInRight: "slideInRight 0.5s cubic-bezier(.22,1,.36,1) forwards",
        slideInLeft: "slideInLeft 0.35s cubic-bezier(.22,1,.36,1) forwards",
        couponPulse: "couponPulse 0.7s cubic-bezier(.22,1,.36,1)",
      },
    },
  },
  plugins: [],
};
