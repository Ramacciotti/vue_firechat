import firebase from "firebase/app";
import "firebase/database";

const iniciar = {
    // Api keys que pegamos do firebase
    apiKey: "AIzaSyDKmWpFfVdRuUlZfcTiCJnzWkPgXSnAz2k",
    authDomain: "vue-chat-bc237.firebaseapp.com",
    projectId: "vue-chat-bc237",
    storageBucket: "vue-chat-bc237.appspot.com",
    messagingSenderId: "331706521052",
    appId: "1:331706521052:web:cebf3026b8545a08f16b19"
}

const db = firebase.initializeApp(iniciar);

export default db;