import React from 'react'
import Common_Sidebar from './Common_Sidebar'
import './Account_Security.css'
import { useAuth } from '../../Context/AuthContext'

const Account_Security = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
          useEffect(() => {
              if (!loading) {
                  console.log("Login state on this page:", isLoggedIn, userName);
              }
          }, [isLoggedIn, loading]);
  return (
    <div className="account-security-container">
      <Common_Sidebar />
      <div className="account-security-items-container">
        Security...
      </div>
      Account Security
    </div>
  )
}

export default Account_Security
