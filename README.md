# 日誌

Jekyll製の個人ブログです。GitHub Pagesでホスティングしています。

## セットアップ

```bash
bundle install
bundle exec jekyll serve
```

http://localhost:4000 でローカルプレビューできます。

## 新しい記事の作成

`_posts/` ディレクトリに `YYYY-MM-DD-title.md` 形式でファイルを作成します。

```markdown
---
layout: post
title: "記事タイトル"
date: YYYY-MM-DD
tags: [タグ1, タグ2]
description: "記事の説明（OGP用）"
---

本文をここに書きます。
```

## デプロイ

`main` ブランチにプッシュすると GitHub Actions が自動的にビルドしてデプロイします。
