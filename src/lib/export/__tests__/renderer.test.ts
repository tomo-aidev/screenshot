import { describe, it, expect, beforeEach, vi } from 'vitest';
import { estimateExportSize, executeExport } from '@/lib/export/renderer';
import type { ExportJob } from '@/types/export';

// Mock sharp to avoid needing the native module in tests
vi.mock('sharp', () => ({
  default: () => ({
    resize: () => ({
      png: () => ({ toBuffer: () => Promise.resolve(Buffer.from('fake-png')) }),
      jpeg: () => ({ toBuffer: () => Promise.resolve(Buffer.from('fake-jpeg')) }),
      webp: () => ({ toBuffer: () => Promise.resolve(Buffer.from('fake-webp')) }),
    }),
  }),
}));

function makeJob(overrides: Partial<ExportJob> = {}): ExportJob {
  return {
    projectId: 'test-project',
    screenshots: [1],
    platforms: ['apple'],
    locales: ['en'],
    format: 'png',
    quality: 90,
    namingPattern: '{platform}/{locale}/{number}_{device}.{ext}',
    ...overrides,
  };
}

describe('estimateExportSize', () => {
  it('returns totalFiles count', () => {
    const result = estimateExportSize(makeJob());
    expect(result.totalFiles).toBeGreaterThan(0);
  });

  it('totalFiles = screenshots * sizes * locales', () => {
    // apple has 7 screenshot/graphic sizes (7 screenshot types, 0 graphic)
    // Actually: apple has 7 entries all of type "screenshot", no "graphic"
    const singleResult = estimateExportSize(makeJob());

    // Doubling locales should double totalFiles
    const doubleLocales = estimateExportSize(makeJob({ locales: ['en', 'ja'] }));
    expect(doubleLocales.totalFiles).toBe(singleResult.totalFiles * 2);
  });

  it('single platform, single locale, single screenshot', () => {
    const result = estimateExportSize(makeJob({
      platforms: ['apple'],
      locales: ['en'],
      screenshots: [1],
    }));
    // apple has 7 screenshot-type sizes, all of type 'screenshot'
    expect(result.totalFiles).toBe(7);
  });

  it('multiple platforms increase total', () => {
    const single = estimateExportSize(makeJob({ platforms: ['apple'] }));
    const multi = estimateExportSize(makeJob({ platforms: ['apple', 'google'] }));
    expect(multi.totalFiles).toBeGreaterThan(single.totalFiles);
  });

  it('multiple locales increase total', () => {
    const single = estimateExportSize(makeJob({ locales: ['en'] }));
    const multi = estimateExportSize(makeJob({ locales: ['en', 'ja'] }));
    expect(multi.totalFiles).toBeGreaterThan(single.totalFiles);
  });

  it('estimatedSizeMB is > 0', () => {
    const result = estimateExportSize(makeJob());
    expect(result.estimatedSizeMB).toBeGreaterThan(0);
  });

  it('png format has higher estimated size than jpeg', () => {
    const pngResult = estimateExportSize(makeJob({ format: 'png' }));
    const jpegResult = estimateExportSize(makeJob({ format: 'jpeg' }));
    expect(pngResult.estimatedSizeMB).toBeGreaterThan(jpegResult.estimatedSizeMB);
  });
});

describe('executeExport', () => {
  it('is an async generator', () => {
    const gen = executeExport(makeJob());
    expect(typeof gen[Symbol.asyncIterator]).toBe('function');
  });

  it('first yield has phase "preparing"', async () => {
    const gen = executeExport(makeJob());
    const first = await gen.next();
    expect(first.value?.phase).toBe('preparing');
  });

  it('last yield has phase "done"', async () => {
    const gen = executeExport(makeJob());
    let last;
    for await (const progress of gen) {
      last = progress;
    }
    expect(last?.phase).toBe('done');
  });

  it('progress percentage reaches 100', async () => {
    const gen = executeExport(makeJob());
    let last;
    for await (const progress of gen) {
      last = progress;
    }
    expect(last?.percentage).toBe(100);
  });
});
