import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request
) {
  try {
    const payload =
      await request.json();

    const commitUrl =
      payload?.head_commit?.url;

    if (!commitUrl) {
      return NextResponse.json({
        success: false,
        reason:
          "No commit URL",
      });
    }

    const { error } =
      await supabase
        .from("posts")
        .update({
          commit_url:
            commitUrl,

          commit_pending:
            false,
        })
        .eq(
          "commit_pending",
          true
        );

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      commitUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}