# Yomogy blog 実行手順

このブログは、Next.js、TypeScript、Tailwind CSS および MDX を使用した SSG のブログサイトです。
(コードを改修しやすくするために、記事は参考記事を使用しています。)

## 1. プロジェクトの初期設定

- まず、`.env.sample`をコピーして、`.env`ファイルを作成します。このファイルには環境変数や設定情報が含まれていますので、適切な内容に変更してください。
- 必要なパッケージをインストールします。

```bash
npm install
```

- デベロップメントサーバーを起動します。

```bash
npm run dev
```

## 2. デプロイ手順

1. 以下のコマンドを実行して、必要な関数を実行します。

   ```bash
   npx ts-node runFunction.ts
   ```

   - 注意: GitHub Actions には自動実行の設定が含まれており、`dev` ブランチに変更が追加された際に上記のコマンドが実行されます。

2. 生成コマンドを使用して、静的ページを生成します。

   ```bash
   npm generate
   ```

## 3. MDX を使用したブログ機能

- このブログは MDX をベースにしています。ローカルに配置した MDX ファイルを読み取り、SSG でページを生成します。
- MDX ファイルのメタ情報として、`posts/all-author.json`, `posts/all-blog.json`, `posts/all-list-count.json` が使用されます。これらのファイルの生成は `npx ts-node runFunction.ts` コマンドで行います。

## 4. ライセンス情報

- このリポジトリのコード部分は、[MIT LICENSE](/LICENSE)の下でライセンスされています。
- このリポジトリの記事部分は、[CC BY 4.0](/CONTENT_LICENSE)の下でライセンスされています。
- 再利用や配布の際には適切にライセンスを遵守してください。

## 5. カテゴリーの追加方法

- カテゴリーを増やす場合は、`posts/blog` 配下と `public/images/blog` 配下に新しいフォルダを作成してください。

## 6. その他の機能

- mdx ファイルの追加のみで、カバー画像の自動作成を行います。(要実行`$ npx ts-node runFunction.ts`n)
- RSS フィードとサイトマップをサポートしています。
- SNS へのシェア機能をサポートしています。
- 記事ページでは、URL を使用して、SNS や他のブログ記事へのリンクカードを簡単に作成できます。
- SEO のための情報を追記することができます。
- 記事の編集要求を行うことができます。(要 Github 連携)
- Google Analytics, Google AdSense をサポートしています。 Google AdSense を使用する場合は、public/ads.txt を追加してください。
- 検索は Google のカスタム検索を使用します。

---
