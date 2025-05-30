import React, { useContext, useEffect, useState } from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
const RightSideBar = () => {
  const {chatUser,messages}=useContext(AppContext);
  // console.log(chatUser)
  const [msgImages,setMsgImages]=useState([]);
  useEffect(()=>{
    let tempVar=[];
    messages.map((msg)=>{
      if(msg.image){
        tempVar.push(msg.image)
      }
    })
    console.log(tempVar)
    setMsgImages(tempVar)
  })
  //  console.log(tempVar)
  return chatUser?(
    <div className='rs'>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{Date.now()-chatUser.userData.lastSeen<=70000?<img src={assets.green_dot} className='dot' alt="" />:null}{chatUser.userData.name}</h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>media</p>
        <div>

          {msgImages.map((url,index)=>(<img key={index} src={url} alt="" onClick={()=>window.open(url)}/>))}

          
        </div>
      </div>
      <button onClick={()=>{logout()}}>logout</button>
    </div>
  ):
  (
    <div className="rs">
      <button onClick={()=>logout()}>Logout</button>
    </div>
  )
}

export default RightSideBar
