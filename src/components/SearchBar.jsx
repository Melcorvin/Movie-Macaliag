import { useState, useEffect, useRef } from "react";

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  const [query, setQuery] = useState(searchTerm || "");
  const [isTyping, setIsTyping] = useState(false);
  const debounceRef = useRef(null);

  // keep local query in sync when parent searchTerm changes
  useEffect(() => {
    setQuery(searchTerm || "");
  }, [searchTerm]);

  // debounced auto-search when user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If query is empty we still propagate the change (to allow clearing results)
    setIsTyping(true);
    debounceRef.current = setTimeout(() => {
      setIsTyping(false);
      // update parent state and trigger search with the explicit query
      if (typeof setSearchTerm === "function") setSearchTerm(query);
      if (typeof onSearch === "function") onSearch(query);
    }, 600);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cancel any pending debounce so we don't trigger a delayed duplicate search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setIsTyping(false);
    if (typeof setSearchTerm === "function") setSearchTerm(query);
    if (typeof onSearch === "function") onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    if (typeof setSearchTerm === "function") setSearchTerm("");
    if (typeof onSearch === "function") onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="movie-search" className="sr-only">Search movies</label>
      <div className="relative flex-1">
        <input
          id="movie-search"
          name="movie-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, e.g. Inception"
          className="w-full p-3 rounded-md text-gray-900 bg-white/90 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search movies"
        />
        {isTyping && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">typing…</span>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-black-800 hover:bg-black-800 text-white px-4 py-2 rounded-md shadow-md transition transform hover:scale-105"
        aria-label="Search"
      >
        Search
      </button>

      <button
        type="button"
        onClick={handleClear}
        className="inline-flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/5 text-white px-3 py-2 rounded-md transition transform hover:scale-105 "
        aria-label="Clear search"
      >
        Clear
      </button>
    </form>
  );
}

export default SearchBar;
