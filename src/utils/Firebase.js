// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0JIMAlXXhWo7exrVG-5x9Q6QBS7wcFfg",
  authDomain: "gpt-netflix-56a9c.firebaseapp.com",
  projectId: "gpt-netflix-56a9c",
  storageBucket: "gpt-netflix-56a9c.firebasestorage.app",
  messagingSenderId: "122721449991",
  appId: "1:122721449991:web:d25275ed147519597352a2",
  measurementId: "G-GPMRFQRGTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();