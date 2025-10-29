import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const API_KEY = "41e2bba9";
const DETAILS_URL = (id) => `http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}&plot=full`;

function MovieCard({ movie, isFavorite = false, onAddFavorite, onRemoveFavorite }) {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // prevent background scroll when modal is open
  useEffect(() => {
    if (!showModal) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [showModal]);

  const openDetails = async () => {
    setShowModal(true);
    if (details) return; // already fetched

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(DETAILS_URL(movie.imdbID));
      const data = await res.json();
      if (data && data.Response === "True") {
        setDetails(data);
      } else {
        setError(data?.Error || "Details not available");
      }
    } catch (err) {
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-3 text-center transform hover:scale-105 transition-transform duration-300">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
        alt={movie.Title}
        className="w-full h-64 object-cover rounded-md"
      />
      <h2 className="font-bold mt-2">{movie.Title}</h2>
      <p className="text-sm text-gray-600">{movie.Year}</p>

      <div className="mt-3 flex justify-center gap-2">
        <button
          onClick={openDetails}
          className="bg-black hover:bg-black text-white px-3 py-2 rounded-md text-sm"
          aria-haspopup="dialog"
        >
          View details
        </button>

        <button
          onClick={() => {
            if (isFavorite) {
              if (typeof onRemoveFavorite === "function") onRemoveFavorite(movie.imdbID);
            } else {
              if (typeof onAddFavorite === "function") onAddFavorite(movie);
            }
          }}
          className={`px-3 py-2 rounded-md text-sm ${isFavorite ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>

      {showModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />

          <div className="relative bg-white text-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-auto max-h-[80vh]">
            <div className="p-4 border-b flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{movie.Title} <span className="text-sm text-gray-500">({movie.Year})</span></h3>
                <p className="text-sm text-gray-500">{movie.Type}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={movie.Title}
                  className="w-full rounded-md object-cover"
                />
              </div>

              <div className="md:col-span-2">
                {loading && <p className="text-sm text-gray-600">Loading details…</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}

                {details && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Plot:</span> {details.Plot}</p>
                    <p><span className="font-semibold">Genre:</span> {details.Genre}</p>
                    <p><span className="font-semibold">Director:</span> {details.Director}</p>
                    <p><span className="font-semibold">Actors:</span> {details.Actors}</p>
                    <p><span className="font-semibold">Released:</span> {details.Released}</p>
                    <p><span className="font-semibold">Runtime:</span> {details.Runtime}</p>
                    <p><span className="font-semibold">Language:</span> {details.Language}</p>
                    <p><span className="font-semibold">Awards:</span> {details.Awards}</p>
                    <p><span className="font-semibold">IMDB Rating:</span> {details.imdbRating}</p>
                    {details.BoxOffice && <p><span className="font-semibold">Box Office:</span> {details.BoxOffice}</p>}

                    {details.Ratings && details.Ratings.length > 0 && (
                      <div>
                        <p className="font-semibold">Ratings:</p>
                        <ul className="list-disc list-inside">
                          {details.Ratings.map((r) => (
                            <li key={r.Source}>{r.Source}: {r.Value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default MovieCard;
