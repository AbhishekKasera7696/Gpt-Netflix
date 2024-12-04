import { API_OPTIONS } from '../utils/constant';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTrailerVideo } from '../utils/movieSlice';

const useMoviesTrailer = (movieId) => {
    const dispatch = useDispatch();
    const trailerMovies = useSelector((store) => store.movies.trailerVideo)

    const getMoviesVideo = async () => {
        const data = await fetch("https://api.themoviedb.org/3/movie/"+ movieId + "/videos??language=en-US", API_OPTIONS);
        const response = await data.json();
        const filterData = response.results.filter((video => video.type === "Trailer"));
        const trailer = filterData.length ? filterData[0] : response.results[0];
        dispatch(addTrailerVideo(trailer))
    };

    useEffect(() => {
        if(!trailerMovies) getMoviesVideo()
    }, [])
};

export default useMoviesTrailer;