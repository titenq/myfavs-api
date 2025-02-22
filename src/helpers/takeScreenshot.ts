import path from 'node:path';
import fs from 'node:fs';

import puppeteer from 'puppeteer';
import sharp from 'sharp';

import { IGenericError } from '../interfaces/errorInterface';
import { saveFile } from '../helpers/bucketActions';
import createErrorMessage from '../helpers/createErrorMessage';

const takeScreenshot = async (url: string, linkId: string): Promise<string | IGenericError> => {
  try {
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();

    await page.goto(url);

    const uploadsDir = path.join(process.cwd(), 'uploads/pictures');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${linkId}-${Date.now()}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await delay(1000);

    await page.setViewport({
      width: 1024,
      height: 768
    });

    const tempPath = `${filepath}-temp.jpg`;

    await page.screenshot({
      path: tempPath,
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1024,
        height: 768
      }
    });

    await sharp(tempPath)
      .resize(280, 210, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 }
      })
      .jpeg({ quality: 60 })
      .toFile(filepath);

    const fileLocation = await saveFile(filepath, filename);

    if (typeof fileLocation === 'object' && 'error' in fileLocation) {
      return fileLocation;
    }

    fs.unlinkSync(tempPath);
    fs.unlinkSync(filepath);

    await browser.close();

    return fileLocation;
  } catch (error) {
    let errorMessage = createErrorMessage('erro ao criar screenshot');

    if (error instanceof Error && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      errorMessage = createErrorMessage('url não encontrada', 404);
    }

    return errorMessage;
  }
};

export default takeScreenshot;
