"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StackedPostViewer from "@/app/components/papers/StackedPostViewer";

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
    <StackedPostViewer
      current={current}
      prev={prev}
      next={next}
    />
  );
}