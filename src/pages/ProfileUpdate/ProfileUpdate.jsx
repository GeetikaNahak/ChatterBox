import React from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
const ProfileUpdate = () => {
  return (
    <div className='profile'>
      <div className="profile-container">
        <form action="">
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" name="" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={assets.avatar_icon} alt="" />
            uppload profile image
          </label>
          <input type="text" placeholder='Your name' required/>
          <textarea name="" id="" placeholder='Write profile bio'></textarea>
          <button type="submit">Save</button>
        </form>
        <img src={assets.logo_big3} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate
