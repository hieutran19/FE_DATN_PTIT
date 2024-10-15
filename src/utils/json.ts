export function safeParseJSON<T, D>(value: string, defaultValue: D | null = null): T | D | null {
  try {
    return value ? JSON.parse(value) || defaultValue : defaultValue
  } catch (error: unknown) {
    return defaultValue
  }
}
