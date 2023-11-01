# ようこそ Yomogy へ

こちらは、Synbio(合成生物学)や iGEM に関する情報を集約し、発信する場所です。オープンな議論や記事の作成を心から歓迎します。

(このコードを手元で動かしたい方は[こちら](/README.dev.md)からご確認ください。)

## 基本操作

- **記事の投稿**: `post/blog` 配下の適切な位置に mdx ファイルを配置することで、ブログ記事が公開されます。

### 手順

0. **ファイル名の注意**: すべてのファイル名は、`/^[a-zA-Z0-9\-]+$/` ( Alphabet, 数字, - (ハイフン) ) のみ受け付けます。また、下記の仕様に適さない場合、自動的に削除されます。
1. **Github アカウント作成**: まず、Github のアカウントを作成してください。その後、コミュニティメンバーとしての申請を行ってください。承認後に記事の投稿などが可能となります。
2. **著者情報の登録**: `post/all-author.json`に従って、自身の著者情報を追加または修正してください。必要に応じて、`public/author/{任意}.png`に 200px × 200px の画像を配置してください。
3. **記事の作成**: `blog-template`からテンプレートをダウンロードし、指示に従って記事を作成してください。(タイトルではなく) ファイル名が、URL になりますので、命名規則に気をつけて作成してください。
4. **記事の投稿**: 作成した記事は`dev`ブランチの`post/blog/{ユーザー名}`配下に追加してください。フォルダが存在しない場合は、`post/blog/{ユーザー名}`と`post/blog/{ユーザー名}/images`を各自で作成してください。
5. **画像の追加**: `post/blog/{ユーザー名}/images`配下に、"png" "jpg" "jpeg" "gif"の 4 つの形式かつ 3MB 以下で配置することで使用できます。
6. **トップ画像の変更**: トップ画像は`dev`ブランチから`staging`ブランチへの Pull request を作成するたびに、自動的に更新されます。もし、トップ画像の変更が必要であれば、`post/blog/{ユーザー名}/images`に 1200px × 630px の画像を配置してください。

## Deploy

- **main ブランチ**: [https://yomogy.com/](https://yomogy.com/)
- **staging ブランチ**: [https://yomogy-staging.netlify.app/](https://yomogy-staging.netlify.app/)

## ブランチについて

- **main**: 本番環境
- **staging**: 本番直前のテスト環境（基本的には確認後に`main`にマージする）
- **dev**: 開発環境
- その他、`dev`を基にしたブランチ: 各プロジェクトごとにブランチを作成

ブランチの状態は[こちら](https://github.com/yomogyhub/yomogy_main/network)から確認できます。

### ルール

1. **更新の流れ**: `dev` → `staging` → `main`という順序で更新を行います。
2. **Pull request の承認**: `main`と`staging`への Pull request は、運営メンバーのみが承認することができます。

## GitHub Actions

- **Dev ブランチの更新**: `dev`ブランチへの push の際に、記事の確認を自動で行います。
- **staging ブランチの更新**: `dev`ブランチから`staging`ブランチへの Pull request の際に、記事の更新を行います。
- **main ブランチのマージ**: `main`ブランチへの Pull request が承認されたら、その内容を自動的に`dev`ブランチにマージします。

より詳しいルールや設定に関しては、[こちら](https://docs.google.com/document/d/1FWIKMC0qhX1lNA9h32stjj3dL1AcozJRctZxywR8170/edit?usp=sharing)をご参照ください。

## LICENSE

- このリポジトリのコード部分は、[MIT LICENSE](/LICENSE)の下でライセンスされています。
- このリポジトリの記事部分は、[CC BY 4.0](/CONTENT_LICENSE)の下でライセンスされています。
