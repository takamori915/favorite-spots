# favorite-spots

誰でもお気に入りスポットをカテゴリごとに登録・参照できるサイトです。Nuxt3 + Supabase で構築しています。

## 主な機能

- メール/パスワード認証 + Googleログイン(Supabase Auth)
- カテゴリ別のお気に入り登録(タイトル、GoogleマップURL、メモ)
- 自前の口コミ投稿機能(5段階評価 + コメント)
- Google Places API は課金・規約リスクがあるため使用せず、Googleマップへのリンクと
  Maps Embed API(無料)のみを使用して地図を表示

## セットアップ

```bash
npm install
cp .env.example .env
# .env に Supabase / Google Maps Embed API の値を設定
npm run dev
```

### 環境変数 (`.env`)

| 変数名 | 説明 |
| --- | --- |
| `SUPABASE_URL` | Supabase プロジェクトの URL |
| `SUPABASE_KEY` | Supabase の anon public キー |
| `NUXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | Google Cloud で **Maps Embed API のみ** を有効化して発行したAPIキー(Places APIは有効化しないこと) |

### Supabase 側の設定

1. `supabase/schema.sql` を SQL Editor で実行し、テーブルを作成
2. `supabase/policies.sql` を実行し、RLS ポリシーを適用
3. (任意) `supabase/seed.sql` を実行し、初期カテゴリを投入
4. Authentication > Providers で Email と Google を有効化
5. Authentication > URL Configuration で `Redirect URLs` にデプロイ先の `/confirm` を追加
   (例: `http://localhost:3000/confirm`, `https://your-domain.example/confirm`)

## ディレクトリ構成

```
composables/    useAuth / useFavorites / useReviews
components/     StarRating, MapEmbed
pages/          index, login, signup, confirm, categories/[id],
                favorites/new, favorites/[id], mypage
middleware/     auth.ts (ログイン必須ページ用)
supabase/       schema.sql, policies.sql, seed.sql
```

## 技術メモ

- 認証・セッション管理は [`@nuxtjs/supabase`](https://supabase.nuxtjs.org/) モジュールを利用
- サイトの大半のページは未ログインでも閲覧可能。`favorites/new` と `mypage` のみ
  `middleware: 'auth'` でログインを必須にしている
- 地図表示は Places API を使わず、Maps Embed API の `search` モードにタイトルを
  検索キーワードとして渡す方式(登録された Google マップ共有URLは外部リンクとして提供)
