import React from 'react';
import Common_Sidebar from './Common_Sidebar';
import './Account_Info.css';
import {FaUserCircle} from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';

const Account_Info = () => {
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
    <div className="account-info-container">
      <Common_Sidebar />
      <div className="account-info-items-container">
        <div className="profile-icon">
          <FaUserCircle size={100} className="profile" style={{color: "grey", paddingLeft: "20px", paddingTop: "20px"}}></FaUserCircle>
        </div>
        <div className="name-container" style={{color: "grey", borderRadius: "40px"}}>
          <p className="name-title" style={{color: "black", paddingLeft: "20px"}}>Name</p>
          <p className="name-value" style={{color: "black", paddingLeft: "20px"}}>{userName}</p> {/*Get name value from API call and update this line*/}
        </div>
      </div>
      Account Info
    </div>
  )
}

export default Account_Info
