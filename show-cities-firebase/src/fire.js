import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let config = {
    apiKey: "",
    authDomain: "cities-62a97.firebaseapp.com",
    databaseURL: "https://cities-62a97.firebaseio.com",
    projectId: "cities-62a97",
    storageBucket: "cities-62a97.appspot.com",
    messagingSenderId: "708635868835"
};
let fire = firebase.initializeApp(config);

export default fire;
