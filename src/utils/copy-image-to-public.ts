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
    const ext = path.extname(file);
    const fileStat = fs.statSync(file);
    const fileSizeInMB = fileStat.size / (1024 * 1024);

    return validExtensions.includes(ext) && fileSizeInMB <= 3;
  });
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
