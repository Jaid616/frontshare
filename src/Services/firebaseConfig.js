import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCenHQeiuI-Mae-G4Ql0Jh8aCRdntYe7jE",
  authDomain: "paperbillpvtltd.firebaseapp.com",
  projectId: "paperbillpvtltd",
  storageBucket: "paperbillpvtltd.firebasestorage.app",
  messagingSenderId: "274371979182",
  appId: "1:274371979182:web:b00129bc7948e67c5a0a3f",
  measurementId: "G-7Z1TWM5M6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
