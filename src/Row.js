import React, { useState, useEffect } from 'react'
import './Row.css'
import axios from './axios.js';
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const base_url = "https://image.tmdb.org/t/p";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState(""); 
    
    useEffect(() => {
        const fetchData = async () => {
            const request = await axios.get(fetchUrl); 
            console.log(request.data.results);
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    }, [fetchUrl])

    const opts = {
        height: "390", 
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1
        }
    }    

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            }).catch(error => console.log(error))
        }
    }

    return (
        <div className='row'>
          <h2>{ title }</h2>  

          <div className='row__posters'>
              {movies.map(movie => 
                <img 
                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                src={`${base_url}${isLargeRow ? '/original/' + movie.poster_path : '/w250_and_h141_face/' + movie.backdrop_path}`} 
                alt={movie.name} 
                key={movie.id}
                onClick={() => handleClick(movie)}
                />
              )}
          </div>
         {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} /> }
        </div>
    )
}

export default Row
