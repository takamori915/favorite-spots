-- favorite-spots: RLS ポリシー
-- schema.sql を実行した後にこのファイルを実行してください。

alter table public.categories enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;

-- categories: 誰でも閲覧可能。登録はログインユーザーのみ。
drop policy if exists "categories_select_all" on public.categories;
create policy "categories_select_all"
  on public.categories for select
  using (true);

drop policy if exists "categories_insert_authenticated" on public.categories;
create policy "categories_insert_authenticated"
  on public.categories for insert
  to authenticated
  with check (true);

-- favorites: 誰でも閲覧可能。作成はログインユーザー本人として、更新・削除は本人のみ。
drop policy if exists "favorites_select_all" on public.favorites;
create policy "favorites_select_all"
  on public.favorites for select
  using (true);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own"
  on public.favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "favorites_update_own" on public.favorites;
create policy "favorites_update_own"
  on public.favorites for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own"
  on public.favorites for delete
  to authenticated
  using (auth.uid() = user_id);

-- reviews: 誰でも閲覧可能。投稿はログインユーザー本人として、更新・削除は本人のみ。
drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);
