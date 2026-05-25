import { supabase } from "@/lib/supabase";
import { resizeImage } from "./resizeImage";

export async function uploadImage(
  file: File
) {
  const resized = await resizeImage(
    file,
    1000
  );

  const fileName = `${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from("imagebucket")
    .upload(fileName, resized, {
      contentType: "image/jpeg",
    });

  if (error) {
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from("imagebucket")
    .getPublicUrl(fileName);

  return data.publicUrl;
}