interface HighlightMatchProps {
  text: string;
  query: string;
}

export function HighlightMatch({ text, query }: HighlightMatchProps) {
  if (!query) return <>{text}</>;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-yellow-500 bold font-extrabold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
