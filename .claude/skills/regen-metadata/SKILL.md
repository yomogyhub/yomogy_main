---
name: regen-metadata
description: Yomogyブログのメタデータ(all-blog.json等)・カバー画像の再生成と画像同期。記事やfrontmatterを変更した後、JSONが古い/記事が一覧に出ない/カバー画像がない場合に使用。runFunction.ts の実行。
---

# メタデータ・カバー画像の再生成

## コマンド

```bash
npx ts-node runFunction.ts            # all: メタデータ + カバー画像 + 画像同期
npm run generate:metadata             # JSONのみ
npm run generate:images               # カバー画像生成 + 画像同期のみ
npm run verify:generated              # 全記事のMDX・カバー画像(source/public)の存在検証
npm run update:link-card-metadata     # LinkCardのOGP情報を外部取得してキャッシュ更新
```

## これが行うこと(runFunction.ts)

1. `posts/blog/{著者}/*.mdx` 全件のfrontmatterを読み、以下を生成:
   - `posts/all-blog.json` — 全記事メタデータ(id → Post)
   - `posts/all-author.json` — 著者情報(デフォルト値で生成)
   - `posts/all-list-count.json` — カテゴリ/タグ/著者ごとの記事数
2. カバー画像 `{記事ID}_cover.png` が無い記事は、canvasでタイトルと著者アイコンから 1200×630px の画像を自動生成(`src/utils/make-fig.ts`)。
3. `posts/blog/{著者}/` の画像を `public/blog/{著者}/` に**差分同期**(サイズ・mtimeが同じならスキップ、投稿元から消えた画像だけ削除。`src/utils/copy-image-to-public.ts` の `syncImagesToPublic`)。

## LinkCardのOGPキャッシュ

- 通常ビルドは外部HTTPリクエストをせず、`posts/link-card-metadata.json` のキャッシュだけを参照する(未キャッシュURLはホスト名のフォールバック表示)。
- 新しいLinkCard URLを記事に追加したら `npm run update:link-card-metadata` を実行してキャッシュを更新し、**JSONをコミットする**こと。取得失敗時は既存のリッチなキャッシュを上書きしない設計。

## いつ実行するか

- 記事の追加・削除・frontmatter変更後
- 画像の追加・差し替え後
- ビルド前(Netlifyビルドと dev→staging PR のGitHub Actionsでも自動実行される)

## トラブルシューティング

- canvas(ネイティブモジュール)のエラーが出る場合: Node 22 系か確認(`engines: >=22`)。`npm rebuild canvas` を試す。
- 生成されたJSON・カバー画像・public同期分はコミット対象(CIも同じものを生成してコミットする)。
- 旧スクリプト `scripts/regenerate-json.js` もあるが、正は `runFunction.ts`。
