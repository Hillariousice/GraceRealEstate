import React, { useEffect, useState } from 'react';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import Rental from '../../component/Hero/Rental';
import { apiGet } from '../../utils/axios';

interface Property {
  _id: string;
  name: string;
  image: string;
  price: number;
  address: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await apiGet({ path: 'users/favorites' });
        if (response.data && response.data.favorites) {
          setFavorites(response.data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Favorite Properties</h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl">Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((property) => (
              <Rental
                key={property._id}
                _id={property._id}
                name={property.name}
                image={property.image}
                address={property.address}
                price={property.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">You haven't saved any properties yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
