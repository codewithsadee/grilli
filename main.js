import {initializeApp} from "firebase/app"
import {getFirestore, collection, addDoc} from "firebase/firestore"


const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId:import.meta.env.VITE_MEASUREMENT_ID
  };


  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  const form =document.getElementById("orderDetails")



  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('').value;
    const phone = document.getElementById('').value;
    const category = document.getElementById('').value;
    const date = document.getElementById('').value;
    const count = document.getElementById('').value;
    const message =document.getElementById('').value;

  })

