export function readProgress(key, size) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(saved)
      ? [...new Set(saved.filter((value) => Number.isInteger(value) && value >= 0 && value < size))]
      : [];
  } catch {
    return [];
  }
}

export function writeProgress(key, values) {
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Browsers may disable storage for local HTML files or private browsing.
  }
}
