import { NextApiRequest, NextApiResponse } from 'next';
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "toas-hakemus",
  storageBucket: "toas-hakemus.appspot.com",
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


const postResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  // check if user is admin
  if (!req.cookies.token || req.cookies.token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const kohde = req.body;
    const kohdeRef = doc(db, "kohteet", kohde.id);
    await setDoc(kohdeRef, kohde);
    res.status(200).json({...kohdeRef});
  }
}

const getResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  // check if user is logged in
  if (!req.cookies.token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    const kohteet = await getDocs(collection(db, "kohteet"));
    res.status(200).json(kohteet);
  }
}

const deleteResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  // check if user is admin
  if (!req.cookies.token || req.cookies.token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    await deleteDoc(doc(db, "kohteet", req.body.id));
  }
}


