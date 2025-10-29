import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=41e2bba9"

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");

  const fetchMovies = async (term = searchTerm) => {
    try {
      const q = term || "";
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(q)}`);
      const data = await response.json();
      setMovies(data.Search || []);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setMovies([]);
    }
  };

  // load favorites from localStorage
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (_) {
        setFavorites([]);
      }
    }
    // initial load
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFavorite = (imdbID) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== imdbID));
  };

  return (
  <div className="min-h-screen bg-linear-to-br from-gray-900 via-indigo-900 to-gray-800 text-gray-100 flex flex-col">
      <Header />

  <main className="container mx-auto px-4 py-10 w-full max-w-6xl min-h-[60vh] flex flex-col items-center justify-center">
        {/* Hero */}
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Movies</h1>
          <p className="mt-2 text-gray-300">Search and discover movies here!</p>
        </section>

        {/* Search area */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-2xl">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={fetchMovies} />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowFavorites(true)}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* Movie list */}
        <section className="mt-8 w-full">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-inner">
            <MovieList movies={movies} favorites={favorites} onAddFavorite={addFavorite} onRemoveFavorite={removeFavorite} />
          </div>
        </section>
      </main>

      <Footer />

      {showFavorites && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFavorites(false)} />

          <div className="relative bg-white text-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-auto max-h-[80vh]">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Your favorites</h3>
              <button onClick={() => setShowFavorites(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="p-4 space-y-4">
              {favorites.length === 0 && <p className="text-sm text-gray-600">No favorites yet. Add movies to favorites to see them here.</p>}

              {favorites.map((m) => (
                <div key={m.imdbID} className="flex items-center gap-4">
                  <img src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/80x120?text=No+Image"} alt={m.Title} className="w-20 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{m.Title} <span className="text-sm text-gray-500">({m.Year})</span></div>
                    <div className="text-sm text-gray-600">{m.Type}</div>
                  </div>
                  <div>
                    <button onClick={() => removeFavorite(m.imdbID)} className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setShowFavorites(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
