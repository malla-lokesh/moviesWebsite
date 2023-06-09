import React, { useCallback, useEffect, useRef, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import Form from './components/Form';

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

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://reactpractice-b7e74-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong. Retrying...');
      }
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }

      // const transformedMovies = data.results.map(movieData => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date
      //   }
      // })
      await setMovies(loadedMovies);
    }
    catch(error) {
      setError(error.message);
      if(!cancelledRef.current) {
        setRetrying(true);
        retryIntervalRef.current = setTimeout(fetchMoviesHandler, 5000);
      }
    }
    setIsLoading(false);
  }, [])

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  function cancelRetryingHandler() {
    setRetrying(false);
    clearTimeout(retryIntervalRef.current);
  }

  const deleteHandler = (id) => {
    const moviesAfterDeleting = movies.filter(movie => movie.id !== id)
    
    setMovies(moviesAfterDeleting);
  }

  let content = <p>Found no movies.</p>

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDelete={deleteHandler}/>
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
        <Form/>
      </section>
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
