export function formatThousands(num, separator = ' ') {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator}`);
}

export function formatThousandsWithPrefix(num, separator, prefix) {
  const value = formatThousands(num, separator);
  return prefix ? `${prefix} ${value}` : value;
}
