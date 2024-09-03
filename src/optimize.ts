import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
export const optimize = (dirPath: string) => {
  const fileList = fs.readdirSync(dirPath);

  fs.watch(dirPath, async (eventType, filename) => {
    if (!filename) {
      return;
    }
    if (fileList.includes(filename)) {
      return;
    }

    // ファイルが追加された場合。上書きされた場合は含まない。
    if (eventType === "rename" && filename) {

      // 画像ファイルかどうかを判定
      const filePath = path.resolve(dirPath, filename);
      if (!filename.match(/\.(jpg|jpeg|png|gif)$/)) {
        console.log("画像ファイルではありません");
        return;
      }

      const ext = path.extname(filename);

      switch (ext) {
        case ".gif":
          console.log("GIF画像は対応していません");
          break;
        case ".jpg":
        case ".jpeg":
          console.log("JPEG画像を最適化します");
          try {
            // 画像を最適化して上書き保存
            const data = await sharp(filePath)
              .jpeg({
                quality: 80, // JPEG品質（0-100）
                mozjpeg: true, // MozJPEGを使用して圧縮を改善
              })
              .toBuffer();
            fs.writeFileSync(filePath, data);
            console.log("画像を最適化しました");
            fileList.push(filename);
          } catch (err) {
            console.error(err);
          }
          break;
        case ".png":
          console.log("PNG画像を最適化します");
          try {
            // 画像を最適化して上書き保存
            const data = await sharp(filePath)
              .png({
                quality: 80, // PNG品質（0-100）
                compressionLevel: 9, // 圧縮レベル（0-9）
                palette: true, // パレット化: 圧縮を改善するためにパレットを使用
              })
              .toBuffer();
            fs.writeFileSync(filePath, data);
            console.log("画像を最適化しました");
            fileList.push(filename);
          } catch (err) {
            console.error(err);
          }
          break;
        default:
          console.log("対応していない拡張子です");
      }
    }
  });
};
