import React from "react";
import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom"; 
import bgImage from "../../assets/LoginBackground.png"; 
import "./Signup.css"; 
import logo from "../../assets/DCP_Logo.png"; 

const Signup = () => {

  const navigate = useNavigate();
  const [serverMessage,setServerMessage] = useState('');
  const [formData, setFormData] = useState({
    customer_name:'',
    email:'',
    password:'',
    phone:'',
    address_line_1:'',
    city:'',
    state:'',
    zip_code:'',
  });

  const handleChange = (e) => {
    const {name,value} = e.target;
    setFormData(prev => ({...prev,[name]:value}))
  }

const handleSubmit = async (event) => {
  event.preventDefault(); 
  const fullAddress = `${formData.address_line_1}, ${formData.city}, ${formData.state}, ${formData.zip_code}`
  const payload = {
    customer_name: formData.customer_name,
    customer_email: formData.email,
    customer_password: formData.password,
    customer_phone: formData.phone,
    customer_address: fullAddress
  };
  try{
    const res = await fetch('http://localhost:5000/api/signup',{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (res.ok){
      alert("Registration complete!");
      navigate("/login");
    } else if (res.status === 409) {
      //alert("User already exists");
      setServerMessage("User already exists...")
    } else {
      const err = await res.json();
      alert("Registration failed: "+err.message);
    }
  } catch (error) {
    console.error("Registration error: ",error)
    alert("An error occurred!")
  }
};

  return (
    
    <div className="signup-page" style={{ backgroundImage: `url(${bgImage})` }}>
      
      {/* Content Section */}
      <div className="signup-container">
      <span>
        <h2 className="customer-title">Customer Registration</h2>
        <h3 className="customer-subtitle">Sign Up as a customer</h3>
      </span>
      <div className="signup-background-box">
        {/* Form */}
        {serverMessage && (
          <div className="server-message">{serverMessage}</div>
        )}
          <form className="signup-form" onSubmit={handleSubmit}>
            
            {/* Customer Name */}
            <div className="form-group">
              <label>Customer Name</label>
              <input type="text" name="customer_name" placeholder="Enter the your name" className="signup-input" onChange={handleChange} required/>
            </div>

            {/* Address */}
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address_line_1" placeholder="Address Line 1" className="address-signup-input" onChange={handleChange} required/>
              <div className="grid-container">
                <input type="text" name="city" placeholder="City" className="two-column-input" onChange={handleChange} required/>
                <input type="text" name="state" placeholder="Region" className="two-column-input" onChange={handleChange} required/>
              </div>
              <div className="grid-container">
                <input 
                  type="text"
                  name="zip_code" 
                  placeholder="Postal / Zip code" 
                  className="two-column-input"
                  pattern="[0-9]{5}"  /* Allows exactly 10 digits only */
                  maxLength="5"       /* Prevents entering more than 10 digits */
                  inputMode="numeric"  /* Optimizes mobile keyboard for numbers */
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} /* Blocks non-numeric input */
                  onChange={handleChange}
                  required 
                />
                <input type="text" value="United States" disabled className="two-column-input"/>
              </div>
            </div>

            {/* Contact Name 
            <div className="grid-container">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="First Name" className="two-column-input"required/>
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Last Name" className="two-column-input"required/>
              </div>
            </div> */}

            {/* Email Address */}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="John.doe@example.com" className="signup-input" onChange={handleChange} required/>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                  type="tel"
                  name="phone" 
                  placeholder="Enter your phone number" 
                  className="signup-input"
                  pattern="[0-9]{10}"  /* Allows exactly 10 digits only */
                  maxLength="10"       /* Prevents entering more than 10 digits */
                  inputMode="numeric"  /* Optimizes mobile keyboard for numbers */
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} /* Blocks non-numeric input */
                  onChange={handleChange}
                  required 
                />


            </div>

            
            {/* Password Fields */}
            <div className="grid-container">
              <div className="form-group">
                <label>Password</label>
                <input 
                      type="password"
                      name="password" 
                      placeholder="Create password" 
                      className="two-column-input" 
                      id="password" 
                      onChange={handleChange}
                      required 
                    />              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm password" 
                  className="two-column-input" 
                  id="confirmPassword" 
                  onInput={(e) => e.target.setCustomValidity(e.target.value !== document.getElementById('password').value ? 'Passwords do not match' : '')} 
                  required 
                />
              </div>
            </div>

           {/* Terms and Submit */}
            <button type="submit" className="submit-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
