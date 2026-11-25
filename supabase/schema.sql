-- favorite-spots: テーブル定義
-- Supabase の SQL Editor で実行してください。

create extension if not exists "pgcrypto";

-- categories: お気に入りの分類 (例: グルメ, カフェ, 観光地 など)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- favorites: ユーザーが登録するお気に入りスポット
-- Google Places API は使わず、Googleマップの共有URLのみを保持する。
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  title text not null,
  google_map_url text not null,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- reviews: お気に入りスポットに対する口コミ (5段階評価 + コメント)
-- 1ユーザー1お気に入りにつき口コミは1件まで。
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  favorite_id uuid not null references public.favorites (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (favorite_id, user_id)
);

create index if not exists favorites_category_id_idx on public.favorites (category_id);
create index if not exists favorites_user_id_idx on public.favorites (user_id);
create index if not exists reviews_favorite_id_idx on public.reviews (favorite_id);
create index if not exists reviews_user_id_idx on public.reviews (user_id);

-- updated_at 自動更新
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_favorites_updated_at on public.favorites;
create trigger set_favorites_updated_at
  before update on public.favorites
  for each row execute function public.set_updated_at();

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();
