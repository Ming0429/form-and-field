/** Browser storage is optional: privacy modes or quota limits must not break shopping. */
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function restoreSavedIds(
  raw: string | null,
  validIds: string[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string =>
                typeof id === "string" && validIds.includes(id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
