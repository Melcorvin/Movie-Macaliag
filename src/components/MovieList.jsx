import MovieCard from "./MovieCard";

function MovieList({ movies, favorites = [], onAddFavorite, onRemoveFavorite }) {
  if (movies.length === 0) {
    return <p>No movies found.</p>;
  }

  const isFavorite = (movie) => favorites.some((f) => f.imdbID === movie.imdbID);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={isFavorite(movie)}
          onAddFavorite={onAddFavorite}
          onRemoveFavorite={onRemoveFavorite}
        />
      ))}
    </div>
  );
}

export default MovieList;
