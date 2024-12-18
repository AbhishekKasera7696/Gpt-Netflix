import { useEffect } from 'react'
import { API_OPTIONS } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import {addNowPopularMovies} from"../utils/movieSlice";

const usePopularMovies = () => {
    const dispatch = useDispatch();
    const popularMovies = useSelector((store) => store.movies.popularMovies)

    const getPopularMovies = async() => {
       const data = await fetch("https://api.themoviedb.org/3/movie/popular?&page=1",API_OPTIONS);
       const response = await data.json();
       dispatch(addNowPopularMovies(response.results))
    };
  
    useEffect(()=>{
      if(!popularMovies) getPopularMovies()
    }, [])
  
};

export default usePopularMovies;