import React from 'react'
import texas from'../../assets/beachhouse.png'
import ohio from'../../assets/coast.jpeg'
import maimi from '../../assets/guild.jpeg'
import ny from '../../assets/rise.jpeg'
import Rental from './Rental'

const Hero = () => {
  const rentals = [{name:"Texas,USA",image:texas,price:10000,address:"10th main street"},
  {name:"Miami,USA",image:maimi,price:6000,address:"11th main street"},
  {name:"NY,USA",image:ny,price:9000,address:"12th street"},
  {name:"Ohio,USA",image:ohio,price:4000,address:"13th main street"},
  {name:"Texas,USA",image:texas,price:10000,address:"10th main street"},
  {name:"Miami,USA",image:maimi,price:6000,address:"11th main street"},
  {name:"NY,USA",image:ny,price:9000,address:"12th street"},
  {name:"Ohio,USA",image:ohio,price:4000,address:"13th main street"},
  {name:"Texas,USA",image:texas,price:10000,address:"10th main street"},
  {name:"Miami,USA",image:maimi,price:6000,address:"11th main street"},
  {name:"Miami,USA",image:maimi,price:6000,address:"11th main street"},
  {name:"NY,USA",image:ny,price:9000,address:"12th street"},
  {name:"Ohio,USA",image:ohio,price:4000,address:"13th main street"},
  {name:"Texas,USA",image:texas,price:10000,address:"10th main street"},
  {name:"Miami,USA",image:maimi,price:6000,address:"11th main street"},
  ]
  return (
    <div className='py-4 sm:p-5'>
      <div className='grid grid-cols-1  sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
      gap-4' >

    {rentals.map((rental)=>(<Rental name={rental.name}
    image={rental.image} 
    address={rental.address} 
    price={rental.price}
    />))}
      </div>
    </div>
  )
}

export default Hero
