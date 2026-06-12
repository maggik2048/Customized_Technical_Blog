import { supabase } from "@/lib/supabase";

import { hashBlob } from "./hashBlob";

import { resizeAndCompressToAvif } from "./resizeAndCompressToAvif";

export async function uploadImage(
  file: File
) {
  const avifBlob =
    await resizeAndCompressToAvif(
      file,
      0.35
    );

  const hash =
    await hashBlob(avifBlob);

  const fileName =
    `posts/${hash}.avif`;

  const publicUrl =
    supabase.storage
      .from("imagebucket")
      .getPublicUrl(fileName)
      .data.publicUrl;

  const { error } =
    await supabase.storage
      .from("imagebucket")
      .upload(
        fileName,
        avifBlob,
        {
          contentType:
            "image/avif",

          cacheControl:
            "31536000",

          upsert: false,
        }
      );

  if (
    error &&
    !String(error.message)
      .toLowerCase()
      .includes("duplicate")
  ) {
    console.error(error);

    return null;
  }

  return publicUrl;
}