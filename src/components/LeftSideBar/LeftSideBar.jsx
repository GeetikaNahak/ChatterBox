import React, { useContext, useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { Navigate, useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const LeftSideBar = () => {
  const navigate=useNavigate();
  const {userData, chatData}=useContext(AppContext);
  const [user,setUser]=useState(null);
  const [showSearch,setShowSearch]=useState(false);
  const [isVisible, setIsVisible] = useState(false);
  

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const inputHandler=async(e)=>{
    try {
      const input=e.target.value;
      if(input){
        setShowSearch(true);
        const userRef=collection(db,'users');
      const q=query(
        userRef,
        where("username","==",input.toLowerCase()),
        
      );
      const querySnap=await getDocs(q);
      if(!querySnap.empty && querySnap.docs[0].data().id!==userData.id){
        let userExist=false
        Array(12).fill("").map((user)=>{
          if(user.rId===querySnap.docs[0].data.id){
            userExist=true;
          }
        })
        if(!userExist){
          setUser(querySnap.docs[0].data());
        }
        
      }
      else{
        setUser(null);
      }
      }
      else{
        setShowSearch(false);

      }
      
    } catch (error) {
      // console.log(error);
      toast.error();
    }
  }

  const addChat=async()=>{
    const messagesRef=collection(db,"messages");
    const chatsRef=collection(db,"chats");
    try{
      const newMessageRef=doc(messagesRef);
      await setDoc(newMessageRef,{
        createAt:serverTimestamp(),
        messages:[]
      })

      await updateDoc(doc(chatsRef,user.id),{
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:userData.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })

      await updateDoc(doc(chatsRef,userData.id),{
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })
      // console.log(chatData)
      console.log(userData);
      console.log(chatData)
    }catch(error){

    }
  }
  
  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo1}  className="logo" />
            <div className="menu">
                <img src={assets.menu_icon} onClick={handleToggle} />
                {
                  isVisible && (
                    <div className="sub-menu">
                  <p onClick={()=>{navigate('/profile')}}>Edit profile</p>
                  <hr />
                  <p>Logout</p>
                </div>
                  )
                }
            </div>
        </div>
        <div className="ls-search">
            <img src={assets.search_icon} alt="" />
            <input onChange={inputHandler} type="text" placeholder='search here ...' />
        </div>
      </div>
      <div className="ls-list">
        {
          showSearch && user?<div onClick={addChat} className='friends add-user'>
            <img src={user.avatar} />
            <p>{user.name}</p>
          </div>
        
        :Array(12).fill().map((item,index)=>(
            <div key={index} className="friends">
            <img src={assets.profile_img} alt="" />
            <div>
                <p>Richard sanford</p>
                <span>Hello! How are you?</span>
            </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default LeftSideBar
