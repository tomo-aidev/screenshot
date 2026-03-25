export interface DeviceFrame {
  id: string;
  name: string;
  brand: 'apple' | 'google' | 'samsung' | 'generic';
  type: 'phone' | 'tablet' | 'watch' | 'tv';
  screenWidth: number;
  screenHeight: number;
  frameWidth: number;
  frameHeight: number;
  screenOffset: { x: number; y: number };
  cornerRadius: number;
  frameImage?: string;
  colors: { name: string; value: string }[];
}

export const DEVICE_FRAMES: DeviceFrame[] = [
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'apple',
    type: 'phone',
    screenWidth: 1320,
    screenHeight: 2868,
    frameWidth: 1380,
    frameHeight: 2928,
    screenOffset: { x: 30, y: 30 },
    cornerRadius: 120,
    colors: [
      { name: 'Natural Titanium', value: '#8F8A81' },
      { name: 'Black Titanium', value: '#3C3C3C' },
      { name: 'White Titanium', value: '#F2F1ED' },
      { name: 'Desert Titanium', value: '#C4A882' },
    ],
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'apple',
    type: 'phone',
    screenWidth: 1290,
    screenHeight: 2796,
    frameWidth: 1350,
    frameHeight: 2856,
    screenOffset: { x: 30, y: 30 },
    cornerRadius: 110,
    colors: [
      { name: 'Natural Titanium', value: '#8F8A81' },
      { name: 'Blue Titanium', value: '#3D4B5A' },
      { name: 'White Titanium', value: '#F2F1ED' },
      { name: 'Black Titanium', value: '#3C3C3C' },
    ],
  },
  {
    id: 'pixel-9-pro',
    name: 'Pixel 9 Pro',
    brand: 'google',
    type: 'phone',
    screenWidth: 1080,
    screenHeight: 2424,
    frameWidth: 1140,
    frameHeight: 2484,
    screenOffset: { x: 30, y: 30 },
    cornerRadius: 80,
    colors: [
      { name: 'Obsidian', value: '#1B1B1F' },
      { name: 'Porcelain', value: '#F0EDE7' },
      { name: 'Hazel', value: '#B5C1A1' },
      { name: 'Rose Quartz', value: '#E8C4C4' },
    ],
  },
  {
    id: 'ipad-pro-13',
    name: 'iPad Pro 13"',
    brand: 'apple',
    type: 'tablet',
    screenWidth: 2064,
    screenHeight: 2752,
    frameWidth: 2144,
    frameHeight: 2832,
    screenOffset: { x: 40, y: 40 },
    cornerRadius: 60,
    colors: [
      { name: 'Space Black', value: '#2E2C2F' },
      { name: 'Silver', value: '#E3E4DF' },
    ],
  },
];
