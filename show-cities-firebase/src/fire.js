import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyA4ixj7ItE70jzJkAMB_BD7HBYpIn7nG3g",
    authDomain: "cities-62a97.firebaseapp.com",
    databaseURL: "https://cities-62a97.firebaseio.com",
    projectId: "cities-62a97",
    storageBucket: "cities-62a97.appspot.com",
    messagingSenderId: "708635868835"
};
var fire = firebase.initializeApp(config);

export default fire;