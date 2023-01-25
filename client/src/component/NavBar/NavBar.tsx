import React from 'react'
import Logo from '../../assets/airbnb-logo.png'
import RiGlobalLine from 'react-icons'
import Navbar from './NavBar.module.css'


const NavBar = () => {
  return (
    <>
    <div>
        <div className={Navbar.container}>
            <img src={Logo}/>
        </div>
        <div>
    <p>Home</p>
    <p>About Us</p>
    <p>Contact Us</p>
    <RiGlobalLine/>
        </div>
    </div>
    </>
  )
}

export default NavBar