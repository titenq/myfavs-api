import path from 'node:path';
import fs from 'node:fs';

import puppeteer from 'puppeteer';

const takeScreenshot = async (url: string, linkId: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const uploadsDir = path.join(process.cwd(), 'uploads/pictures');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filename = `${linkId}-${Date.now()}.png`;
  const filepath = path.join(uploadsDir, filename);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  await delay(1000);

  await page.setViewport({
    width: 1024,
    height: 768
  });

  await page.screenshot({
    path: filepath,
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width: 1024,
      height: 768
    }
  });

  await browser.close();

  return `/uploads/pictures/${filename}`;
};

export default takeScreenshot;
