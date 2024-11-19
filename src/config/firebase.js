// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, getDoc, setDoc, doc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
// import { signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBWY7cACGIBxMgvFDYFoDywQ8buALaTbPY",
    authDomain: "chatterbox-6430e.firebaseapp.com",
    projectId: "chatterbox-6430e",
    storageBucket: "chatterbox-6430e.appspot.com",
    messagingSenderId: "440580199044",
    appId: "1:440580199044:web:72995309bc0381bc5028d1"
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
            chatsData:[]
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

const resetPassword=async(email)=>{
    if(!email){
        toast.error("Enter Your Email");
        return null;
    }
    try {
        const userRef=collection(db,'users');
        const q=query(userRef,where("email","==",email));
        const querySnap=await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email);
            toast.success("Reset Email Sent");
        }
        else{
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        toast.error(error.message);
    }
}
export {signup,login, logout, auth, db}