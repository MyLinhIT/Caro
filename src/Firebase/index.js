import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRRQsMj5UBq3h5dQReM17Z3uqCXBo6E3s",
    authDomain: "game-caro-50a16.firebaseapp.com",
    databaseURL: "https://game-caro-50a16.firebaseio.com",
    projectId: "game-caro-50a16",
    storageBucket: "game-caro-50a16.appspot.com",
    messagingSenderId: "246516673009",
    appId: "1:246516673009:web:f6bd47f74089cf75e73c50",
    measurementId: "G-Z7ZYCSTGMF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();