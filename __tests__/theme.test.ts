import { theme, lightTheme, darkTheme, colors, spacing, layout, typography } from '../src/theme';

describe('Centralized Theme & Design Tokens', () => {
  it('should strictly enforce minimum touch target of at least 44pt / 48dp', () => {
    expect(layout.touchTargets.minHeight).toBeGreaterThanOrEqual(44);
    expect(layout.touchTargets.minWidth).toBeGreaterThanOrEqual(44);
    // Explicit standard is 48
    expect(layout.touchTargets.minHeight).toBe(48);
    expect(layout.touchTargets.minWidth).toBe(48);
  });

  it('should provide complete light and dark color schemes', () => {
    const requiredColorKeys: Array<keyof typeof colors.light> = [
      'primary',
      'secondary',
      'background',
      'surface',
      'textPrimary',
      'textSecondary',
      'border',
      'error',
      'success',
      'warning',
    ];

    requiredColorKeys.forEach(key => {
      expect(lightTheme.colors[key]).toBeDefined();
      expect(darkTheme.colors[key]).toBeDefined();
    });
  });

  it('should define structured spacing tokens', () => {
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(16);
    expect(spacing.lg).toBe(24);
    expect(spacing.xl).toBe(32);
    expect(spacing.xxl).toBe(48);
  });

  it('should define structured typography tokens', () => {
    expect(typography.fontSizes.md).toBe(16);
    expect(typography.fontSizes.xxxl).toBe(32);
    expect(typography.fontWeights.bold).toBe('700');
    expect(typography.lineHeights.md).toBeGreaterThanOrEqual(typography.fontSizes.md);
  });

  it('should expose default theme instance', () => {
    expect(theme).toBeDefined();
    expect(theme.colors).toEqual(colors.light);
  });
});
