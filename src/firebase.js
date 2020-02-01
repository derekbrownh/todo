import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCA5PqmXUx5rJioN_nsx2hG-6aVW_5XteM",
  authDomain: "todo-3534f.firebaseapp.com",
  databaseURL: "https://todo-3534f.firebaseio.com",
  projectId: "todo-3534f",
  storageBucket: "todo-3534f.appspot.com",
  messagingSenderId: "165705892393",
  appId: "1:165705892393:web:fbe4aef49b071229bc1238",
  measurementId: "G-QXY1F1N5K0"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
