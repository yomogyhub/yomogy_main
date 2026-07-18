---
name: verify
description: Yomogyブログのコード・記事変更をローカルで検証する。ビルド確認、動作確認、lint、記事バリデーション、変更が壊れていないかの確認で使用。
---

# 変更の検証

## 1. メタデータ生成が通るか

記事・画像を変更した場合はまず:

```bash
npx ts-node runFunction.ts
npm run verify:generated   # 全記事のMDX・カバー画像(source/public)の存在検証
```

Node は 22 系必須(`.nvmrc` = 22.21.1、`.npmrc` engine-strict)。canvas の ABI エラー(`NODE_MODULE_VERSION` 不一致)が出たら `npm rebuild canvas`。

## 2. 個別MDXのバリデーション(CIと同じ検証)

```bash
npx ts-node src/utils/validation-mdx.ts posts/blog/{著者}/{記事ID}.mdx
```

frontmatter必須フィールド(title, category, publishedAt, updatedAt, author, description, tag, rePost, status)とファイル名規則(`/^[a-zA-Z0-9\-]+$/`)を検証。CIではこれに失敗したファイルは自動削除されるので、push前にローカルで通すこと。

## 3. lint と本番ビルド

```bash
npm run lint
npm run build   # output: "export" — 静的生成が全ページ成功するか
```

ビルドは `out/` に静的出力される。getStaticPaths は `posts/all-blog.json` 等に依存するため、ビルド前に手順1が必須。

## 4. 実際の表示確認

```bash
npm run dev
```

- トップ: http://localhost:3000/
- 記事: http://localhost:3000/{category}/{記事ID} (例: /igem/igem-schedule)
- カテゴリ一覧: /{category}/page/1、タグ: /{category}/tag/{tag}/1、著者: /author/{著者}/1

確認ポイント: 記事本文の描画(MDXカスタムコンポーネント LinkCard / SNSCard / MediaCard)、目次(h2/h3)、カバー画像、ダークモード切替。

## 注意

- 画像規格: 著者画像 200×200px PNG、カバー画像 1200×630px PNG、記事画像 3MB以下 png/jpg/jpeg/gif。規格外はCIが削除する。
- テストスイートは存在しない。検証は「runFunction → lint → build → dev目視」の4段。
