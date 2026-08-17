export function signed(n: number): string {
  if (n > 0) return `+${n}`
  return String(n)
}
