export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("th-Th", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
