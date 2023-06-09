import { useState } from 'react';
import './Form.css';

const Form = () => {

    const [title, setTitle] = useState('');
    const [openingText, setOpeningText] = useState('');
    const [releaseDate, setReleaseDate] = useState('');

    const submitFormHandler = async (event) => {
        event.preventDefault();
        const newMovieObj = {
            title: title,
            openingText: openingText,
            releaseDate: releaseDate
        }
        
        setTitle('');
        setOpeningText('');
        setReleaseDate('');

        await fetch('https://reactpractice-b7e74-default-rtdb.firebaseio.com/movies.json', {
            method: 'POST',
            body: JSON.stringify(newMovieObj),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return <form className='form' onSubmit={submitFormHandler}>
        <div>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div>
            <label>Opening Text</label>
            <textarea value={openingText} onChange={(e) => setOpeningText(e.target.value)}></textarea>
        </div>
        <div>
            <label>Release Date</label>
            <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)}/>
        </div>
        <div className='btnDiv'>
            <button type='submit'>
                Add Movie
            </button>
        </div>
    </form>
}

export default Form;