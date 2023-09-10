export function formatTime(milliseconds: number): string {
  const date = new Date(milliseconds);
  const hours = Math.floor(milliseconds / 1000 / 60 / 60)
    .toString()
    .padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}
