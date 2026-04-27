import { useRef, useState } from 'react';
// import { fetchMovies } from './movieService';

/**
 * CHALLENGE INSTRUCTIONS:
 * 1. Implement a custom hook or logic to fetch movies page by page.
 * 2. Use an IntersectionObserver to detect when the user reaches the bottom.
 * 3. Append new movies to the existing list.
 * 4. Handle loading and empty states.
 */

export default function MovieGallery() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // TODO: Create a ref for the scroll trigger
  const observerTarget = useRef(null);

  // TODO: Implement the Intersection Observer logic

  // TODO: Implement the fetch logic

  return (
    <div
      className="gallery-container"
      style={{ padding: '20px', fontFamily: 'sans-serif' }}
    >
      <h1>Infinite Movies</h1>

      <div className="movie-grid" style={{ display: 'grid', gap: '15px' }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <h3>{movie.title}</h3>
            <p>
              {movie.genre} • {movie.year}
            </p>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading more movies...</p>}

      {/* TODO: This div should trigger the next fetch when visible */}
      <div
        ref={observerTarget}
        style={{ height: '20px', background: 'transparent' }}
      />

      {!hasMore && (
        <p style={{ textAlign: 'center', color: '#888' }}>
          You have reached the end.
        </p>
      )}
    </div>
  );
}
