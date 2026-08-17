import { Suspense } from "react";
import WritePageClient from "./WritePageClient";

export default function WritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePageClient />
    </Suspense>
  );
}