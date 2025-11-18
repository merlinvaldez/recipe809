import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import "./App.css";

function App() {
  return (
    <>
      <header className="container">
        <nav>
          <ul>
            <li>
              <strong>Recipe 809</strong>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:slug" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <footer className="container">
        <small>Built with React + Pico.css</small>
      </footer>
    </>
  );
}

export default App;
