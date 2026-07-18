---
name: release
description: Yomogyブログのリリース・デプロイフロー(dev→staging→main)。デプロイ、公開、リリース、staging反映、本番反映、ブランチ運用、GitHub Actionsの挙動に関する作業で使用。
---

# リリースフロー (dev → staging → main)

## ブランチと環境

| ブランチ | 役割 | URL |
|---|---|---|
| dev | 開発。記事投稿先 | — |
| staging | 本番直前確認 | https://yomogy-staging.netlify.app/ |
| main | 本番 | https://yomogy.com/ |

更新は必ず `dev` → `staging` → `main` の順。main/stagingへのPR承認は運営メンバーのみ。

## GitHub Actions の挙動(重要)

- **devへpush** (`run_dev.yml`, `run_dev_mdx.yml`): 記事・画像・JSONを検証し、**違反ファイルは自動削除コミット**される(frontmatter必須フィールド欠落、不正なJSON、規格外画像: 著者画像200×200以外・カバー1200×630以外・3MB超・png/jpg/jpeg/gif以外)。
- **dev→staging PR作成/更新** (`run_dev_to_staging.yml`): `npx ts-node runFunction.ts` が実行され、生成物(JSON・カバー画像・public同期)が**devに自動コミット**される。
- **mainへpush/マージ** (`run_main.yml`): devが `origin/main` に**force resetされる**。mainマージ直後はローカルdevを `git fetch && git reset --hard origin/dev` で追従させること(devの未pushコミットは消えるので先にpushしておく)。

## 手順

1. devで作業しpush。CI検証が通ることを確認。
2. dev → staging のPRを作成:
   ```bash
   gh pr create --base staging --head dev
   ```
3. マージ後、staging URLで表示確認。
4. staging → main のPRを作成・承認・マージで本番公開。

## デプロイ(Netlify)

- ビルドコマンド: `npm install && npx ts-node runFunction.ts && npm run build`、公開ディレクトリ: `out/`(`output: "export"` の完全静的SSG)、Node 22。
- 環境変数(必要時): `BASE_URL`, `GA_MEASUREMENT_ID`, `GA_ADSENSE_ID`(netlify.toml参照)。
