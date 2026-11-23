export const layout = {
  // Strict assignment requirement: minimum 44pt / 48dp touch targets
  touchTargets: {
    minHeight: 48,
    minWidth: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  hitSlop: {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
  },
} as const;

export type LayoutTokens = typeof layout;
