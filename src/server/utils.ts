// sorry typescript
export function mapNullableValuesToOptionals<T extends object>(
  data: T
): {
  [key in keyof T]: null extends T[key]
    ? Exclude<T[key], null> | undefined
    : T[key]
} {
  return Object.fromEntries(
    Object.entries(data).filter(([v]) => v != null)
  ) as {
    [key in keyof T]: null extends T[key]
      ? Exclude<T[key], null> | undefined
      : T[key]
  }
}
