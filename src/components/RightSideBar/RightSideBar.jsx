import React from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
const RightSideBar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.pic1} alt="" />
        <h3>Richard Sanford <img src={assets.green_dot} className='dot' alt="" /></h3>
        <p>Hey there! I am using ChatterBox</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic1} alt="" />
        </div>
      </div>
      <button onClick={()=>{logout()}}>logout</button>
    </div>
  )
}

export default RightSideBar
