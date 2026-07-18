---
name: add-author
description: Yomogyブログに新しい著者(投稿者)を登録する。著者追加、投稿者登録、authorフォルダ作成の依頼で使用。
---

# 新規著者の登録

## 手順

1. **フォルダ作成**: `posts/blog/{著者名}/` と `posts/blog/{著者名}/images/` を作成する。著者名は半角英数字(これが記事パスとauthor名になる)。
2. **著者画像**: `public/authors/{著者名}.png` に 200×200px のPNG画像を配置する(小文字ファイル名)。
   - 例外: 著者 `yomogy` の画像は `y0m0gy.png`(runFunction.ts にハードコードされた特例)。
3. **著者情報**: `posts/all-author.json` は `npx ts-node runFunction.ts` 実行時に自動生成される。手動編集しても記事が1件でもあれば再生成時に `bio: "Posts by {著者名}"` などのデフォルト値で上書きされる点に注意(カスタムbioを永続化したい場合は runFunction.ts の該当ロジックの修正が必要)。
4. **記事を1件以上追加**: 著者は記事から抽出されるため、記事がないと all-author.json に載らない。記事作成は `/add-post` 参照。
5. **再生成**: `npx ts-node runFunction.ts` を実行して確認。

## CI検証(dev push時)

- `public/author/` 配下のPNG以外・200×200px以外の画像は自動削除される。
- 著者ページURL: `/author/{著者名}/1`
