import { supabase } from "@/lib/supabase";

export async function testUpdatePost(postId: number) {
  try {
    // 1. 기존 데이터 가져오기
    const { data: originalData, error: fetchError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return { success: false, error: fetchError.message };
    }

    console.log("Original post data:", originalData);

    // 2. 테스트용 업데이트
    const { data: updatedData, error: updateError } = await supabase
      .from("posts")
      .update({ title: originalData.title + " [TEST]", content: originalData.content })
      .eq("id", postId)
      .select();

    if (updateError) {
      console.error("Update error:", updateError);
      return { success: false, error: updateError.message };
    }

    console.log("Updated post data:", updatedData);

    // 3. 원래 데이터로 되돌리기
    const { data: revertedData, error: revertError } = await supabase
      .from("posts")
      .update({ title: originalData.title, content: originalData.content })
      .eq("id", postId)
      .select();

    if (revertError) {
      console.error("Revert error:", revertError);
      return { success: false, error: revertError.message };
    }

    console.log("Post reverted to original:", revertedData);

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: (err as Error).message };
  }
}