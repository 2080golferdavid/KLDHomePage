export default function Prose({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-[15px] leading-7 text-kld-ink/90">
      {blocks.map((block, index) => (
        <p key={index} className="whitespace-pre-wrap">
          {block}
        </p>
      ))}
    </div>
  );
}
