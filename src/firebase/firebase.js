import * as firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAT3T9BsXNIqHGpwVum7lZxKwSgpCUJ5ys",
    authDomain: "td-cap.firebaseapp.com",
    databaseURL: "https://td-cap.firebaseio.com",
    projectId: "td-cap",
    storageBucket: "td-cap.appspot.com",
    messagingSenderId: "807493971824"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const auth = firebase.auth();

// instance of Twitter provider object
var provider = new firebase.auth.TwitterAuthProvider();

export {
    auth,
    provider
};