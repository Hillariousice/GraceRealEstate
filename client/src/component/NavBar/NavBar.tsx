import React, { useState } from 'react'
import Logo from '../../assets/dove.png'
import { BiWorld, BiUser } from 'react-icons/bi'
import { FiMenu, FiSearch, FiX } from 'react-icons/fi' // Added FiX for close icon
import Dropdown from '../Dropdown/Dropdown'

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='border-b sticky top-0 z-50 bg-white/[95%]'>
      <div className="flex justify-between items-center sm:mx-6 md:mx-10 lg:mx-12 relative"> {/* Added relative for mobile menu positioning */}
        {/* Logo */}
        <div className="h-20 flex items-center"> {/* Ensure logo is vertically centered */}
          <img src={Logo} className="object-cover h-[5rem] sm:h-[6rem] lg:h-[7rem]" alt="Dove Logo" /> {/* Responsive logo size, removed negative margin */}
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex justify-center items-center relative shadow-sm shadow-gray-400 border rounded-full ">
          <input type="search" placeholder="" className="py-2.5 w-[20rem] rounded-full outline-0 pl-6 pr-32" /> {/* Adjusted padding for absolute elements */}
          <div className="flex justify-between absolute w-full pr-16 pl-6 font-semibold text-gray-600 pointer-events-none"> {/* pointer-events-none for text overlay */}
            <button className="w-full text-left pointer-events-auto">Place</button> {/* pointer-events-auto for buttons */}
            <button className="border-l border-x px-6 w-full pointer-events-auto">Time</button>
            <button className="w-full text-gray-600/60 pl-2 text-left pointer-events-auto">Groups</button> {/* text-left */}
          </div>
          <div className="bg-[#0c0606] p-2 rounded-full mr-2 absolute right-0"> {/* Position search icon correctly */}
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
          <div className="flex items-center border px-4 py-2 rounded-full gap-2 bg-[#0c0606] text-white shadow-sm shadow-gray-100 hover:bg-gray-500 duration-100 ease-out">
            <span><Dropdown /></span>
            <BiUser className="text-[19px]" />
          </div>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-2xl p-2">
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
          <div className="flex flex-col gap-3 items-start font-semibold text-gray-600">
            <p className='text-[17px] font-semibold w-full pb-2 border-b'>Rent House</p>
            <div className='flex items-center gap-1 w-full pb-2 border-b'>
              <BiWorld className='' />
              <div className=''>EN</div>
            </div>
            <div className="flex items-center border px-4 py-2 rounded-full gap-2 bg-[#0c0606] text-white shadow-sm shadow-gray-100 hover:bg-gray-500 duration-100 ease-out w-full justify-center">
              <span><Dropdown /></span>
              <BiUser className="text-[19px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar