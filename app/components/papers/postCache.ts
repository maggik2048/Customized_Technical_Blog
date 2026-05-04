const postCache = new Map<string, any>();

export const getCachedPost = async (supabase: any, id: string) => {
  if (postCache.has(id)) {
    return postCache.get(id);
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  postCache.set(id, data);
  return data;
};