import React, { useEffect, useRef, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retryIntervalRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      clearTimeout(retryIntervalRef.current);
      cancelledRef.current = true;
    }
  }, []);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/film');
      if (!response.ok) {
        throw new Error('Something went wrong. Retrying...');
      }
      const data = await response.json();

      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }
      })
      setMovies(transformedMovies);
    }
    catch(error) {
      setError(error.message);
      if(!cancelledRef.current) {
        setRetrying(true);
        retryIntervalRef.current = setTimeout(fetchMoviesHandler, 5000);
      }
    }
    setIsLoading(false);
  }

  function cancelRetryingHandler() {
    setRetrying(false);
    clearTimeout(retryIntervalRef.current);
  }

  let content = <p>Found no movies.</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies}/>
  }

  if (error) {
    content = <div>
      <p>{error}</p>
      {retrying && <button onClick={cancelRetryingHandler}>Cancel retrying</button>}
    </div>
  }

  if(isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
