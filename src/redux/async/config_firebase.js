import * as firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBolnqghsxdV0OvTUM6RqAgpD6Yz2Zi8QU",
    authDomain: "geoz-9db4d.firebaseapp.com",
    databaseURL: "https://geoz-9db4d.firebaseio.com",
    // projectId: "geoz-9db4d",
    storageBucket: "geoz-9db4d.appspot.com",
    // messagingSenderId: "542075108993"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);  
export default firebase;