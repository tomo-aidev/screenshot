import type { ExportJob, ExportProgress, ExportResult, ExportFile, ExportError, Platform } from '@/types/export';
import { getOutputSizes } from './sizes';

interface RenderContext {
  templateHtml: string;
  locale: string;
  texts: Record<string, string>;
  fontFamily: string;
  fontSize: Record<string, number>;
  width: number;
  height: number;
}

interface BrowserPool {
  maxInstances: number;
  activeCount: number;
}

const browserPool: BrowserPool = {
  maxInstances: 5,
  activeCount: 0,
};

async function acquireBrowserTab(): Promise<void> {
  while (browserPool.activeCount >= browserPool.maxInstances) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browserPool.activeCount++;
}

function releaseBrowserTab(): void {
  browserPool.activeCount = Math.max(0, browserPool.activeCount - 1);
}

function generateFileName(
  pattern: string,
  params: {
    platform: string;
    locale: string;
    number: number;
    device: string;
    ext: string;
  }
): string {
  return pattern
    .replace('{platform}', params.platform)
    .replace('{locale}', params.locale)
    .replace('{number}', String(params.number).padStart(2, '0'))
    .replace('{device}', params.device.toLowerCase().replace(/[\s"]+/g, '_').replace(/[.]/g, ''))
    .replace('{ext}', params.ext);
}

async function renderSingleImage(
  context: RenderContext,
  format: 'png' | 'jpeg' | 'webp',
  quality: number
): Promise<Buffer> {
  // Server-side rendering with Puppeteer
  // In production, this launches a headless browser and captures the page
  // For now, we use Sharp as a fallback for basic image generation
  const sharp = await import('sharp');

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${context.width}" height="${context.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          width: ${context.width}px;
          height: ${context.height}px;
          font-family: ${context.fontFamily};
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111125;
          color: #e2e0fc;
        ">
          ${context.templateHtml}
        </div>
      </foreignObject>
    </svg>
  `;

  let pipeline = sharp.default(Buffer.from(svgContent)).resize(context.width, context.height);

  switch (format) {
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
  }

  return pipeline.toBuffer();
}

export async function* executeExport(
  job: ExportJob
): AsyncGenerator<ExportProgress> {
  const outputSizes = getOutputSizes(job.platforms);
  const screenshotSizes = outputSizes.filter((s) => s.type === 'screenshot' || s.type === 'graphic');

  const totalFiles = job.screenshots.length * screenshotSizes.length * job.locales.length;
  let completedFiles = 0;

  const files: ExportFile[] = [];
  const errors: ExportError[] = [];

  yield {
    totalFiles,
    completedFiles: 0,
    currentFile: '',
    percentage: 0,
    phase: 'preparing',
  };

  for (const screenshotNum of job.screenshots) {
    for (const size of screenshotSizes) {
      for (const locale of job.locales) {
        const fileName = generateFileName(
          job.namingPattern || '{platform}/{locale}/{number}_{device}.{ext}',
          {
            platform: size.platform,
            locale,
            number: screenshotNum,
            device: size.name,
            ext: job.format,
          }
        );

        yield {
          totalFiles,
          completedFiles,
          currentFile: fileName,
          percentage: Math.round((completedFiles / totalFiles) * 100),
          phase: 'rendering',
        };

        try {
          await acquireBrowserTab();

          const context: RenderContext = {
            templateHtml: '<div>Template placeholder</div>',
            locale,
            texts: {},
            fontFamily: 'Inter',
            fontSize: {},
            width: size.width,
            height: size.height,
          };

          const buffer = await renderSingleImage(context, job.format, job.quality);

          releaseBrowserTab();

          files.push({
            path: fileName,
            platform: size.platform,
            locale,
            screenshotNumber: screenshotNum,
            deviceSize: size.name,
            width: size.width,
            height: size.height,
            fileSize: buffer.length,
          });
        } catch (err) {
          releaseBrowserTab();
          errors.push({
            file: fileName,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }

        completedFiles++;
      }
    }
  }

  yield {
    totalFiles,
    completedFiles: totalFiles,
    currentFile: '',
    percentage: 100,
    phase: 'done',
  };
}

export function estimateExportSize(job: ExportJob): {
  totalFiles: number;
  estimatedSizeMB: number;
} {
  const outputSizes = getOutputSizes(job.platforms);
  const relevantSizes = outputSizes.filter((s) => s.type === 'screenshot' || s.type === 'graphic');
  const totalFiles = job.screenshots.length * relevantSizes.length * job.locales.length;

  // Rough estimate: average 500KB per image
  const avgFileSizeKB = job.format === 'png' ? 800 : job.format === 'jpeg' ? 300 : 400;
  const estimatedSizeMB = (totalFiles * avgFileSizeKB) / 1024;

  return { totalFiles, estimatedSizeMB: Math.round(estimatedSizeMB * 10) / 10 };
}

export async function createExportZip(
  files: ExportFile[],
  buffers: Map<string, Buffer>
): Promise<Buffer> {
  const archiver = await import('archiver');
  const { Readable } = await import('stream');

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver.default('zip', { zlib: { level: 6 } });

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    for (const file of files) {
      const buffer = buffers.get(file.path);
      if (buffer) {
        archive.append(Readable.from(buffer), { name: file.path });
      }
    }

    archive.finalize();
  });
}
