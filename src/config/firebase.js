// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, getDoc, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
// import { signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxom0nyhe3wtDs4rMM3EovjiZx3X3NXL4",
  authDomain: "chatterbox-bea67.firebaseapp.com",
  projectId: "chatterbox-bea67",
  storageBucket: "chatterbox-bea67.appspot.com",
  messagingSenderId: "713917292767",
  appId: "1:713917292767:web:2ff660cb00255be5b6096a",
  measurementId: "G-Z9LYVFTKLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const signup = async (username, email, password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user= res.user;
        await setDoc(doc(db,"users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey there! I am using ChatterBox",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
       
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email,password);

    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () =>{
    try {
        await signOut(auth)
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

export {signup,login, logout, auth, db}