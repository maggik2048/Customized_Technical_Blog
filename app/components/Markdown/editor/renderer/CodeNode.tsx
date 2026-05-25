export default function CodeNode({
  content,
}: {
  content: string;
}) {
  return (
    <pre
      style={{
        background: "#111",
        color: "#fff",
        padding: 16,
        overflow: "auto",
      }}
    >
      <code>{content}</code>
    </pre>
  );
}