// getFilesFromDirectory(srcDir: string): string[] - 指定されたディレクトリからファイルのリストを取得します。
// filterValidFiles(files: string[]): string[] - 指定された条件（拡張子とファイルサイズ）を満たすファイルのみをフィルタリングします。
// copyFilesToDestination(files: string[], destDir: string): void - 指定されたファイルを目的のディレクトリにコピーします。

import fs from "fs";
import path from "path";

export function getFilesFromDirectory(
  srcDir: string,
  fileList: string[] = []
): string[] {
  const files = fs.readdirSync(srcDir);

  files.forEach((file) => {
    const filePath = path.join(srcDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      getFilesFromDirectory(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export function filterValidFiles(files: string[]): string[] {
  const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

  return files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    const fileStat = fs.statSync(file);
    const fileSizeInMB = fileStat.size / (1024 * 1024);

    return validExtensions.includes(ext) && fileSizeInMB <= 3;
  });
}

function isSupportedImage(file: string): boolean {
  return [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(
    path.extname(file).toLowerCase()
  );
}

export function copyFilesToDestination(
  files: string[],
  sourceDir: string,
  destDir: string
): void {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  files.forEach((file) => {
    const relativePath = path.relative(sourceDir, path.dirname(file));
    const newDestDir = path.join(destDir, relativePath);

    if (!fs.existsSync(newDestDir)) {
      fs.mkdirSync(newDestDir, { recursive: true });
    }

    const destFilePath = path.join(newDestDir, path.basename(file));

    // // コピー先にファイルが既に存在するかどうかを確認
    // if (!fs.existsSync(destFilePath)) {
    //   fs.copyFileSync(file, destFilePath);
    //   console.log(`Copied ${file} to ${destFilePath}`);
    // } else {
    //   console.log(`Skipped ${file} - already exists at ${destFilePath}`);
    // }

    // ひとまず全部コピーする
    fs.copyFileSync(file, destFilePath);
    console.log(`Copied ${file} to ${destFilePath}`);
  });
}

export function copyImagesToPublic(
  sourceDir: string,
  destinationDir: string
): void {
  const allFiles = getFilesFromDirectory(sourceDir);
  const validFiles = filterValidFiles(allFiles);
  copyFilesToDestination(validFiles, sourceDir, destinationDir);
}

/** 公開画像を差分同期し、投稿元から消えた画像だけを削除する。 */
export function syncImagesToPublic(
  sourceDir: string,
  destinationDir: string
): { copied: number; skipped: number; removed: number } {
  const sourceFiles = filterValidFiles(getFilesFromDirectory(sourceDir));
  const sourceRelativePaths = new Set(
    sourceFiles.map((file) => path.relative(sourceDir, file))
  );
  let copied = 0;
  let skipped = 0;
  let removed = 0;

  for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(sourceDir, sourceFile);
    const destinationFile = path.join(destinationDir, relativePath);
    const sourceStat = fs.statSync(sourceFile);
    const destinationStat = fs.existsSync(destinationFile)
      ? fs.statSync(destinationFile)
      : null;

    if (
      destinationStat &&
      destinationStat.size === sourceStat.size &&
      destinationStat.mtimeMs >= sourceStat.mtimeMs
    ) {
      skipped++;
      continue;
    }

    fs.mkdirSync(path.dirname(destinationFile), { recursive: true });
    fs.copyFileSync(sourceFile, destinationFile);
    copied++;
  }

  if (fs.existsSync(destinationDir)) {
    for (const destinationFile of getFilesFromDirectory(destinationDir)) {
      const relativePath = path.relative(destinationDir, destinationFile);
      if (isSupportedImage(destinationFile) && !sourceRelativePaths.has(relativePath)) {
        fs.rmSync(destinationFile);
        removed++;
      }
    }
  }

  console.log(
    `Image sync ${path.basename(sourceDir)}: ${copied} copied, ${skipped} unchanged, ${removed} removed`
  );
  return { copied, skipped, removed };
}
