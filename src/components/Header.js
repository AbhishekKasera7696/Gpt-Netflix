import React, { useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../utils/Firebase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGE } from '../utils/constant';
import { toggleGptSearchView } from '../utils/gptSlice';
import { changeLanguage } from '../utils/configSlice';




const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector(store => store.gpt.showGptSearch)

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      navigate("/error")
    });
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value))
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        navigate("/browse")
      } else {
        dispatch(removeUser());
        navigate("/")
      }
    });
    //unsubscribe when component unmount;
    return () => unsubscribe();
  }, []);

  const handleGptSearch = () => {
    dispatch(toggleGptSearchView())
  }

  return (
    <div className='absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between'>
      <img className='w-44' src={LOGO}
        alt='netflix-logo'
      />
      {
        user && (
          <div className='flex p-8'>
            {showGptSearch && <select className='p-2 bg-gray-900 text-white' onChange={handleLanguageChange}>
              {SUPPORTED_LANGUAGE.map((lang) =>
                <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>
              )}
            </select>}
            <button className='py-0 px-4 bg-purple-800 text-white rounded-lg mx-2' onClick={handleGptSearch}>{showGptSearch?"Home Page" : "GPT Search"}</button>
            <img className='w-6 h-6' src={user?.photoURL} alt='no-image' />
            <button onClick={handleSignOut} className='font-bold text-white'>(Sign Out)</button>
          </div>
        )
      }
    </div>
  )
}

export default Header