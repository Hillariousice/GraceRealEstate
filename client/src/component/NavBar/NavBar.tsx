import React, { useState, useEffect, useRef } from 'react';
import Logo from '../../assets/dove.png';
import { BiWorld, BiUser } from 'react-icons/bi';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import UserDropdown from '../Dropdown/UserDropdown'; // Path is correct now
import { useAuth } from '../../context/authContext';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Get authentication status
  const dropdownRef = useRef<HTMLDivElement>(null); // For detecting clicks outside

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isUserDropdownOpen) setIsUserDropdownOpen(false); // Close user dropdown if mobile menu opens
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false); // Close mobile menu if user dropdown opens
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <div className='border-b sticky top-0 z-50 bg-white/[95%]'>
      <div className="flex justify-between items-center sm:mx-6 md:mx-10 lg:mx-12 relative">
        {/* Logo */}
        <Link to="/" className="h-20 flex items-center"> {/* Logo as Link to home */}
          <img src={Logo} className="object-cover h-[5rem] sm:h-[6rem] lg:h-[7rem]" alt="Dove Logo" />
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex justify-center items-center relative shadow-sm shadow-gray-400 border rounded-full ">
          <input type="search" placeholder="" className="py-2.5 w-[20rem] rounded-full outline-0 pl-6 pr-32" />
          <div className="flex justify-between absolute w-full pr-16 pl-6 font-semibold text-gray-600 pointer-events-none">
            <button className="w-full text-left pointer-events-auto">Place</button>
            <button className="border-l border-x px-6 w-full pointer-events-auto">Time</button>
            <button className="w-full text-gray-600/60 pl-2 text-left pointer-events-auto">Groups</button>
          </div>
          <div className="bg-[#0c0606] p-2 rounded-full mr-2 absolute right-0">
            <FiSearch className="text-white" />
          </div>
        </div>

        {/* Right Section: Desktop */}
        <div className="hidden lg:flex items-center pr-3 font-semibold text-gray-600">
          <p className='text-[17px] font-semibold'>Rent House</p>
          <div className='flex items-center mx-8 gap-1'>
            <BiWorld className='' />
            <div className=''>EN</div>
          </div>
          {/* User Icon and Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleUserDropdown}
              className="flex items-center border px-3 py-1.5 rounded-full gap-2 bg-white hover:shadow-md text-gray-700 transition-shadow"
            >
              <FiMenu className="text-xl" /> {/* Hamburger for user menu consistency */}
              <BiUser className="text-2xl text-gray-600" />
            </button>
            <UserDropdown isOpen={isUserDropdownOpen} toggle={toggleUserDropdown} />
          </div>
        </div>

        {/* Hamburger Menu Icon for Mobile Nav */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-2xl p-2 text-gray-700">
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu / Search Section */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 z-40">
          {/* Mobile Search Bar (simplified) */}
          <div className="flex items-center relative shadow-sm shadow-gray-400 border rounded-full mb-4">
            <input type="search" placeholder="Search..." className="py-2.5 w-full rounded-full outline-0 pl-4 pr-10" />
            <div className="bg-[#0c0606] p-2 rounded-full mr-1 absolute right-0 top-1/2 transform -translate-y-1/2">
              <FiSearch className="text-white" />
            </div>
          </div>

          {/* Mobile Navigation Links/Items */}
          <div className="flex flex-col gap-y-2 items-start font-semibold text-gray-700">
            <Link to="/" onClick={toggleMobileMenu} className='w-full py-2 px-2 hover:bg-gray-100 rounded'>Home</Link>
            <p className='text-[17px] font-semibold w-full py-2 px-2 border-b hover:bg-gray-100 rounded'>Rent House</p> {/* Assuming this is a category, not a link for now */}
            <div className='flex items-center gap-1 w-full py-2 px-2 border-b hover:bg-gray-100 rounded'>
              <BiWorld className='' />
              <div className=''>EN</div>
            </div>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">My Profile</Link>

                {/* Admin/Superadmin specific links for mobile */}
                {(useAuth().user?.role === 'admin' || useAuth().user?.role === 'superadmin') && (
                  <>
                    <Link to="/admin/users" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">Manage Users</Link>
                    <Link to="/admin/agents" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">Manage Agents</Link>
                  </>
                )}
                {/* Superadmin specific link for mobile */}
                {useAuth().user?.role === 'superadmin' && (
                  <Link to="/admin/manage-admins/new" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">Create New Admin</Link>
                )}


                {/* Agent specific links for mobile */}
                {useAuth().user?.role === 'agent' && (
                  <>
                    <Link to="/agent/my-properties" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">My Properties</Link>
                    <Link to="/agent/profile/edit" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">Edit Agent Profile</Link>
                  </>
                )}

                <button onClick={() => { useAuth().logoutUser(); toggleMobileMenu(); }} className="w-full text-left py-2 px-2 text-red-600 hover:bg-gray-100 rounded">Logout</button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">Sign In</Link>
                <Link to="/signup" onClick={toggleMobileMenu} className="w-full py-2 px-2 hover:bg-gray-100 rounded">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;