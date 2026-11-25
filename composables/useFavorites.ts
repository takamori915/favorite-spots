export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  category_id: string
  title: string
  google_map_url: string
  memo: string | null
  created_at: string
  updated_at: string
  categories?: { name: string } | null
}

export interface NewFavoriteInput {
  category_id: string
  title: string
  google_map_url: string
  memo?: string
}

export const useFavorites = () => {
  // Database 型は `supabase gen types typescript` で生成するまでは未定義のため、
  // ここでは any を指定してテーブル操作の型を許可する。
  const supabase = useSupabaseClient<any>()

  const fetchCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw error
    return data ?? []
  }

  const fetchCategory = async (id: string): Promise<Category | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  const fetchFavoritesByCategory = async (categoryId: string): Promise<Favorite[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, categories(name)')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  const fetchFavorite = async (id: string): Promise<Favorite | null> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, categories(name)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  const fetchMyFavorites = async (userId: string): Promise<Favorite[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, categories(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  const createFavorite = async (input: NewFavoriteInput): Promise<Favorite> => {
    const supabaseUser = useSupabaseUser()
    if (!supabaseUser.value) throw new Error('ログインが必要です')

    const { data, error } = await supabase
      .from('favorites')
      .insert({ ...input, user_id: supabaseUser.value.id })
      .select()
      .single()
    if (error) throw error
    return data
  }

  const updateFavorite = async (id: string, input: Partial<NewFavoriteInput>): Promise<Favorite> => {
    const { data, error } = await supabase
      .from('favorites')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const deleteFavorite = async (id: string): Promise<void> => {
    const { error } = await supabase.from('favorites').delete().eq('id', id)
    if (error) throw error
  }

  return {
    fetchCategories,
    fetchCategory,
    fetchFavoritesByCategory,
    fetchFavorite,
    fetchMyFavorites,
    createFavorite,
    updateFavorite,
    deleteFavorite,
  }
}
