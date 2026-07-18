---
name: add-post
description: Yomogyブログに新規記事(MDX)を作成・投稿する。記事作成、記事追加、新しい記事、投稿、blog post作成の依頼で使用。frontmatterルール、ファイル命名規則、画像配置、メタデータ再生成までの一連の手順。
---

# 新規記事の作成

## 手順

1. **配置場所を決める**: 記事は `posts/blog/{著者名}/{記事ID}.mdx` に置く。著者フォルダがなければ `posts/blog/{著者名}/` と `posts/blog/{著者名}/images/` を作成する(著者登録は `/add-author` 参照)。
2. **ファイル名 = URL**: 記事IDは `/^[a-zA-Z0-9\-]+$/`(半角英数字とハイフンのみ)。URLは `/{category}/{記事ID}` になる。違反ファイルはCIが自動削除する。
3. **テンプレートから作成**: `blog-template/basic.mdx` を元にする。コメントアウトはすべて削除すること。
4. **frontmatter(全フィールド必須)** — 欠けると `src/utils/validation-mdx.ts` の検証でCIがファイルを自動削除する:

```yaml
---
title: "記事タイトル"
category: "igem"            # igem | synbio (既存: book, tech もあり)
publishedAt: "2026-07-17"   # YYYY-MM-DD
updatedAt: "2026-07-17"
author: "yomogy"            # posts/blog/ 配下のフォルダ名と一致させる
description: "記事の説明文"
tag: ["information"]        # 1〜3個程度
rePost: false               # 転載の場合は転載元URLの文字列
status: "published"         # published | draft
---
```

5. **本文**: MDX形式。h2/h3 が目次(tocbot)の見出しになるので必ず入れる。使えるカスタムコンポーネント:
   - `<LinkCard url="..." size="small|large" />` — リンクカード
   - `<SNSCard url="..." />` — X/TikTok/Instagram/YouTube等の埋め込み
   - `<MediaCard mediaType="image|video" src="..." alt="..." caption="..." />` — 図表・動画
6. **画像**: `posts/blog/{著者名}/images/` に png/jpg/jpeg/gif、3MB以下で配置。記事からは `https://yomogy.com/blog/{著者名}/images/{ファイル名}` または `/blog/{著者名}/images/{ファイル名}` で参照。
7. **カバー画像**: `{記事ID}_cover.png` (1200×630px) を images/ に置く。無ければ次のメタデータ再生成時にタイトルから自動生成される。
8. **メタデータ再生成**: 記事追加後に必ず実行:

```bash
npx ts-node runFunction.ts
```

これで `posts/all-blog.json` / `all-author.json` / `all-list-count.json` の更新、不足カバー画像の生成、`public/blog/` への画像同期が行われる。

9. **確認**: `npm run dev` で `http://localhost:3000/{category}/{記事ID}` を確認。

## 注意

- 投稿先ブランチは `dev`(リリースフローは `/release` 参照)。
- READMEには `post/blog` と書かれているが、実際のディレクトリは `posts/blog`(READMEの誤記)。
- 新カテゴリを追加する場合は既存記事のcategory値と `src/lib/posts.ts` のルーティングが対応しているか確認する。
