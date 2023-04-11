import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAkk7mvw4lMoV-FXehD8lBNcxOjsOkuSrk",
  authDomain: "projectimage-30bd7.firebaseapp.com",
  projectId: "projectimage-30bd7",
  storageBucket: "projectimage-30bd7.appspot.com",
  messagingSenderId: "1093890306664",
  appId: "1:1093890306664:web:90722aa6ed3a80839c41dd"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const storage = getStorage(app)