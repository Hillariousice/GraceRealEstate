import React from 'react'
import texas from'../../assets/beachhouse.png'
import ohio from'../../assets/coast.jpeg'
import maimi from '../../assets/guild.jpeg'
import ny from '../../assets/rise.jpeg'
import Rental from './Rental'

// Define a type for Rental data for better type safety
interface RentalData {
  _id: string; // Added _id
  name: string;
  image: string; // Should be StaticImageData or string if URL
  price: number;
  address: string;
}

const Hero = () => {
  // Added _id to each rental object
  const rentals: RentalData[] = [
    { _id: "prop1", name: "Texas,USA", image: texas, price: 10000, address: "10th main street" },
    { _id: "prop2", name: "Miami,USA", image: maimi, price: 6000, address: "11th main street" },
    { _id: "prop3", name: "NY,USA", image: ny, price: 9000, address: "12th street" },
    { _id: "prop4", name: "Ohio,USA", image: ohio, price: 4000, address: "13th main street" },
    { _id: "prop5", name: "Texas,USA", image: texas, price: 10000, address: "10th main street" }, // Duplicate _id, should be unique if real data
    { _id: "prop6", name: "Miami,USA", image: maimi, price: 6000, address: "11th main street" },
    { _id: "prop7", name: "NY,USA", image: ny, price: 9000, address: "12th street" },
    { _id: "prop8", name: "Ohio,USA", image: ohio, price: 4000, address: "13th main street" },
    { _id: "prop9", name: "Texas,USA", image: texas, price: 10000, address: "10th main street" },
    { _id: "prop10", name: "Miami,USA", image: maimi, price: 6000, address: "11th main street" },
    { _id: "prop11", name: "Miami,USA", image: maimi, price: 6000, address: "11th main street" }, // Note: IDs should be unique
    { _id: "prop12", name: "NY,USA", image: ny, price: 9000, address: "12th street" },
    { _id: "prop13", name: "Ohio,USA", image: ohio, price: 4000, address: "13th main street" },
    { _id: "prop14", name: "Texas,USA", image: texas, price: 10000, address: "10th main street" },
    { _id: "prop15", name: "Miami,USA", image: maimi, price: 6000, address: "11th main street" },
  ];

  return (
    <div className='py-4 sm:p-5'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {rentals.map((rental) => (
          <Rental
            key={rental._id} // Use _id as key for React list
            _id={rental._id} // Pass _id as a prop
            name={rental.name}
            image={rental.image}
            address={rental.address}
            price={rental.price}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
