// import React from 'react'
import Filters from '../../component/Filters/Filters'
 import Footer from '../../component/Footer/Footer'
 import Hero from '../../component/Hero/Hero'
import NavBar from '../../component/NavBar/NavBar'

const Home = () => {
  return (
    <div>
      <div className='sm:mx-6 md:mx-10 lg:mx-12'>
       <NavBar/>
    </div>
    <div className=' sm:mx-6 md:mx-10 lg:mx-12  px-3 '>
   
      <Filters/>

    
      <Hero/>
   
    </div>
   
     <div>
      <Footer/>
     </div>
    </div>
  )
}

export default Home