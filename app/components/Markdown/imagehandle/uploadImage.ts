import { supabase } from "@/lib/supabase";
import { resizeAndCompressToAvif } from "./resizeAndCompressToAvif";

export async function uploadImage(file: File) {
  const avifBlob = await resizeAndCompressToAvif(file, 0.35);

  const fileName = `posts/${crypto.randomUUID()}.avif`;

  const { error } = await supabase.storage
    .from("imagebucket")
    .upload(fileName, avifBlob, {
      contentType: "image/avif",
      cacheControl: "31536000",
      upsert: false,
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