export const capitalize = (str: string) => {
  if (!str) return str;
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

export function toLetters(num) {
  let letters = '';
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
    num = Math.floor(num / 26) - 1;
  }

  return letters.toLowerCase();
}

export function ellipsis(str: string, maxLength: number) {
  if (!str) return '';
  if (str && str.length > maxLength) {
    return str.slice(0, maxLength - 1) + '...';
  }
  return str;
}
