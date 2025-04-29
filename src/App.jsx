import React from 'react'
import Common_Navbar from './Components/Navbar/Common_Navbar'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import Login from './Pages/SignIn/SignIn.jsx'
import Checkout from './Pages/Checkout/Checkout'
import Addresses from './Pages/Addresses/Addresses'
import Landing from './Pages/Landing/Landing'
import Navbar_Wrapper from './Components/Navbar/Navbar_Wrapper'
import Account_Overview from './Pages/Profile/Account_Overview'
import Account_Info from './Pages/Profile/Account_Info'
import Account_Security from './Pages/Profile/Account_Security'
import SeeAllRestaurants from './Pages/All Restaurants/SeeAllRestaurants.jsx'
import SignIn from './Pages/SignIn/SignIn.jsx'
import Signup from './Pages/Signup/Signup.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import MenuItems from './Components/MenuItems/MenuItems.jsx'
import MyOrders from './Pages/My Orders/MyOrders.jsx'
import Wishlist from './Pages/Wishlist/Wishlist.jsx'
import ItemSearch from './Components/MenuItems/ItemSearch.jsx'
import FilteredItemSearch from './Pages/FilteredItemSearch/FilteredItemSearch.jsx'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
      {/*<Navbar_Wrapper />*/}
      <Routes>
        <Route path='/landing/*' element={<Landing />} />
        <Route path='/' element={<Home />} />
        <Route path='/home/*' element={<Home />} />
        <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path='/addresses/*' element={<Addresses />} />
        <Route path='/overview/*' element={<ProtectedRoute><Account_Overview /></ProtectedRoute>} />
        <Route path='/accountinfo/*' element={<Account_Info />} />
        <Route path='accountsecurity/*' element={<Account_Security />} />
        <Route path='/allrestaurants' element={<SeeAllRestaurants />} />
        <Route path='/login/*' element={<SignIn />} />
        <Route path='/signup/*' element={<Signup />} />
        <Route path='/restaurant/:restaurantID' element={<MenuItems />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/search/:query' element={<ItemSearch />} />
        <Route path='/:categoryName' element={<FilteredItemSearch />} />
      </Routes>
      <ToastContainer
  position="top-center"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
  style={{
    width: "auto",
    maxWidth: "400px",
    padding: "8px 12px",
  }}
  toastStyle={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px 16px 16px",
    minHeight: "60px",
    width: "100%",
    wordBreak: "break-word",
    whiteSpace: "normal",
    fontSize: "16px",
    fontWeight: "500",
    borderRadius: "8px",
    background: "#4caf50",  // optional if you want custom background
    color: "#fff",          // white text
  }}
/>
    </div>
  )
}

export default App
