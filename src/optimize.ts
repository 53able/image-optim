import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SUPPORTED_EXTENSIONS = /\.(jpg|jpeg|png|gif)$/;
const JPEG_OPTIONS = {
  quality: 80,
  mozjpeg: true,
};
const PNG_OPTIONS = {
  quality: 80,
  compressionLevel: 9,
  palette: true,
};

const logError = (message: string) => console.error(message);
const logInfo = (message: string) => console.log(message);

const optimizeImage = async (filePath: string, ext: string) => {
  const fileName = path.basename(filePath);
  try {
    let data: Buffer;
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        logInfo(`JPEG画像を最適化します: ${fileName}`);
        data = await sharp(filePath).jpeg(JPEG_OPTIONS).toBuffer();
        break;
      case '.png':
        logInfo('PNG画像を最適化します: ${fileName}');
        data = await sharp(filePath).png(PNG_OPTIONS).toBuffer();
        break;
      default:
        logInfo('対応していない拡張子です');
        return;
    }
    fs.writeFileSync(filePath, data);
    const now = new Date().toLocaleTimeString();
    logInfo(`[${now}] ${fileName} を最適化しました`);
  } catch (err) {
    logError(`画像の最適化に失敗しました: ${err}`);
  }
};

export const optimize = (dirPath: string) => {
  console.log(`Watching ${dirPath}...`);
  const fileList = fs.readdirSync(dirPath);

  fs.watch(dirPath, async (eventType, filename) => {
    if (!filename || fileList.includes(filename)) return;
    if (!SUPPORTED_EXTENSIONS.test(filename)) return;
    if (eventType !== 'rename') return;

    const filePath = path.resolve(dirPath, filename);
    if (!fs.existsSync(filePath)) return;

    const ext = path.extname(filename);
    await optimizeImage(filePath, ext);
    fileList.push(filename);
  });
};
