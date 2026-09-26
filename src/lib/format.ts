export function formatKoDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export function publishedNews<T extends { published: boolean; publishedAt: string }>(items: T[]): T[] {
  return items
    .filter((item) => item.published)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function publishedOfficials<T extends { published: boolean; sort: number; name: string }>(
  items: T[],
): T[] {
  return items
    .filter((item) => item.published)
    .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name, "ko"));
}
