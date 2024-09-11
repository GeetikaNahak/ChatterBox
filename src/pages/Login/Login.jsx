import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup,login } from '../../config/firebase'


const Login = () => {
    const [currState,setCurrState] =useState("Sign up");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = (event) =>{
      event.preventDefault();
      console.log("Form submitted");  // Check if this logs
      if(currState==="Sign up"){
        signup(userName,email,password);
      }
      else{
        login(email,password)
      }
    }

    const toggleOption = ()=>{
      if(currState==="Sign up")setCurrState("Login");
      else setCurrState("Sign up");
    }
  return (
    <div className='login'>
      <img src={assets.logo_big2} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className="login_form">
        <h2>{currState}</h2>
        {currState==="Sign up"?<input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text" placeholder="UserName" required className="form-input" />:null}
        
        <input type="text" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="Email" required className="form-input" />
        <input type="text" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Password" required className="form-input" />
        <button>{currState==="Sign up"?"Create Account":"Login"}</button>
        <div className="login-term">
          <input type="checkbox" />
          {currState==="Sign up"?<p>agree to the terms of use & privacy policy</p>:<p>Remember me   </p>}
        </div>
        <div className="login-forget">
          {
          currState==="Sign up"?
          <p className="login-toggle">Already a User? <span onClick={toggleOption}>Login</span></p>:
          <p className="login-toggle">Create an Account? <span onClick={toggleOption}>Sign up</span></p>
          }

        </div>
      </form>
    </div>
  )
}

export default Login
