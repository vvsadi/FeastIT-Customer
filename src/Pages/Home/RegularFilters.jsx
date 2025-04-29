import React,{useState, useEffect} from 'react';
import Common_Navbar from '../../Components/Navbar/Common_Navbar';
import {useAuth} from '../../Context/AuthContext';
//import {useAddress} from '../../Context/AddressContext';
import Navbar_Wrapper from '../../Components/Navbar/Navbar_Wrapper';
import home_page_cover_image from '../../assets/Header_Image_New.jpg'
import {FaBars, FaTimes, FaSearch, FaMapMarkerAlt, FaAngleDown, FaShoppingCart, FaArrowCircleLeft, FaArrowCircleRight} from 'react-icons/fa';
import './RegularFilters.css';
import {Link, useNavigate} from 'react-router-dom';

const RegularFilters = () => {
    const {isLoggedIn, userName, userId, address, setAddress, login, logout,loading} = useAuth();
            useEffect(() => {
                if (!loading) {
                    console.log("Login state on this page:", isLoggedIn, userName);
                }
            }, [isLoggedIn, loading]);
    const navigate = useNavigate();
    const [filters, setFilters] = useState([
        {id: 1, name: 'Offers'},
        {id: 2, name: 'Dietary'},
        {id: 3, name: 'Price'},
        {id: 4, name: 'Rating'}
      ]);
      const [startIndex, setStartIndex] = useState(0);
        const totalFiltersVisible = 4;  // Total Filters visible at a time
      
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
                    <FaArrowCircleLeft size={24} className="left-arrow-button" style={{color: "#000000", cursor: "pointer"}} onClick={handlePrevFilters} disabled={startIndex === 0} />
                    {visibleFilters.map((filter) => (
                        <div key={filter.id} className="filter-item">
                            <button 
                                className="filter-icon-wrapper"
                                style={{
                                    
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    width: 'fit-content',
                                    height: 'fit-content',
                                    cursor: 'pointer',
                                    borderRadius: '50px',
                                    backgroundColor: '#124734',
                                    color: 'white'
                                }}
                                onClick={() => navigate(`/${filter.name}`)}
                            >{filter.name}
                            </button>
                        </div>
                    ))}
                    <FaArrowCircleRight size={5} className="right-arrow-button" style={{color: "#000000", cursor: "pointer"}} onClick={handleNextFilters} disabled={startIndex+totalFiltersVisible>=filters.length} />
                </div>
        )
}
export default RegularFilters