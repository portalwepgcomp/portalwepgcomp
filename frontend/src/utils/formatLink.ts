export function formatLink(link: string): string {
  if (!link) return "";
  if (!link.startsWith("http://") && !link.startsWith("https://")) {
    return `http://${link}`;
  }
  return link;
}