import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => {
  const deleteHandler = async () => {
    try {
      const response = await fetch(`https://reactpractice-b7e74-default-rtdb.firebaseio.com/movies/${props.id}.json`, {
        method: 'DELETE'
      })
      if(!response.ok) {
        throw new Error('Deleting movie failed');
      }

      props.onDelete(props.id);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <li className={classes.movie}>
      <div className={classes.titleAndDeleteButton}>
        <h2 className={classes.h2}>{props.title}</h2>
        <button 
          className={classes.deleteButton}
          onClick={deleteHandler}
        >Delete</button>
      </div>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
    </li>
  );
};

export default Movie;
