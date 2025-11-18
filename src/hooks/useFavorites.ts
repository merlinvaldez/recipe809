import { useEffect, useMemo, useState } from "react";

const KEY = "recipe809:favorites";

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function write(favs: Set<string>) {
  try {
    const arr = Array.from(favs);
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch (e) {
    // Persisting favorites failed (e.g., storage disabled)
    console.warn("Favorites persistence error", e);
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => read());

  useEffect(() => {
    write(favorites);
  }, [favorites]);

  const actions = useMemo(
    () => ({
      isFavorite: (id: string) => favorites.has(id),
      toggle: (id: string) =>
        setFavorites((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }),
      clear: () => setFavorites(new Set()),
    }),
    [favorites]
  );

  return { favorites, ...actions } as const;
}
