/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────────────────────
// ABIRIKKY — Brand Token Reference
// ─────────────────────────────────────────────────────────────────────────────
//
//  LOGO COLORS (extracted from logoFull.png)
//  ┌─────────────────────────────────────────────────────────────────────────┐
//  │  Logo gold (wordmark & cloche) → ~#F5C518  ≈  gold-300 / gold-400      │
//  │  Brand gold (CTA, UI primary)  →  #C8951C  =  gold-500  ★              │
//  │  Leaf green (icon flourishes)  →  #3DB53A  =  green-500 ★              │
//  │  Parchment / tagline tint      →  #EDD9A3  =  cream-500 ★              │
//  │  Dark background (navbar/hero) →  #1C1C1A  =  charcoal-700 ★          │
//  └─────────────────────────────────────────────────────────────────────────┘
//
//  NOTE: The logo wordmark renders as a bright yellow-gold (~#F5C518) which
//  sits between gold-300 (#EDD9A3) and gold-400 (#D4B053) in the scale.
//  Use gold-300/400 for the logo lockup on dark backgrounds.
//  Use gold-500 (#C8951C) for all interactive UI elements (buttons, links).
//
//  RECOMMENDED PAIRINGS
//  ┌──────────────────────┬──────────────────────────┬─────────────────────┐
//  │ Context              │ Background               │ Text / Icon         │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Navbar / Hero dark   │ charcoal-700 (#1C1C1A)   │ gold-300 (#EDD9A3)  │
//  │                      │                          │ gold-400 (#D4B053)  │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Primary CTA button   │ gold-500 (#C8951C)        │ white (#FFFFFF)     │
//  │ Hover state          │ gold-600 (#A87714)        │ white               │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Light section bg     │ surface.warm (#FFF8F0)   │ charcoal-700        │
//  │ Page default bg      │ surface.page (#FFFFFF)   │ charcoal-700        │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Food card overlay    │ bg-card-overlay gradient │ white               │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Nav links (dark bg)  │ —                        │ cream-500 (#EDD9A3) │
//  │ Body copy            │ —                        │ charcoal-700        │
//  │ Muted / captions     │ —                        │ charcoal-500        │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Badge "Fresh"        │ green-100 (#DCFADC)      │ green-700 (#207A1E) │
//  │ Badge "Sale"         │ state.saleBg (#FFF0DC)   │ state.saleText      │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Warm accent tint     │ cream-500 (#EDD9A3)      │ gold-800 (#5C3A06)  │
//  │ Parchment section    │ bg-parchment gradient    │ charcoal-700        │
//  ├──────────────────────┼──────────────────────────┼─────────────────────┤
//  │ Success / In-Stock   │ green-500 (#3DB53A)      │ white               │
//  │ Warning / Price tag  │ gold-500 (#C8951C)       │ white               │
//  └──────────────────────┴──────────────────────────┴─────────────────────┘
//
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./views/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {

      // ── Colors ──────────────────────────────────────────────────────────────
      colors: {

        // PRIMARY — logo wordmark, cloche icon, CTA buttons
        // • Logo lockup on dark:   gold-300 (#EDD9A3) or gold-400 (#D4B053)
        // • UI primary / CTA:      gold-500 (#C8951C)  ← the brand anchor
        // • Hover / pressed:       gold-600 (#A87714)
        // • Text on gold-500 bg:   white
        gold: {
          50: "#FDFBF2",
          100: "#FAF3D6",
          200: "#F5E4A3",
          300: "#EDD9A3", // logo highlight / tagline on dark bg
          400: "#D4B053", // logo base gold / icon fills on dark bg
          500: "#C8951C", // ★ brand primary — buttons, links, borders
          600: "#A87714", // hover / pressed state
          700: "#84590C",
          800: "#5C3A06",
          900: "#331F02",
        },

        // SECONDARY — leaf/swirl flourishes in logo icon
        // • Leaf icons:            green-500 (#3DB53A)  ← exact logo match
        // • "Fresh" / "Organic" badges: green-100 bg + green-700 text
        // • Success states:        green-500
        green: {
          50: "#F2FCF2",
          100: "#DCFADC", // badge background
          200: "#AAEAAA",
          300: "#72D672",
          400: "#4EC44E",
          500: "#3DB53A", // ★ brand secondary — exact logo leaf color
          600: "#2E9A2B",
          700: "#207A1E", // badge text on green-100 bg
          800: "#155A13",
          900: "#0A350A",
        },

        // WARM PARCHMENT — tagline, section tints, nav links on dark bg
        // • Nav links on dark:     cream-500 (#EDD9A3)
        // • Section tint bg:       cream-500 → text: gold-800
        // • Do NOT use as page bg — use surface.warm instead
        cream: {
          50: "#FFFDFB",
          100: "#FFF8F0",
          200: "#FFF0DC",
          300: "#F9E4BC",
          400: "#F0CF90",
          500: "#EDD9A3", // ★ brand cream — nav links, warm accents
          600: "#D4B86A",
          700: "#B09040",
          800: "#806520", // text on cream-500 bg
          900: "#4A360A",
        },

        // CHARCOAL — text, icons, dark hero backgrounds
        // • Navbar / hero dark bg: charcoal-700 (#1C1C1A)  ← exact logo bg
        // • All headings:          charcoal-700
        // • Body copy:             charcoal-700
        // • Muted / captions:      charcoal-500
        // • ⚠ Never use as a surface/card background
        charcoal: {
          50: "#F5F5F4",
          100: "#E7E6E3",
          200: "#CBC9C3",
          300: "#A8A49C",
          400: "#7A756C",
          500: "#4A453E", // muted text / captions
          600: "#2E2A23",
          700: "#1C1C1A", // ★ headings, icons, dark hero bg (exact logo bg)
          800: "#141412",
          900: "#0A0A08",
        },

        // SURFACES — white-first backgrounds; never charcoal for bg
        // • Page default:          surface.page   (#FFFFFF)
        // • Light section:         surface.warm   (#FFF8F0)
        // • Card default:          surface.card   (#FFFFFF)
        // • Input fields:          surface.input  (#FDFCFB)
        surface: {
          page: "#FFFFFF",  // default page background
          body: "#FDFCFB",
          warm: "#FFF8F0",  // light section background
          muted: "#F7F3EE",
          soft: "#F2EDE7",
          card: "#FFFFFF",  // card default
          cardWarm: "#FFFBF6",
          cardTint: "#FFF3E0",
          input: "#FDFCFB",  // form inputs
          border: "#EDE8E1",
          borderSoft: "#F2EDE7",
          borderGold: "#EDD9A3",  // gold-tinted dividers
          overlay: "rgba(255, 248, 240, 0.92)",
          scrim: "rgba(28, 28, 26, 0.45)",
        },

        // SEMANTIC STATES
        state: {
          success: "#3DB53A", // = green-500
          warning: "#C8951C", // = gold-500
          error: "#D94F3B",
          info: "#3B7ED9",
          starRating: "#F5A623",
          badge: "#3DB53A",
          badgeBg: "#DCFADC", // = green-100
          saleBg: "#FFF0DC",
          saleText: "#C8951C", // = gold-500
        },
      },

      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        hero: ["var(--font-hero)", "var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Nunito", "Helvetica Neue", "sans-serif"],
        accent: ["Dancing Script", "Pacifico", "cursive"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.625rem" }],
        "md": ["1.0625rem", { lineHeight: "1.625rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "4.25rem" }],
        "7xl": ["4.5rem", { lineHeight: "5rem" }],
        "8xl": ["6rem", { lineHeight: "6.5rem" }],
      },

      fontWeight: {
        thin: "100",
        light: "300",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },

      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.025em",
        tight: "-0.01em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.075em",
        widest: "0.2em",
        ultra: "0.35em",
      },

      // ── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
        "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem",
        "3.5": "0.875rem", "4": "1rem", "5": "1.25rem",
        "6": "1.5rem", "7": "1.75rem", "8": "2rem",
        "9": "2.25rem", "10": "2.5rem", "11": "2.75rem",
        "12": "3rem", "14": "3.5rem", "16": "4rem",
        "18": "4.5rem", "20": "5rem", "24": "6rem",
        "28": "7rem", "32": "8rem", "36": "9rem",
        "40": "10rem", "44": "11rem", "48": "12rem",
        "52": "13rem", "56": "14rem", "60": "15rem",
        "64": "16rem", "72": "18rem", "80": "20rem",
        "96": "24rem",
        // Semantic brand spacing
        "section-sm": "3rem",
        "section-md": "5rem",
        "section-lg": "7.5rem",
        "section-xl": "10rem",
        "container-x": "1.5rem",
        "card-pad": "1.5rem",
        "card-gap": "1.25rem",
        "nav-h": "4.5rem",
        "btn-h-sm": "2.25rem",
        "btn-h-md": "2.75rem",
        "btn-h-lg": "3.5rem",
      },

      borderRadius: {
        "none": "0", "xs": "0.125rem", "sm": "0.25rem",
        "DEFAULT": "0.375rem", "md": "0.5rem", "lg": "0.75rem",
        "xl": "1rem", "2xl": "1.25rem", "3xl": "1.5rem",
        "4xl": "2rem", "full": "9999px",
      },

      // ── Shadows — warm-tinted ────────────────────────────────────────────────
      boxShadow: {
        "xs": "0 1px 2px 0 rgba(28,28,26,0.05)",
        "sm": "0 1px 3px 0 rgba(28,28,26,0.08), 0 1px 2px -1px rgba(28,28,26,0.06)",
        "DEFAULT": "0 4px 6px -1px rgba(28,28,26,0.08), 0 2px 4px -2px rgba(28,28,26,0.05)",
        "md": "0 6px 16px -2px rgba(28,28,26,0.10), 0 2px 6px -2px rgba(28,28,26,0.06)",
        "lg": "0 10px 24px -3px rgba(28,28,26,0.12), 0 4px 10px -4px rgba(28,28,26,0.08)",
        "xl": "0 20px 40px -5px rgba(28,28,26,0.15), 0 8px 16px -6px rgba(28,28,26,0.08)",
        "2xl": "0 30px 60px -8px rgba(28,28,26,0.20)",
        // Gold glow — CTA buttons, featured cards
        "gold-sm": "0 4px 14px 0 rgba(200,149,28,0.25)",
        "gold-md": "0 8px 24px 0 rgba(200,149,28,0.35)",
        "gold-lg": "0 12px 40px 0 rgba(200,149,28,0.45)",
        // Green glow — badges, success states
        "green-sm": "0 4px 14px 0 rgba(61,181,58,0.20)",
        "green-md": "0 8px 24px 0 rgba(61,181,58,0.30)",
        "card": "0 2px 12px 0 rgba(28,28,26,0.07), 0 1px 3px 0 rgba(28,28,26,0.05)",
        "card-hover": "0 8px 28px 0 rgba(28,28,26,0.13), 0 2px 6px 0 rgba(28,28,26,0.07)",
        "inner": "inset 0 2px 4px 0 rgba(28,28,26,0.05)",
        "none": "none",
      },

      // ── Gradients ────────────────────────────────────────────────────────────
      backgroundImage: {
        // Section backgrounds
        "hero-warm": "linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 60%, #FFF3E0 100%)",
        "section-warm": "linear-gradient(180deg, #FFFFFF 0%, #FFF8F0 100%)",
        "section-reverse": "linear-gradient(180deg, #FFF8F0 0%, #FFFFFF 100%)",
        // CTA / button backgrounds — use on gold-500 buttons for depth
        "cta-gold": "linear-gradient(135deg, #D4B053 0%, #C8951C 50%, #A87714 100%)",
        "cta-gold-soft": "linear-gradient(135deg, #EDD9A3 0%, #C8951C 100%)",
        // Accent / tag backgrounds
        "accent-green": "linear-gradient(135deg, #4EC44E 0%, #3DB53A 100%)",
        // Food card image overlay — use on menu item cards
        "card-overlay": "linear-gradient(to top, rgba(28,26,26,0.72) 0%, rgba(28,26,26,0.18) 60%, transparent 100%)",
        // Section tints
        "parchment": "linear-gradient(45deg, #FFF8F0 25%, #FFFDFB 50%, #FFF3DC 75%, #FFFDFB 100%)",
        "brand-radial": "radial-gradient(ellipse at center, #EDD9A3 0%, #C8951C 60%, #84590C 100%)",
        "none": "none",
      },

      screens: {
        "xs": "375px", "sm": "640px", "md": "768px",
        "lg": "1024px", "xl": "1280px", "2xl": "1440px", "3xl": "1920px",
      },

      maxWidth: {
        "xs": "20rem", "sm": "24rem", "md": "28rem",
        "lg": "32rem", "xl": "36rem", "2xl": "42rem",
        "3xl": "48rem", "4xl": "56rem", "5xl": "64rem",
        "6xl": "72rem", "7xl": "80rem",
        "container": "85rem",
        "content": "65rem",
        "card": "22rem",
        "full": "100%",
        "screen": "100vw",
        "none": "none",
      },

      zIndex: {
        "behind": "-1", "base": "0", "raised": "10",
        "dropdown": "20", "sticky": "30", "overlay": "40",
        "modal": "50", "toast": "60", "tooltip": "70",
        "top": "9999",
      },

      transitionDuration: {
        "75": "75ms", "100": "100ms", "150": "150ms",
        "200": "200ms", "300": "300ms", "400": "400ms",
        "500": "500ms", "700": "700ms", "1000": "1000ms",
      },

      transitionTimingFunction: {
        "brand": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-in": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "ease-out-exp": "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeScaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        cartBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.15)" },
          "70%": { transform: "scale(0.95)" },
        },
      },

      animation: {
        "shimmer": "shimmer 2.5s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "fade-scale-in": "fadeScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "cart-bounce": "cartBounce 0.5s ease forwards",
      },

      aspectRatio: {
        "auto": "auto",
        "square": "1 / 1",
        "video": "16 / 9",
        "food-card": "4 / 3",
        "hero-img": "3 / 2",
        "banner": "21 / 9",
        "portrait": "3 / 4",
      },

      borderWidth: {
        "0": "0", "1": "1px", "2": "2px",
        "3": "3px", "4": "4px", "6": "6px", "8": "8px",
      },

      opacity: {
        "0": "0", "5": "0.05", "10": "0.10", "15": "0.15",
        "20": "0.20", "25": "0.25", "30": "0.30", "40": "0.40",
        "50": "0.50", "60": "0.60", "70": "0.70", "75": "0.75",
        "80": "0.80", "85": "0.85", "90": "0.90", "95": "0.95",
        "100": "1",
      },

      gridTemplateColumns: {
        "menu-sm": "repeat(auto-fill, minmax(200px, 1fr))",
        "menu-md": "repeat(auto-fill, minmax(250px, 1fr))",
        "menu-lg": "repeat(auto-fill, minmax(280px, 1fr))",
        "chefs": "repeat(4, 1fr)",
        "cats": "repeat(auto-fill, minmax(100px, auto))",
        "feature": "1fr 1fr",
        "feature-wide": "1.2fr 0.8fr",
      },

    },
  },

  plugins: [],
};
