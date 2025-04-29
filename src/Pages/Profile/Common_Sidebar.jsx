import React from 'react';
import './Common_Sidebar.css';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import {useLocation,Link} from 'react-router-dom';
import {useAuth} from '../../Context/AuthContext';
import { useEffect,useState } from 'react';

const Common_Sidebar = () => {
    const location = useLocation();
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
            useEffect(() => {
                if (!loading) {
                    console.log("Login state on this page:", isLoggedIn, userName);
                }
            }, [isLoggedIn, loading]);
    
    return (
        <div className="common-sidebar-navbar">
            <Navbar_Wrapper />
            <div className="manage-account-fields-container">
                <div className="common-sidebar">
                    <div className="overview-container" style={{backgroundColor: location.pathname === "/overview" ? "white" : "#124734", justifyContent:'center',height:"30px",alignItems:'center',width:"100%",display:"flex"}}>
                        <div className="overview-link" style={{alignItems:"center",justifyContent:"center"}}>
                            <Link to="/overview" className="overview" style={{color: location.pathname === "/overview" ? "black" : "white", textAlign:'center'}}>Overview</Link>
                        </div>
                    </div>
                    <div className="account-info-container" style={{backgroundColor: location.pathname === "/accountinfo" ? "white" : "#124734", justifyContent:'center',height:"30px",alignItems:'center',width:"100%",display: "flex"}}>
                        <div className="account-info-link" style={{alignItems:"center",justifyContent:"center"}}>
                            <a href="/accountinfo" className="info" style={{color: location.pathname === "/accountinfo" ? "black" : "white", textAlign: 'center'}}>Account Info</a>
                        </div>
                    </div>
                    <div className="account-security-container" style={{backgroundColor: location.pathname === "/accountsecurity" ? "white" : "#124734", justifyContent:'center',height:"30px",alignItems:'center',width:"100%",display:"flex"}}>
                        <div className="account-security-link" style={{alignItems:"center",justifyContent:"center"}}>
                            <a href="/accountsecurity" className="security" style={{color: location.pathname === "/accountsecurity" ? "black" : "white", textAlign: 'center'}}>Account Security</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Common_Sidebar
