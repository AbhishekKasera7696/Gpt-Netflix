import React, { useRef, useState } from 'react'
import Header from './Header'
import { checkValidation } from '../utils/Validate';
import { auth } from '../utils/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { BG_URL, USER_AVATAR } from '../utils/constant';


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

    const handleButtonClick = () => {
        const message = checkValidation(email.current.value, password.current.value);
        setErrorMessage(message);

        if (message) return;

        // signIn/ signUp logic
        if (!isSignInForm) {
            //singUp Logic
            createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    updateProfile(user, {
                        displayName: name.current.value, photoURL:USER_AVATAR
                      }).then(() => {
                        // Profile updated!
                        const {uid, email, displayName, photoURL} = auth.currentUser;
                        dispatch(addUser({uid, email, displayName, photoURL}));
                      }).catch((error) => {
                        // An error occurred
                         setErrorMessage(error.message)
                      });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode + ' ' + errorMessage)
                });

        } else {
            //signIn Logic;
            signInWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode+ " " + errorMessage)
                });
        }
    }

    const toggleSignInForm = () => {
        setIsSignInForm(!isSignInForm);
    };

    return (
        <div>
            <Header />
            <div className='absolute'>
                <img src={BG_URL} alt='no-image'/>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className='w-full md:w-3/12 absolute p-12 my-36 mx-auto right-0 left-0 text-white rounded-lg bg-black bg-opacity-80'>
                <h1 className='font-bold text-3xl py-4'>{isSignInForm ? "Sign In" : "Sign Up"}</h1>
                {!isSignInForm && (<input ref={name} type='text' placeholder='Full Name' className='p-4 my-4 w-full bg-gray-700' />)}
                <input ref={email} type='text' placeholder='Email Address' className='p-4 my-4 w-full bg-gray-700' />
                <input ref={password} type='password' placeholder='Password' className='p-4 my-4 w-full bg-gray-700' />
                <p className='text-red-500'>{errorMessage}</p>
                <button className='p-4 my-6 bg-red-700 w-full rounded-lg' onClick={handleButtonClick}>{isSignInForm ? "Sign In" : "Sign Up"}</button>
                <p className='py-4 cursor-pointer' onClick={toggleSignInForm}>{isSignInForm ? "New to Netflix ? Sign Up Now" : "Already have account. Sign In Now"}</p>
            </form>
        </div>
    )
}

export default Login