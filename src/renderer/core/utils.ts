export function toCamelCase(str: string): string {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .split(' ')
    .map((part, i) => (i > 0 ? `${part.charAt(0).toUpperCase()}${part.substr(1).toLowerCase()}` : part.toLowerCase()))
    .join('')
  ;
}

export function debounce(callback: Function, delay: number) {
  let timer: number;
  return function() {
    window.clearTimeout(timer);
    timer = window.setTimeout(callback, delay);
  };
}

export function shuffleArray<T>(a: Array<T>): Array<T> {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
