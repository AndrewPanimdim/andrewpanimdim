export function apiUrl(path: string): string {
  const base = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path))
  if (!response.ok) {
    throw new Error(`API ${response.status} for ${path}`)
  }
  return (await response.json()) as T
}
