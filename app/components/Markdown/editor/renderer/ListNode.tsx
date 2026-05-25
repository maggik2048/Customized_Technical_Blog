export default function ListNode({
  items,
}: {
  items: string[];
}) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}