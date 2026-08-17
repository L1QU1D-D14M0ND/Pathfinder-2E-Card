export function DerivedCell({
  value,
  overridden = false,
}: {
  value: string | number
  overridden?: boolean
}) {
  return (
    <span className={overridden ? 'derived overridden' : 'derived'}>
      {value}
    </span>
  )
}
