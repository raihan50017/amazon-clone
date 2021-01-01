import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyCIW7cFUbL2etSHSO45IdmMXnzrpasXfNc",
    authDomain: "clone-8a68d.firebaseapp.com",
    databaseURL: "https://clone-8a68d.firebaseio.com",
    projectId: "clone-8a68d",
    storageBucket: "clone-8a68d.appspot.com",
    messagingSenderId: "96462380241",
    appId: "1:96462380241:web:8675d1d8e00c175867b9f0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };