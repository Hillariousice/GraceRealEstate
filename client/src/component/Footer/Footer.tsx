import React from 'react'
import Logo from '../../assets/dove.png'

import {BsTwitter,BsInstagram,BsFacebook} from 'react-icons/bs'
import {FaSnapchatGhost} from 'react-icons/fa'





const Footer = () => {
  const icons = [ <BsFacebook/>,
  <BsTwitter/>,
  <BsInstagram/>,
  <FaSnapchatGhost/>
  ]
  return (
    <div  className=' bg-black border-t-2 shadow-md shadow-gray-300
    sticky bottom-0 h-20 w-full flex items-center justify-center gap-6'>

   {icons.map((icon)=>(
    <div className='text-[30px] text-white hover:text-gray-300 duration-100 ease-out'>{icon}</div>
   ))}
    </div>
    );
};

export default Footer;