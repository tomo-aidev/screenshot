const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi']);

export function isRTLLocale(locale: string): boolean {
  const lang = locale.split('-')[0];
  return RTL_LOCALES.has(lang);
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
}

export interface MirroredLayout {
  textAlign: 'left' | 'right' | 'center';
  flexDirection: 'row' | 'row-reverse';
  marginLeft?: string;
  marginRight?: string;
  paddingLeft?: string;
  paddingRight?: string;
  left?: string;
  right?: string;
  transformOrigin?: string;
}

export function mirrorLayout(
  layout: Record<string, unknown>,
  locale: string
): Record<string, unknown> {
  if (!isRTLLocale(locale)) return layout;

  const mirrored = { ...layout };

  // Swap left/right
  if ('left' in layout && 'right' in layout) {
    mirrored.left = layout.right;
    mirrored.right = layout.left;
  } else if ('left' in layout) {
    mirrored.right = layout.left;
    delete mirrored.left;
  } else if ('right' in layout) {
    mirrored.left = layout.right;
    delete mirrored.right;
  }

  // Swap margin-left/right
  if ('marginLeft' in layout && 'marginRight' in layout) {
    mirrored.marginLeft = layout.marginRight;
    mirrored.marginRight = layout.marginLeft;
  } else if ('marginLeft' in layout) {
    mirrored.marginRight = layout.marginLeft;
    delete mirrored.marginLeft;
  } else if ('marginRight' in layout) {
    mirrored.marginLeft = layout.marginRight;
    delete mirrored.marginRight;
  }

  // Swap padding
  if ('paddingLeft' in layout && 'paddingRight' in layout) {
    mirrored.paddingLeft = layout.paddingRight;
    mirrored.paddingRight = layout.paddingLeft;
  } else if ('paddingLeft' in layout) {
    mirrored.paddingRight = layout.paddingLeft;
    delete mirrored.paddingLeft;
  } else if ('paddingRight' in layout) {
    mirrored.paddingLeft = layout.paddingRight;
    delete mirrored.paddingRight;
  }

  // Flip text align
  if (layout.textAlign === 'left') {
    mirrored.textAlign = 'right';
  } else if (layout.textAlign === 'right') {
    mirrored.textAlign = 'left';
  }

  // Flip flex direction
  if (layout.flexDirection === 'row') {
    mirrored.flexDirection = 'row-reverse';
  } else if (layout.flexDirection === 'row-reverse') {
    mirrored.flexDirection = 'row';
  }

  return mirrored;
}

export function mirrorX(x: number, containerWidth: number): number {
  return containerWidth - x;
}

export function mirrorPercentX(xPercent: number): number {
  return 100 - xPercent;
}
