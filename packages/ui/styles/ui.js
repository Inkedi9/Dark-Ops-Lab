export const colors = {
  bg: "#05070A",
  surface: "#0b0f17",
  blue: "#22d3ee",
  blueSoft: "#0ea5b7",
  indigo: "#818cf8",
  emerald: "#34d399",
  amber: "#fbbf24",
  danger: "#f87171",
};

export const gradients = {
  page: "bg-[radial-gradient(circle_at_52%_22%,rgba(96,165,250,0.09),transparent_34%),radial-gradient(circle_at_82%_48%,rgba(129,140,248,0.055),transparent_32%),linear-gradient(to_bottom,#05070A,#020409)]",

  panel:
    "bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.055),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.012))]",

  danger:
    "bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.08),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.035),rgba(255,255,255,0.01))]",

  success:
    "bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.07),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.035),rgba(255,255,255,0.01))]",
};

export const radius = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  panel: "rounded-[1.5rem]",
  control: "rounded-xl",
  sharp: "rounded-md",
  terminal: "rounded-none",
  pill: "rounded-full",
};

export const spacing = {
  page: "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
  card: "p-5 md:p-6",
  cardLg: "p-7 md:p-10",
  section: "py-16 md:py-24",
  sectionBottom: "mb-8 md:mb-10",
};

export const typography = {
  /* DISPLAY / BRAND */
  display: "font-[var(--font-display)] font-black tracking-tight text-white",

  heroTitle:
    "font-[var(--font-display)] text-5xl md:text-6xl font-black tracking-tight text-white",

  /* TITLES */
  title:
    "font-[var(--font-display)] text-3xl md:text-4xl font-bold tracking-tight text-white",

  subtitle: "text-xl font-semibold text-white",

  /* BODY */
  bodyLarge: "text-lg leading-8 text-slate-300",

  body: "text-base leading-7 text-slate-300",

  bodySmall: "text-sm text-slate-400",

  /* META / UI */
  meta: "font-mono text-xs font-bold uppercase tracking-[0.32em] text-slate-500",

  /* TERMINAL */
  terminal: "font-mono text-sm text-blue-200",

  heroTitle:
    "font-[var(--font-display)] text-5xl md:text-6xl font-black tracking-tight leading-[0.95] text-white",
};

export const tones = {
  blue: {
    text: "text-blue-100",
    softText: "text-blue-200",
    border: "border-blue-300/14",
    bg: "bg-blue-400/[0.055]",
    ring: "ring-blue-300/[0.08]",
    glow: "shadow-[0_0_24px_rgba(96,165,250,.055)]",
  },
  emerald: {
    text: "text-emerald-100",
    softText: "text-emerald-200",
    border: "border-emerald-300/14",
    bg: "bg-emerald-400/[0.055]",
    ring: "ring-emerald-300/[0.08]",
    glow: "shadow-[0_0_24px_rgba(52,211,153,.045)]",
  },
  amber: {
    text: "text-amber-100",
    softText: "text-amber-200",
    border: "border-amber-300/14",
    bg: "bg-amber-400/[0.055]",
    ring: "ring-amber-300/[0.08]",
    glow: "shadow-[0_0_24px_rgba(251,191,36,.045)]",
  },
  danger: {
    text: "text-red-100",
    softText: "text-red-200",
    border: "border-red-300/14",
    bg: "bg-red-400/[0.055]",
    ring: "ring-red-300/[0.08]",
    glow: "shadow-[0_0_24px_rgba(248,113,113,.045)]",
  },
};
