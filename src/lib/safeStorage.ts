export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    /* ignore: storage disabled (private mode, quota) */
    return null;
  }
}

export function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore: storage disabled (private mode, quota) */
  }
}

export function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore: storage disabled (private mode, quota) */
  }
}