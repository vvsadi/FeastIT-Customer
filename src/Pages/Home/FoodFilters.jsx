import React,{useState, useEffect} from 'react';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight} from 'react-icons/fa';
import veg_icon from '../../assets/Veg.png';
import non_veg_icon from '../../assets/Non Veg.png';
import healthy_icon from '../../assets/Healthy.png';
import sugar_free_icon from '../../assets/Sugar Free.png';
import gluten_free_icon from '../../assets/Gluten Free.png';
import './FoodFilters.css';
import {Link, useNavigate} from 'react-router-dom';

const FoodFilters = () => {
  const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
  useEffect(() => {
    if (!loading) {
      console.log("Login state on this page:", isLoggedIn, userName);
    }
  }, [isLoggedIn, loading]);
  const navigate = useNavigate();  
  const [filters, setFilters] = useState([
    {id: 1, name: 'Veg', icon: veg_icon},
    {id: 2, name: 'Non Veg', icon: non_veg_icon},
    {id: 3, name: 'Healthy', icon: healthy_icon},
    {id: 4, name: 'Sugar Free', icon: sugar_free_icon},
    {id: 5, name: 'Gluten Free', icon: gluten_free_icon}
  ]);  // Store filters from an API call. Replace the JSON code with the API call

  const [startIndex, setStartIndex] = useState(0);
  const totalFiltersVisible = 5;  // Total Filters visible at a time

  const handleNextFilters = () => {
    if (startIndex + totalFiltersVisible < filters.length) {
      setStartIndex(startIndex+1);
    }
  };

  const handlePrevFilters = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex-1)
    }
  };

  const visibleFilters = filters.slice(startIndex,startIndex + totalFiltersVisible);

  return (
    <div className="filters-container">
        <FaArrowCircleLeft size={15} className="left-arrow-button" style={{color: "#000000", cursor: "pointer"}} onClick={handlePrevFilters} disabled={startIndex === 0} />
        {visibleFilters.map((filter) => (
            <div key={filter.id} className="filter-item">
                <button 
                    className="filter-icon-wrapper"
                    style={{
                        backgroundImage: `url(${filter.icon})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        borderRadius: '50px',
                        backgroundColor: 'white',
                        border: '2px solid #ccc',
                    }}
                    onClick={() => navigate(`/${filter.name}`)}
                >
                </button>
                <div className="filter-name">{filter.name}</div>
            </div>
        ))}
        <FaArrowCircleRight size={15} className="right-arrow-button" style={{color: "#000000", cursor: "pointer"}} onClick={handleNextFilters} disabled={startIndex+totalFiltersVisible>=filters.length} />
    </div>
  )}
  export default FoodFilters