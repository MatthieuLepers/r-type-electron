import fs from 'fs';
import axios from 'axios';

import { APP_DIRECTORY } from '@/main/utils/Constants';

export async function downloadImage(url: string, imagePath: string) {
  return axios({
    url,
    responseType: 'stream',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then((response) => new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(imagePath))
        .on('finish', resolve)
        .on('error', reject)
      ;
    }))
    .catch(() => new Promise((resolve, reject) => {
      try {
        const unset = fs.readFileSync('public/img/unset.png');
        fs.writeFileSync(imagePath, unset);
        resolve(imagePath);
      } catch (err) {
        reject(err);
      }
    }))
  ;
}

export async function getFaviconBase64(domain: string): Promise<string> {
  const faviconPath = `${APP_DIRECTORY}/icons/${domain}.png`;
  if (!fs.existsSync(faviconPath)) {
    await downloadImage(`https://s2.googleusercontent.com/s2/favicons?domain=${domain}`, faviconPath);
  }
  return `data:image/png;base64,${fs.readFileSync(faviconPath).toString('base64')}`;
}

export function initAppDirectories() {
  [
    APP_DIRECTORY,
    `${APP_DIRECTORY}/backups`,
    `${APP_DIRECTORY}/icons`,
  ].forEach((path: string) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
}
