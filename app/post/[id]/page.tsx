"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PDFPage from "./PDFPage";

export default function PostPage() {
  const { id } = useParams() as { id: string };

  const [current, setCurrent] = useState<any>(null);
  const [prev, setPrev] = useState<any>(null);
  const [next, setNext] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      // 현재 글
      const { data: currentData } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      setCurrent(currentData);
      if (!currentData) return;

      // 이전 글
      const { data: prevData } = await supabase
        .from("posts")
        .select("*")
        .eq("category", currentData.category)
        .lt("created_at", currentData.created_at)
        .order("created_at", { ascending: false })
        .limit(1);

      if (prevData?.length) setPrev(prevData[0]);

      // 다음 글
      const { data: nextData } = await supabase
        .from("posts")
        .select("*")
        .eq("category", currentData.category)
        .gt("created_at", currentData.created_at)
        .order("created_at", { ascending: true })
        .limit(1);

      if (nextData?.length) setNext(nextData[0]);
    };

    load();
  }, [id]);

  if (!current) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginTop: 40,
      }}
    >
      {/*  현재 글 */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <PDFPage data={current} isStandalone={false} />
      </div>

      {/*  이전 글 (왼쪽 뒤) */}
      {prev && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform:
              "translateX(-60%) translateY(-50px) scale(0.9) rotate(-2deg)",
            opacity: 0.4,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <PDFPage data={prev} isStandalone={false} />
        </div>
      )}

      {/*  다음 글 (오른쪽 뒤) */}
      {next && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform:
              "translateX(20%) translateY(-50px) scale(0.9) rotate(2deg)",
            opacity: 0.4,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <PDFPage data={next} isStandalone={false} />
        </div>
      )}
    </div>
  );
}