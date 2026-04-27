/**
 * MOCK MOVIE SERVICE
 */

const ALL_MOVIES = [
  { id: 1, title: "Inception", genre: "Sci-Fi", year: 2010 },
  { id: 2, title: "The Dark Knight", genre: "Action", year: 2008 },
  { id: 3, title: "Interstellar", genre: "Sci-Fi", year: 2014 },
  { id: 4, title: "The Matrix", genre: "Sci-Fi", year: 1999 },
  { id: 5, title: "Pulp Fiction", genre: "Crime", year: 1994 },
  { id: 6, title: "The Godfather", genre: "Crime", year: 1972 },
  { id: 7, title: "Fight Club", genre: "Drama", year: 1999 },
  { id: 8, title: "Forrest Gump", genre: "Drama", year: 1994 },
  { id: 9, title: "The Shawshank Redemption", genre: "Drama", year: 1994 },
  { id: 10, title: "Gladiator", genre: "Action", year: 2000 },
  { id: 11, title: "Se7en", genre: "Crime", year: 1995 },
  { id: 12, title: "The Silence of the Lambs", genre: "Thriller", year: 1991 },
  { id: 13, title: "The Departed", genre: "Crime", year: 2006 },
  { id: 14, title: "The Prestige", genre: "Mystery", year: 2006 },
  { id: 15, title: "Memento", genre: "Thriller", year: 2000 },
  { id: 16, title: "The Green Mile", genre: "Drama", year: 1999 },
  { id: 17, title: "Saving Private Ryan", genre: "War", year: 1998 },
  { id: 18, title: "Schindler's List", genre: "History", year: 1993 },
  { id: 19, title: "The Lion King", genre: "Animation", year: 1994 },
  { id: 20, title: "Toy Story", genre: "Animation", year: 1995 }
];

/**
 * Fetches movies with pagination.
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise<{data: Array, hasMore: boolean}>}
 */
export const fetchMovies = (page = 1, limit = 5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = ALL_MOVIES.slice(start, end);
      resolve({
        data,
        hasMore: end < ALL_MOVIES.length
      });
    }, 800);
  });
};
