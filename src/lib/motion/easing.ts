// Shared Framer Motion easing + duration tokens.
// `as const` is required — FM 12's Easing type rejects plain number[].

export const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const

export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
} as const

export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.14,
} as const
