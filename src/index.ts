#!/usr/bin/env tsx

import { program } from "commander";
import path from "node:path";
import fs from "node:fs";
import { optimize } from "./optimize";



program
.description("指定したディレクトリ内の画像を最適化します")
.command("watch")
.argument("<dirs...>", "画像を保存するディレクトリ")
.action((dirs) => {
  for (const dir of dirs) {
    const dirPath = path.resolve(dir);
    // ディレクトリが存在しない場合は作る
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.info(`ディレクトリを作成しました: ${dirPath}`);
    }
    optimize(dirPath);
  }
});

program.parse(process.argv);
