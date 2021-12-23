import { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import SignIn from "./components/SignIn/SignIn";
import Chat from "./components/Chat/Chat";

const firebaseConfig = {
  apiKey: "AIzaSyAGy_8yleIB5fWJa-3FYeIE-QCcYiXIpJ8",
  authDomain: "chatto-15efd.firebaseapp.com",
  projectId: "chatto-15efd",
  storageBucket: "chatto-15efd.appspot.com",
  messagingSenderId: "537564943882",
  appId: "1:537564943882:web:e359d427013f86db8831f3",
  measurementId: "G-P5SCN6KZ70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)



function App() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      }
      setLoading(false)
    })
  }, [auth])

  return (
    <div className="App">
      {
        !loading &&
        <div>
          {
            user ? <Chat user={user} setUser={setUser} app={app} /> : <SignIn db={db} />
          }
        </div>
      }
    </div>
  );
}

export default App;
