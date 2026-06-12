import { createClient } from "@supabase/supabase-js";
import pLimit from "p-limit";
import sharp from "sharp";
import crypto from "crypto";
import "dotenv/config";

console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const limit = pLimit(3);

const imageRegex = /!\[.*?\]\((.*?)\)/g;

/**
 * 1. Markdown에서 이미지 URL 추출
 */
function extractImageUrls(content: string) {
  const urls: string[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * 2. 이미지 다운로드
 */
async function downloadImage(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`failed to fetch ${url}`);
  }

  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
}

/**
 * 3. AVIF 변환 (Node sharp)
 */
async function convertToAvif(buffer: Buffer) {
  return await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .avif({ quality: 40 })
    .toBuffer();
}

/**
 * 4. Supabase 업로드
 */
async function uploadAvif(buffer: Buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");

  const filePath = `posts/${hash}.avif`;

  const { error } = await supabase.storage
    .from("imagebucket")
    .upload(filePath, buffer, {
      contentType: "image/avif",
      cacheControl: "31536000",
      upsert: false,
    });

  if (error && !error.message.includes("duplicate")) {
    throw error;
  }

  const { data } = supabase.storage
    .from("imagebucket")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * 5. content 치환
 */
function replaceUrls(content: string, map: Record<string, string>) {
  let result = content;

  for (const [oldUrl, newUrl] of Object.entries(map)) {
    result = result.replaceAll(oldUrl, newUrl);
  }

  return result;
}

/**
 * 6. main migration
 */
async function migrate() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, content");

  if (error) {
    throw error;
  }

  for (const post of posts ?? []) {
    const urls = extractImageUrls(post.content);

    if (urls.length === 0) continue;

    const map: Record<string, string> = {};

    await Promise.all(
      urls.map((url) =>
        limit(async () => {
          try {
            const img = await downloadImage(url);
            const avif = await convertToAvif(img);
            const newUrl = await uploadAvif(avif);

            map[url] = newUrl;
          } catch (e) {
            console.log("skip:", url);
          }
        })
      )
    );

    const newContent = replaceUrls(post.content, map);

    await supabase
      .from("posts")
      .update({ content: newContent })
      .eq("id", post.id);

    console.log("migrated:", post.id);
  }

  console.log("done");
}

migrate();