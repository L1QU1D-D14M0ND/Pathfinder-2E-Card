import en from '../locales/en.json'

type MessageTree = { [key: string]: string | MessageTree }

function lookup(tree: MessageTree, path: string): string | undefined {
  const parts = path.split('.')
  let node: string | MessageTree | undefined = tree
  for (const part of parts) {
    if (typeof node === 'string' || node == null) return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

/** Resolve `shell.newSheet` (etc.) from the English catalog. Interpolation: `{name}`. */
export function t(
  key: string,
  vars?: Record<string, string | number>,
): string {
  const template = lookup(en as MessageTree, key) ?? key
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name)
      ? String(vars[name])
      : `{${name}}`,
  )
}
