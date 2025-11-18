import { Link } from "react-router-dom";
import recipes from "../data/recipes";
import { useFavorites } from "../hooks/useFavorites";

export default function Favorites() {
  const { favorites, isFavorite, toggle, clear } = useFavorites();
  const favList = recipes.filter((r) => favorites.has(r.id));

  return (
    <section>
      <h1>Favorites</h1>
      {favList.length === 0 ? (
        <article aria-live="polite">
          <h3>No favorites yet</h3>
          <p>
            Browse the <Link to="/">home</Link> page and tap "Favorite" on
            recipes you love.
          </p>
        </article>
      ) : (
        <>
          <p>
            You have <strong>{favList.length}</strong> favorite
            {favList.length === 1 ? "" : "s"}.
          </p>
          <div className="grid">
            {favList.map((r) => (
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
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <button onClick={() => toggle(r.id)}>
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
          <button className="secondary" onClick={() => { if (window.confirm('Are you sure you want to clear all favorites?')) clear(); }}>
            Clear all
          </button>
        </>
      )}
    </section>
  );
}
