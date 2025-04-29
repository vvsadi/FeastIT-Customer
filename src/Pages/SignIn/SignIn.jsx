import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./SignIn.css";
import logo from "../../assets/DCP_Logo.png";
import { useAuth } from '../../Context/AuthContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login, logout} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempted with:', username, password);
    try {
        await login(username,password);
        navigate('/');
    }
    catch (error){
      console.error("Error during login: ",error);
      alert("Login Failed, error during login, username= ",username);
    }
  };

  return (
    <div className="signin-container">
      <Navbar_Wrapper />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="background-box">
            <span>
              <p className='h1'>Welcome back!</p>
              <p className='h2'>Enter your Credentials to access your account</p>
            </span>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Customer ID</label>
                <input
                  type="text"
                  id="username"
                  placeholder="email@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Link to="/forgotpass" className="link">forgot password?</Link>
              </div>
              <button type="submit">Login</button>
              <div className='signup-link'>
                Don't have an account? 
                <Link to="/signUp" className="link"> Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
    </div>
)}




export default SignIn;
