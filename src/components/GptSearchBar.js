import React, { useRef } from 'react'
import lang from '../utils/languageConstant'
import { useDispatch, useSelector } from 'react-redux'
import openai from '../utils/openAi';
import { API_OPTIONS } from '../utils/constant';
import { addGptMoviesResult } from '../utils/gptSlice';

const GptSearchBar = () => {
    const langKey = useSelector(store => store.config.lang);
    const searchText = useRef(null);
    const dispatch = useDispatch();


    //search movie in tmdb;
    const searchMovieTMDB = async(movie) => {
         const data = await fetch("https://api.themoviedb.org/3/search/movie?query=" 
            + movie +
            "&include_adult=false&language=en-US&page=1", 
            API_OPTIONS
        );
        const json = await data.json();
        return json.results
    };

    const handleGPTSearchClick = async () => {
        const query = "when user search then give it 5 top movies with comma separated" + searchText.current.value + "give me name like this for example movie name : Gadar, Sholay, Koi Mil Gaya, Don, Namstay London";
        try {
          const gptResults = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: query }],
            max_tokens: 50, // Adjust based on your needs to reduce token usage
          });
          
        //   console.log("GPT Response:", gptResults.choices[0].message.content);

          const gptMovies = gptResults.choices[0].message.content.split(",");

         const promiseArray = gptMovies.map((movie)=>searchMovieTMDB(movie));
         const tmdbResult = await Promise.all(promiseArray);
        //  console.log(tmdbResult)
         dispatch(addGptMoviesResult({movieNames: gptMovies, movieResults: tmdbResult}))
        } catch (error) {
          if (error.response) {
            // API responded with an error code
            console.error("API Error:", error.response.status, error.response.data);
            if (error.response.status === 429) {
              alert("Quota exceeded. Please check your API plan.");
            }
          } else {
            // Other errors (e.g., network issues)
            console.error("Unexpected Error:", error.message);
          }
        }
      };
      

  return (
    <div className='pt-[35%] md:pt-[10%] flex justify-center'>
        <form className='w-full md:w-1/2 bg-black grid grid-cols-12'onSubmit={(e)=>e.preventDefault()}>
            <input ref={searchText} type='text' className='p-4 m-4 col-span-9' placeholder={lang[langKey].gptSearchPlaceHolder}/>
            <button className='py-2 px-4 m-4 col-span-3 bg-red-700 text-white rounded-lg' onClick={handleGPTSearchClick}>{lang[langKey].search}</button>
        </form>
    </div>
  )
}

export default GptSearchBar