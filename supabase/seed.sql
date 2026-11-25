-- favorite-spots: 初期カテゴリ (任意)
insert into public.categories (name) values
  ('グルメ'),
  ('カフェ'),
  ('観光'),
  ('宿泊'),
  ('その他')
on conflict (name) do nothing;
