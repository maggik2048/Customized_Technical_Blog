import { useEffect } from "react";

export function useForcePlainCopy() {
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection) return;

      const text = selection.toString();

      // 핵심: HTML 제거 + plain text 강제
      e.preventDefault();
      e.clipboardData?.setData("text/plain", text);

      // 일부 브라우저 대응
      e.clipboardData?.setData("text/html", text.replace(/\n/g, "<br>"));
    };

    const handleCut = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection) return;

      const text = selection.toString();

      e.preventDefault();
      e.clipboardData?.setData("text/plain", text);
      e.clipboardData?.setData("text/html", text.replace(/\n/g, "<br>"));
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
    };
  }, []);
}