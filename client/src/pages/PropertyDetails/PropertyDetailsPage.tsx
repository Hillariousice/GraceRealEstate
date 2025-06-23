import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import axios from '../../utils/axios'; // Import configured axios instance

// Define a type for the property data, adjust as per actual data structure
interface Property {
  _id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  price: number | string;
  image: string; // Assuming a single image URL for now, might be an array
  propertySize?: string;
  condition?: string;
  agentId?: { // Assuming agent details might be populated
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  // Add other relevant fields
}

const PropertyDetailsPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setError("Property ID is missing.");
      setLoading(false);
      return;
    }

    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming server API is prefixed with /api and user routes are under /users
        // The actual property data is nested under an 'agent' key based on propertyGet controller
        const response = await axios.get(`/users/property/${propertyId}`);
        if (response.data && response.data.agent) { // Controller returns { message, agent (this is the property) }
          setProperty(response.data.agent);
        } else if (response.data && response.data.message === "Property not found"){ // Handle explicit not found from server
          setError("Property not found.");
          setProperty(null);
        }
        else {
          // Handle cases where data.agent might be missing but no explicit error message
          console.warn("Property data not found in expected format:", response.data);
          setError("Property details could not be loaded.");
          setProperty(null);
        }
      } catch (err: any) {
        console.error("Error fetching property details:", err);
        if (err.response && err.response.status === 404) {
          setError("Property not found.");
        } else if (err.response && err.response.data && err.response.data.Error) {
          setError(err.response.data.Error);
        }
         else {
          setError("Failed to fetch property details. Please try again later.");
        }
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center text-red-600">
          <p className="text-xl">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div>
        <NavBar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Property not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Basic UI structure - to be expanded in step 4
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">{property.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="md:col-span-2">
            <img
              src={property.image}
              alt={`View of ${property.name}`}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-6"
            />
          </div>

          {/* Price and Agent Info Section (Sidebar on md+) */}
          <div className="md:col-span-1">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <p className="text-3xl font-bold text-blue-600 mb-4">${property.price}</p>
              <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded mb-4 transition duration-150 ease-in-out">
                Request Info
              </button>
              {property.agentId && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Contact Agent</h3>
                  <p className="text-gray-600"><strong>Name:</strong> {property.agentId.name}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {property.agentId.email}</p>
                  <p className="text-gray-600"><strong>Phone:</strong> {property.agentId.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Section (Below image on mobile, beside price/agent on md+) */}
          <div className="md:col-span-2">
             <h2 className="text-2xl font-semibold text-gray-700 mb-3">Property Details</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{property.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <strong className="text-gray-600">Address:</strong>
                <p className="text-gray-800">{property.address}</p>
              </div>
              <div>
                <strong className="text-gray-600">Category:</strong>
                <p className="text-gray-800">{property.category}</p>
              </div>
              {property.propertySize && (
                <div>
                  <strong className="text-gray-600">Size:</strong>
                  <p className="text-gray-800">{property.propertySize}</p>
                </div>
              )}
              {property.condition && (
                <div>
                  <strong className="text-gray-600">Condition:</strong>
                  <p className="text-gray-800">{property.condition}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
