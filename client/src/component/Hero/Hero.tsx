import React, { useEffect, useState } from 'react'
import Rental from './Rental'
import { apiGet } from '../../utils/axios'

// Define a type for Rental data for better type safety
interface RentalData {
  _id: string;
  name: string;
  image: string;
  price: number;
  address: string;
}

interface HeroProps {
  filters: {
    category: string;
    minPrice: string;
    maxPrice: string;
    address: string;
  }
}

const Hero = ({ filters }: HeroProps) => {
  const [rentals, setRentals] = useState<RentalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.address) queryParams.append('address', filters.address);

        const response = await apiGet({ path: `users/properties?${queryParams.toString()}` });
        if (response.data && response.data.properties) {
          setRentals(response.data.properties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-xl font-semibold">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className='py-4 sm:p-5'>
      {rentals.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {rentals.map((rental) => (
            <Rental
              key={rental._id}
              _id={rental._id}
              name={rental.name}
              image={rental.image}
              address={rental.address}
              price={rental.price}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-xl font-semibold text-gray-500">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Hero
