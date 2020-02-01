import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDqKTdlVA2IAXL-BeqW8AuuDu_9ymXk7bc",
  authDomain: "authv2-173b7.firebaseapp.com",
  databaseURL: "https://authv2-173b7.firebaseio.com",
  projectId: "authv2-173b7",
  storageBucket: "authv2-173b7.appspot.com",
  messagingSenderId: "900822893119",
  appId: "1:900822893119:web:dc47b5b6fc7e9c116a2e8a",
  measurementId: "G-G6CFMPM1TW"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
