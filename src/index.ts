#!/usr/bin/env tsx

import { program } from "commander";
import path from "path";
import fs from "fs";
import { optimize } from "./optimize";



program
.description("指定したディレクトリ内の画像を最適化します")
.command("optimize")
.argument("<dir>", "画像を保存するディレクトリ")
.action((dir) => {
  const dirPath = path.resolve(dir);

  // ディレクトリが存在しない場合は作る
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  optimize(dirPath);
});

program.parse(process.argv);
