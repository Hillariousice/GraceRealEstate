import React from 'react'
import Logo from '../../assets/dove.png'
import {BiWorld,BiUser} from 'react-icons/bi'
import {FiMenu,FiSearch} from 'react-icons/fi'
import Dropdown from '../Dropdown/Dropdown'



const NavBar = () => {
  return (
    <div className='border-b sticky top-0 z-50 bg-white/[95%]'>
      <div className="flex justify-between items-center sm:mx-6 md:mx-10 lg:mx-12 ">
    <div className=" h-20 flex">
      <img src={Logo} className=" 
      object-cover  -my-10  h-[9rem]"/>
    </div>
    <div className="hidden lg:flex justify-center  items-center relative shadow-sm shadow-gray-400 border rounded-full ">
      <input type="search" placeholder=""className="py-2.5 w-[20rem] rounded-full outline-0"/>
      <div className="flex justify-between absolute w-full pr-16 pl-6 font-semibold text-gray-600">
        <button className="w-full">Place</button>
        <button className="border-l border-x px-6 w-full">Time</button>
        <button className="w-full text-gray-600/60 pl-2">Groups</button>
      </div>
     <div className="bg-[#0c0606] p-2 rounded-full mr-2">
      <FiSearch className="text-white"/>
     </div>
    </div>
    <div className="flex items-center pr-3 font-semibold text-gray-600">
        
        <p className='text-[17px] font-semibold'>Rent House</p>

        <div className='flex items-center mx-8 gap-1'>
        <BiWorld className=''/>
        <div className=''>EN</div>
        </div>
        <div className="flex items-center border px-4 py-2 rounded-full gap-2 bg-[#0c0606] text-white  shadow-sm shadow-gray-100 hover:bg-gray-500
        duration-100 ease-out">
          
        <span><Dropdown/></span> 
          <BiUser className="text-[19px]"/>
      </div>
      </div>
      
   </div>
    </div>
   
   
 )
}

export default NavBar