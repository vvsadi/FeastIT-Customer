import React, {useState,useEffect} from 'react'
import Common_Sidebar from './Common_Sidebar'
import './Account_Overview.css'
import {useAuth} from '../../Context/AuthContext'
const Account_Overview = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
          useEffect(() => {
              if (!loading) {
                  console.log("Login state on this page:", isLoggedIn, userName);
              }
          }, [isLoggedIn, loading]);
  const [accountName,setAccountName] = useState(userName);
  useEffect(() => {
    // Check if the user is logged in
    if(isLoggedIn){
      if(!accountName){
        setAccountName(userName)
      }
    }
  }, [isLoggedIn,userName])
  return (
    <div className="account-overview-container">
      <Common_Sidebar />
      <div className="account-overview-items-container">
        <h2 className="welcome-title" style={{paddingLeft: "20px", color: "black"}}>Welcome {accountName},</h2>  {/* Need to update the name with an API call and display the name of the user that is logged in*/}
        <p className="description" style={{paddingLeft: "20px", color: "black"}}>Manage your account info, security, privacy, and data</p>
      </div>
      Account Overview
    </div>
  )
}

export default Account_Overview
