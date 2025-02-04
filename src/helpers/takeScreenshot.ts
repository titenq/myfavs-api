import path from 'node:path';
import fs from 'node:fs';

import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { IGenericError } from '@/interfaces/errorInterface';

const { BUCKET_KEY, BUCKET_SECRET, BUCKET_NAME } = process.env;

const credentials = {
  accessKeyId: BUCKET_KEY!,
  secretAccessKey: BUCKET_SECRET!
};

const s3Client = new S3Client({
  endpoint: 'https://s3.tebi.io',
  credentials: credentials,
  region: 'global',
  forcePathStyle: true
});

const takeScreenshot = async (url: string, linkId: string): Promise<string | IGenericError> => {
  try {
    const browser = await puppeteer.launch();
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
    
    const uploadData = await new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME!,
        Key: filename,
        Body: fs.createReadStream(filepath),
        ContentType: 'image/jpeg'
      }
    }).done();

    fs.unlinkSync(tempPath);
    fs.unlinkSync(filepath);

    await browser.close();

    return uploadData.Location!;
  } catch (error) {
    let errorMessage: IGenericError = {
      error: true,
      message: 'erro ao criar screenshot',
      statusCode: 400
    };

    if (error instanceof Error && error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      errorMessage = {
        error: true,
        message: 'url não encontrada',
        statusCode: 404
      };
    }

    return errorMessage;
  }
};

export default takeScreenshot;
