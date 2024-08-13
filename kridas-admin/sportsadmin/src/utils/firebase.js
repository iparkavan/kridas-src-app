import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiHW_u3rrAm1PcixNKjRIACi1EzYvBE6Q",
  authDomain: "stock-analyzer-da81d.firebaseapp.com",
  projectId: "stock-analyzer-da81d",
  storageBucket: "stock-analyzer-da81d.appspot.com",
  messagingSenderId: "1053499607642",
  appId: "1:1053499607642:web:769af1005c6f1a692be663",
  measurementId: "G-YEV1CV23R4",
};
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;
