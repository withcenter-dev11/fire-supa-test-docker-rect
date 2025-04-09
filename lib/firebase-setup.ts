// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//this is for my personal project
// const firebaseConfig = {
//   apiKey: "AIzaSyC7gpcGkNo1-oWSHRZoZRUEG5zZr3OVUJA",
//   authDomain: "test-integrate-with-supabase.firebaseapp.com",
//   projectId: "test-integrate-with-supabase",
//   storageBucket: "test-integrate-with-supabase.firebasestorage.app",
//   messagingSenderId: "531083776391",
//   appId: "1:531083776391:web:2810a1466d5cbf8ff40322",
//   measurementId: "G-JXX5YKS4LN",
// };

//this is for the withcenter firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBVp4ERqSY3dfQctY700eBdcbXmSZRPJEU",
  authDomain: "withcenter-test-4.firebaseapp.com",
  databaseURL: "https://withcenter-test-4-default-rtdb.firebaseio.com",
  projectId: "withcenter-test-4",
  storageBucket: "withcenter-test-4.appspot.com",
  messagingSenderId: "109766947030",
  appId: "1:109766947030:web:2d99a7beb182d5c8239977",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
