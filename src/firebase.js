// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCPrufwSN31YKd66kWnZIPFmATpigOpboE",
    authDomain: "task-manager-app-9e622.firebaseapp.com",
    projectId: "task-manager-app-9e622",
    storageBucket: "task-manager-app-9e622.appspot.com",
    messagingSenderId: "283376049531",
    appId: "1:283376049531:web:21387f76a5afa7eb9971de"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };