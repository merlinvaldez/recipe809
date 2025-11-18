import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import recipesData from "../data/recipes";
import type { CourseTag, DietTag, Recipe, SortOption } from "../types";
import { useFavorites } from "../hooks/useFavorites";

const DIETS: DietTag[] = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
];
const COURSES: CourseTag[] = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
  "drink",
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function scoreRecipe(r: Recipe, term: string) {
  if (!term) return 0;
  const t = normalize(term);
  const title = normalize(r.title);
  const ingredients = normalize(r.ingredients.map((i) => i.name).join(" "));
  const tags = normalize(
    [...r.tags, r.cuisine ?? "", ...r.diet, r.course].join(" ")
  );
  let score = 0;
  if (title.includes(t)) score += 5;
  if (ingredients.includes(t)) score += 3;
  if (tags.includes(t)) score += 2;
  return score;
}

function sortRecipes(list: Recipe[], sort: SortOption, term: string) {
  if (sort === "title")
    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "time")
    return [...list].sort(
      (a, b) => (a.totalTime ?? 9999) - (b.totalTime ?? 9999)
    );
  // relevance
  return [...list].sort((a, b) => {
    const sa = scoreRecipe(a, term);
    const sb = scoreRecipe(b, term);
    if (sb !== sa) return sb - sa;
    return a.title.localeCompare(b.title);
  });
}

export default function Home() {
  const { isFavorite, toggle } = useFavorites();
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [diet, setDiet] = useState<DietTag[]>([]);
  const [course, setCourse] = useState<CourseTag | undefined>(undefined);
  const [quickOnly, setQuickOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevance");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedText(text), 200);
    return () => clearTimeout(id);
  }, [text]);

  const filtered = useMemo(() => {
    const base = recipesData.filter((r) => {
      if (diet.length && !diet.every((d) => r.diet.includes(d))) return false;
      if (course && r.course !== course) return false;
      if (quickOnly && (r.totalTime ?? 9999) > 30) return false;
      if (!debouncedText) return true;
      const s = scoreRecipe(r, debouncedText);
      return s > 0;
    });
    return sortRecipes(base, sort, debouncedText);
  }, [diet, course, quickOnly, sort, debouncedText]);

  const reset = () => {
    setText("");
    setDiet([]);
    setCourse(undefined);
    setQuickOnly(false);
    setSort("relevance");
  };

  return (
    <section>
      <hgroup>
        <h1>Find your next recipe</h1>
        <p>Search by title, ingredients, or tags. Filter by diet and course.</p>
      </hgroup>

      <form
        onSubmit={(e) => e.preventDefault()}
        aria-label="Search and filters"
      >
        <div className="grid">
          <input
            type="search"
            placeholder="Search recipes (e.g., chicken, vegan, pasta)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Search recipes"
          />
          <select
            value={course ?? ""}
            onChange={(e) =>
              setCourse((e.target.value as CourseTag) || undefined)
            }
            aria-label="Course"
          >
            <option value="">All courses</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <details>
          <summary>Filters</summary>
          <div className="grid">
            <fieldset>
              <legend>Diet</legend>
              {DIETS.map((d) => (
                <label key={d}>
                  <input
                    type="checkbox"
                    checked={diet.includes(d)}
                    onChange={(e) =>
                      setDiet((prev) =>
                        e.target.checked
                          ? [...prev, d]
                          : prev.filter((x) => x !== d)
                      )
                    }
                  />
                  {d}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Other</legend>
              <label>
                <input
                  type="checkbox"
                  checked={quickOnly}
                  onChange={(e) => setQuickOnly(e.target.checked)}
                />
                Quick (≤ 30 min)
              </label>
              <label>
                Sort by
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="time">Time</option>
                  <option value="title">Title</option>
                </select>
              </label>
            </fieldset>
          </div>
          <button type="button" onClick={reset} className="secondary">
            Reset
          </button>
        </details>
      </form>

      {(diet.length > 0 || course || quickOnly) && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Active filters:</strong>
          {diet.map(d => <span key={d} className="filter-badge">{d}</span>)}
          {course && <span className="filter-badge">{course}</span>}
          {quickOnly && <span className="filter-badge">Quick (≤30 min)</span>}
        </div>
      )}

      <p>
        Showing <strong>{filtered.length}</strong> of{" "}
        <strong>{recipesData.length}</strong> recipes
      </p>

      {filtered.length === 0 ? (
        <article aria-live="polite">
          <h3>No results</h3>
          <p>Try a broader term, remove some filters, or press Reset.</p>
        </article>
      ) : (
        <div className="cards">
          {filtered.map((r) => (
            <article key={r.id}>
              <Link to={`/recipe/${r.slug}`}>
                <img
                  src={r.image}
                  alt={r.title}
                  style={{ width: "100%", height: "auto" }}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://source.unsplash.com/featured/?food&w=400&h=300";
                  }}
                />
                <h3>{r.title}</h3>
              </Link>
              <p>
                {r.totalTime ? `${r.totalTime} min` : "Time varies"} ·{" "}
                {r.course}
              </p>
              <small>{[...r.diet, ...r.tags].slice(0, 3).join(" • ")}</small>
              <div
                style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}
              >
                <button
                  aria-label={
                    isFavorite(r.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  onClick={() => toggle(r.id)}
                >
                  {isFavorite(r.id) ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.25rem' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      Favorited
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      Favorite
                    </>
                  )}
                </button>
                <Link
                  to={`/recipe/${r.slug}`}
                  role="button"
                  className="secondary"
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
