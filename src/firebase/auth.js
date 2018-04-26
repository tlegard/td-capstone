import { auth, provider } from './firebase';
import * as firebase from 'firebase';

// authenticate with Firebase using the Twitter provider object
var signIn = firebase.auth().signInWithPopup(provider).then(function (result) {
    console.log('sign in worked!');
    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    // You can use these server side with your app's credentials to access the Twitter API.
    var token = result.credential.accessToken;
    var secret = result.credential.secret;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

// Sign out
var signOut = firebase.auth().signOut().then(function () {
    // Sign-out successful.
}).catch(function (error) {
    // An error happened.
});

export {
    signIn,
    signOut,
};