import React, { useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import firebase from 'firebase/compat/app';
const ProfileUpdate = () => {

  // const [image,setImage] = useState(false);
  const [first, setfirst] = useState(null);

  return (
    <div className='profile'>
      <div className="profile-container">
        <form action="">
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" onChange={(e)=>{
              const file=e.target.files[0];
              if(file){
                setfirst(file);
              }
            }}  id="avatar"  accept='.png, .jpg, .jpeg' hidden />
            <img src={first? URL.createObjectURL(first):assets.avatar_icon} alt="" />
            uppload profile image
          </label>
          <input type="text" placeholder='Your name' required/>
          <textarea name="" id="" placeholder='Write profile bio'></textarea>
          <button type="submit">Save</button>
        </form>
        <img src={first? URL.createObjectURL(first):assets.logo_big3} className="profile-pic" alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
