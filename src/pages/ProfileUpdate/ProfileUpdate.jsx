import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import firebase from 'firebase/compat/app';
import { toast, useToast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';
const ProfileUpdate = () => {

  const goback=()=>{
    navigate('/chat');
  }
  const navigate=useNavigate();


  // const [image,setImage] = useState(false);
  const [first, setfirst] = useState(null);
  const [name,setName] = useState("");
  const [bio,setBio]= useState("");
  const [uid,setUid]=useState("");
  const [img,setImg]=useState(null);
  // const [data,setUserData]=useContext(AppContext);d
  const setUserData=useContext(AppContext);
  const profileUpdate=async (e)=>{
    e.preventDefault();
    try {
      if(!img && !first){
        toast.error("Upload Profile Picture");
      }
      const docRef=doc(db,'users',uid);
      if(first){
        const imgUrl= await upload(first);
        setImg(imgUrl);
        await updateDoc(docRef,{
          avatar:imgUrl,
          name:name,
          bio:bio
        })
        // alert("success");
        navigate("/chat");
      }
      else{
        await updateDoc(docRef,{
          avatar:img,
          name:name,
          bio:bio
        })
        // console.log(docRef.data)
        // alert("success");
        const snap=await getDoc(docRef);
        setUserData(snap.data())
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
      toast.error("Already Saved")
    }
    
  }
  
  useEffect(()=>{
    onAuthStateChanged(auth, async (user)=>{
      if(user){
        setUid(user.uid);
        const docRef = doc(db,"users",user.uid);
        const docSnap = getDoc(docRef);
        if((await docSnap).data().name){
          setName((await docSnap).data().name);
        }
        if((await docSnap).data().bio){
          setBio((await docSnap).data().bio);
        }
        if((await docSnap).data().avatar){
          setImg((await docSnap).data().avatar);
        }
      }
      else{
        navigate('/')
      }
    })
  },[])
  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <img src={assets.goback} alt="" className="goback" onClick={goback}/>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" onChange={(e)=>{
              const file=e.target.files[0];
              if(file){
                setfirst(file);
              }
            }}  id="avatar"  accept='.png, .jpg, .jpeg' hidden />
            <img src={first? URL.createObjectURL(first):(img||assets.avatar_icon)} alt="" />
            upload profile image
          </label>
          <input onChange={(e)=>{
            setName(e.target.value);
          }} value={name} type="text" placeholder='Your name' required/>
          <textarea onChange={(e)=>{setBio(e.target.value)}} value={bio} placeholder='Write profile bio'></textarea>
          <button className='button' type="submit" >Save</button>
        </form>
        <img src={first? URL.createObjectURL(first):(img||assets.logo_big3)} className="profile-pic" alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
