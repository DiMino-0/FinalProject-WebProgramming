export const API_ROOT = (import.meta.env.VITE_API_ROOT as string) ?? '/api/v1/'

export function rest<T>(url: string): Promise<T> {
  return fetch(url).then((x) => x.json())
}

export function api<T>(action: string): Promise<T> {
  return rest<T>(`${API_ROOT}${action}`)
}
export function apiDelete<T>(action: string): Promise<T> {
  return fetch(`${API_ROOT}${action}`, {
    method: 'DELETE',
  }).then((x) => x.json())
}
export function apiCustomMethod<T>(action: string, method: string, body: any): Promise<T> {
  return fetch(`${API_ROOT}${action}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((x) => x.json())
}
