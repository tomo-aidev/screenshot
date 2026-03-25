import { describe, it, expect, beforeEach } from 'vitest';
import {
  isRTLLocale,
  getDirection,
  mirrorLayout,
  mirrorX,
  mirrorPercentX,
} from '../rtl';

describe('isRTLLocale', () => {
  it('ar returns true', () => {
    expect(isRTLLocale('ar')).toBe(true);
  });

  it('he returns true', () => {
    expect(isRTLLocale('he')).toBe(true);
  });

  it('fa returns true', () => {
    expect(isRTLLocale('fa')).toBe(true);
  });

  it('ur returns true', () => {
    expect(isRTLLocale('ur')).toBe(true);
  });

  it('en returns false', () => {
    expect(isRTLLocale('en')).toBe(false);
  });

  it('ja returns false', () => {
    expect(isRTLLocale('ja')).toBe(false);
  });

  it('ar-SA (with region code) returns true', () => {
    expect(isRTLLocale('ar-SA')).toBe(true);
  });
});

describe('getDirection', () => {
  it('RTL locale returns rtl', () => {
    expect(getDirection('ar')).toBe('rtl');
  });

  it('LTR locale returns ltr', () => {
    expect(getDirection('en')).toBe('ltr');
  });
});

describe('mirrorLayout', () => {
  it('LTR locale returns layout unchanged', () => {
    const layout = { left: '10px', textAlign: 'left' };
    const result = mirrorLayout(layout, 'en');
    expect(result).toEqual(layout);
  });

  it('RTL locale swaps left/right', () => {
    const layout = { left: '10px', right: '20px' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.left).toBe('20px');
    expect(result.right).toBe('10px');
  });

  it('RTL swaps marginLeft/marginRight', () => {
    const layout = { marginLeft: '5px', marginRight: '15px' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.marginLeft).toBe('15px');
    expect(result.marginRight).toBe('5px');
  });

  it('RTL swaps paddingLeft/paddingRight', () => {
    const layout = { paddingLeft: '8px', paddingRight: '16px' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.paddingLeft).toBe('16px');
    expect(result.paddingRight).toBe('8px');
  });

  it('RTL swaps textAlign left to right', () => {
    const layout = { textAlign: 'left' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.textAlign).toBe('right');
  });

  it('RTL swaps textAlign right to left', () => {
    const layout = { textAlign: 'right' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.textAlign).toBe('left');
  });

  it('textAlign center stays center', () => {
    const layout = { textAlign: 'center' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.textAlign).toBe('center');
  });

  it('RTL swaps flexDirection row to row-reverse', () => {
    const layout = { flexDirection: 'row' };
    const result = mirrorLayout(layout, 'ar');
    expect(result.flexDirection).toBe('row-reverse');
  });

  it('empty layout returns empty layout for RTL', () => {
    const layout = {};
    const result = mirrorLayout(layout, 'ar');
    expect(result).toEqual({});
  });
});

describe('mirrorX', () => {
  it('mirrorX(100, 1000) returns 900', () => {
    expect(mirrorX(100, 1000)).toBe(900);
  });

  it('mirrorX(0, 500) returns 500', () => {
    expect(mirrorX(0, 500)).toBe(500);
  });

  it('mirrorX(500, 500) returns 0', () => {
    expect(mirrorX(500, 500)).toBe(0);
  });
});

describe('mirrorPercentX', () => {
  it('mirrorPercentX(25) returns 75', () => {
    expect(mirrorPercentX(25)).toBe(75);
  });

  it('mirrorPercentX(0) returns 100', () => {
    expect(mirrorPercentX(0)).toBe(100);
  });

  it('mirrorPercentX(100) returns 0', () => {
    expect(mirrorPercentX(100)).toBe(0);
  });

  it('mirrorPercentX(50) returns 50', () => {
    expect(mirrorPercentX(50)).toBe(50);
  });
});
