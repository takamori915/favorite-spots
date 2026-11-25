export interface Review {
  id: string
  favorite_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export interface NewReviewInput {
  favorite_id: string
  rating: number
  comment?: string
}

export const useReviews = () => {
  // Database 型は `supabase gen types typescript` で生成するまでは未定義のため、
  // ここでは any を指定してテーブル操作の型を許可する。
  const supabase = useSupabaseClient<any>()

  const fetchReviewsByFavorite = async (favoriteId: string): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('favorite_id', favoriteId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  const fetchMyReviews = async (userId: string): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  const createReview = async (input: NewReviewInput): Promise<Review> => {
    const supabaseUser = useSupabaseUser()
    if (!supabaseUser.value) throw new Error('ログインが必要です')

    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...input, user_id: supabaseUser.value.id })
      .select()
      .single()
    if (error) throw error
    return data
  }

  const updateReview = async (id: string, input: Partial<Pick<NewReviewInput, 'rating' | 'comment'>>): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const deleteReview = async (id: string): Promise<void> => {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error
  }

  const averageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, r) => sum + r.rating, 0)
    return Math.round((total / reviews.length) * 10) / 10
  }

  return {
    fetchReviewsByFavorite,
    fetchMyReviews,
    createReview,
    updateReview,
    deleteReview,
    averageRating,
  }
}
