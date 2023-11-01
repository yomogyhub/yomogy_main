import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D,
} from "canvas";
import fs from "fs";

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(""); // 文字ごとに分割
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n]; // スペースの追加を削除
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

export async function createImage(
  savePath: string,
  text: string,
  author: string,
  authorImage: string
) {
  // ベースとなる画像を読み込む
  const baseImage = await loadImage("public/basic.png");

  // フォントを登録する
  registerFont("src/styles/MPLUSRounded1c-Bold.ttf", {
    family: "M PLUS Rounded 1c",
  });

  // canvasを作成
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  // ベースの画像を描画する
  ctx.drawImage(baseImage, 0, 0);

  // テキストを追加する
  ctx.font = "64px M PLUS Rounded 1c"; // フォントのサイズとファミリーを適宜調整
  wrapText(
    ctx,
    text, // "これはテストです.これはテストです.これはテストです.これはテストです.これはテストです.これはテストです.",
    70,
    220,
    canvas.width - 130,
    64
  );
  // テキストの位置を適宜調整

  // 別の画像を読み込む
  // const overlayImage = await loadImage("public/images/authors/y0m0gy.png");
  const overlayImage = await loadImage("public" + authorImage);
  const overlaySize = Math.min(overlayImage.width, overlayImage.height);
  const offsetX = (overlayImage.width - overlaySize) / 2;
  const offsetY = (overlayImage.height - overlaySize) / 2;
  const desiredSize = 80; // ここで最終的な枠のサイズを指定します（例: 100x100）

  // 新しいキャンバスを作成して丸くクリッピング
  const overlayCanvas = createCanvas(overlaySize, overlaySize);
  const overlayCtx = overlayCanvas.getContext("2d");

  overlayCtx.beginPath();
  overlayCtx.arc(
    overlaySize / 2,
    overlaySize / 2,
    overlaySize / 2,
    0,
    2 * Math.PI
  );
  overlayCtx.clip();

  // オリジナルの画像を新しいキャンバスに描画
  overlayCtx.drawImage(
    overlayImage,
    offsetX,
    offsetY,
    overlaySize,
    overlaySize,
    0,
    0,
    overlaySize,
    overlaySize
  );

  // 新しいキャンバスの内容をメインのキャンバスに描画
  ctx.drawImage(
    overlayCanvas,
    0,
    0,
    overlaySize,
    overlaySize, // 画像の切り取り範囲
    70,
    470,
    desiredSize,
    desiredSize // 描画範囲（固定のサイズにスケーリング）
  );

  const textX = 70 + desiredSize + 10; // 画像の右側に10pxの余白を取って文字を開始
  const textY = 470 + 20 + desiredSize / 2; // 画像の中央に合わせる

  ctx.font = "48px M PLUS Rounded 1c"; // フォントのサイズとファミリーを適宜調整
  ctx.fillText(author, textX, textY); // 「

  // 画像を保存する
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(savePath, buffer);
}
