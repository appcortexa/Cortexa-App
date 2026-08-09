export class LocalStorageService {
  set<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  }

  get<T>(key: string): T | null {
    const serialized = localStorage.getItem(key);
    if (!serialized) {
      return null;
    }

    try {
      return JSON.parse(serialized) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
