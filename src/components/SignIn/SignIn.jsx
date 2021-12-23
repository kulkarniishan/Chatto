
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function SignIn({ app }) {
    const db = getFirestore(app)
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const signin = () => {

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;

                addDoc(collection(db, "users"), {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });


            }).catch((error) => {
                // // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // // The email of the user's account used.
                // const email = error.email;
                // // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (
        <>
            <button className='px-2 py-4 bg-teal-500' onClick={signin} >
                SignIn With Google
            </button>
        </>
    )
}