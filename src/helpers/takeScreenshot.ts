import path from 'node:path';
import fs from 'node:fs';

import puppeteer from 'puppeteer';
import sharp from 'sharp';

import { IGenericError } from '../interfaces/errorInterface';
import { saveFile } from '../helpers/bucketActions';
import createErrorMessage from '../helpers/createErrorMessage';

const takeScreenshot = async (url: string, linkId: string): Promise<string | IGenericError> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    });

    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(60000);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const response = await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    if (!response || response.status() >= 400) {
      throw new Error(`Erro HTTP: ${response?.status() || 'Sem resposta'}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    await page.setViewport({ width: 1024, height: 768 });

    const uploadsDir = path.join(process.cwd(), 'uploads/pictures');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${linkId}-${Date.now()}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    const tempPath = `${filepath}-temp.jpg`;

    await page.screenshot({
      path: tempPath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1024, height: 768 }
    });

    await sharp(tempPath)
      .resize(280, 210, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 60 })
      .toFile(filepath);

    const fileLocation = await saveFile(filepath, filename);

    if (typeof fileLocation === 'object' && 'error' in fileLocation) {
      return fileLocation;
    }

    fs.unlinkSync(tempPath);
    fs.unlinkSync(filepath);

    return fileLocation;
  } catch (error) {
    console.error('Erro no takeScreenshot:', error);

    if (error instanceof Error && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      return createErrorMessage('URL não encontrada', 404);
    }

    return createErrorMessage('Erro ao criar screenshot');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default takeScreenshot;
