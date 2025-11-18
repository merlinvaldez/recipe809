import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import recipes from "../data/recipes";
import type { Recipe } from "../types";
import { useFavorites } from "../hooks/useFavorites";

export default function RecipeDetail() {
  const { slug } = useParams();
  const recipe: Recipe | undefined = useMemo(
    () => recipes.find((r) => r.slug === slug),
    [slug]
  );
  const { isFavorite, toggle } = useFavorites();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (!recipe) {
    return (
      <section>
        <hgroup>
          <h2>Recipe not found</h2>
          <p>We couldn't find that recipe. It may have been moved.</p>
        </hgroup>
        <Link to="/" role="button">
          Go Home
        </Link>
      </section>
    );
  }

  const toggleIdx = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <article>
      <nav aria-label="Breadcrumb">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>{recipe.title}</li>
        </ul>
      </nav>

      <h1>{recipe.title}</h1>
      {recipe.description && <p>{recipe.description}</p>}

      <figure>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", height: "auto" }}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://source.unsplash.com/featured/?food&w=800&h=600";
          }}
        />
        <figcaption>
          {recipe.totalTime ? `${recipe.totalTime} min` : "Time varies"} ·
          Serves {recipe.servings ?? "—"}
        </figcaption>
      </figure>

      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        {recipe.diet.map((d) => (
          <span key={d} className="secondary">
            {d}
          </span>
        ))}
        <span className="secondary">{recipe.course}</span>
        {recipe.tags.map((t) => (
          <span key={t} className="secondary">
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: ".5rem", margin: "1rem 0" }}>
        <button
          aria-label={
            isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"
          }
          onClick={() => toggle(recipe.id)}
        >
          {isFavorite(recipe.id) ? (
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
        {recipe.sourceUrl && (
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noreferrer"
            role="button"
            className="secondary"
          >
            Source
          </a>
        )}
      </div>

      <div className="grid">
        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={checked.has(i)}
                    onChange={() => toggleIdx(i)}
                  />
                  {ing.quantity ?? ""} {ing.unit ?? ""} {ing.name}
                  {ing.note ? ` (${ing.note})` : ""}
                </label>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-color)' }}>
            {checked.size} of {recipe.ingredients.length} ingredients checked
          </p>
        </section>
        <section>
          <h2>Steps</h2>
          <ol>
            {recipe.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
