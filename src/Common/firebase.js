import firebase from 'firebase';

firebase.initializeApp({
    apiKey: "AIzaSyCPYy3jLsL55ATCztyEgtzFgMcMXhIkiUs",
    authDomain: "prototype-10d46.firebaseapp.com",
    databaseURL: "https://prototype-10d46.firebaseio.com",
    projectId: "prototype-10d46",
    storageBucket: "prototype-10d46.appspot.com",
    messagingSenderId: "1064173130858",
    appId: "1:1064173130858:web:28d14a9637070127286613",
    measurementId: "G-5J8DMDVZYS"
});
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

const signIn = () => {
    firebase.auth().signInWithPopup(googleProvider).then(
        (result) => {
            // Sign in successful
        }
    ).catch(
          (error) => {
            console.error(error);
        }
    );
}

const signOut = () => {
    firebase.auth().signOut().then(
        () => {
            // Sign out successful
        }
    ).catch(
          (error) => {
            console.error(error);
        }
    );
}

export { firebase, signIn, signOut, db };
