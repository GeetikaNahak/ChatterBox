import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import upload from '../../lib/upload'
const ChatBox = () => {

  const {userData,chatData,messagesId,chatUser,messages,setMessages}=useContext(AppContext);
  const [input,setInput]=useState("");
  const sendMessage=async()=>{
    try {
      if(input && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages: arrayUnion({
            sId:userData.id,
            text:input,
            createdAt:new Date()
          })
        })
        const userIDs=[chatUser.rId,userData.id];
        userIDs.forEach(async(id)=>{
          const userChatRef=doc(db,'chats',id);
          const userChatSnapshot=await getDoc(userChatRef);
          if(userChatSnapshot.exists()){
            const userChatData=userChatSnapshot.data();
            const chatIndex=userChatData.chatsData.findIndex((c)=>c.messageId===messagesId);
            userChatData.chatsData[chatIndex].lastMessage=input.slice(0,30);
            userChatData.chatsData[chatIndex].updatedAt=Date.now();
            if(userChatData.chatsData[chatIndex].rId===userData.id){
              userChatData.chatsData[chatIndex].messageSeen=false;
            }
            await updateDoc(userChatRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message);
    }
    console.log(messages);
    setInput("");
  }

  const sendImage=async (e)=>{
    try {
      const fileUrl=await upload(e.target.files[0]);
      if(fileUrl && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages:arrayUnion({
            sId:userData.id,
            image:fileUrl,
            createdAt:new Date()
          })
        })
        const userIDs=[chatUser.rId,userData.id];
        userIDs.forEach(async(id)=>{
          const userChatRef=doc(db,'chats',id);
          const userChatSnapshot=await getDoc(userChatRef);
          if(userChatSnapshot.exists()){
            const userChatData=userChatSnapshot.data();
            const chatIndex=userChatData.chatsData.findIndex((c)=>c.messageId===messagesId);
            userChatData.chatsData[chatIndex].lastMessage="image";
            userChatData.chatsData[chatIndex].updatedAt=Date.now();
            if(userChatData.chatsData[chatIndex].rId===userData.id){
              userChatData.chatsData[chatIndex].messageSeen=false;
            }
            await updateDoc(userChatRef,{
              chatsData:userChatData.chatsData
            })
          }
        })
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    if(messagesId){
      const unsub= onSnapshot(doc(db,'messages',messagesId),(res)=>{
        setMessages(res.data().messages.reverse());
        // console.log("print")
        // console.log(res.data().messages);
      })
      return ()=>{
        unsub();
      }
    }
  },[messagesId])
  // console.log(chatUser.userData.username)
  return chatUser?(
    <div className='chat-box'>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img src={assets.green_dot} className='dot' alt="" /></p>
        <img src={assets.help_icon} alt="" />
      </div>
      <div className="chat-msg">
        {messages.map((msg,index)=>{
          return (<div key={index} className={msg.sId===userData.id?"s-msg":"r-msg"}>
          <p className='msg'>{msg.text}</p>
          <div>
            <img src={msg.sId===userData.id?userData.avatar:chatUser.userData.avatar} alt="" />
            <p>{new Date(msg.createdAt.seconds*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p>
          </div>
        
        </div>);
        })}
        
        

      </div>

      <div className="chat-input">
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='send a message' />
        <input onChange={sendImage} type="file" id="image" accept='image/png, image/jpeg' hidden/>
        <label htmlFor="image">
          <img src={assets.image_regular} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ): <div className="chat-welcome">
    <img src={assets.logo_big3} alt="" />
    <p>chat anytime, anywhere</p>
  </div>
}

export default ChatBox
