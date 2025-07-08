import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import { apiGet, apiDelete } from '../../utils/axios'; // Import apiDelete
import { toast } from 'react-toastify';
// import { useAuth } from '../../context/authContext';

// Define an interface for Property data (can be shared or more specific)
interface Property {
  _id: string;
  name: string;
  address: string;
  price: number | string;
  category?: string;
  image?: string; // Assuming image is a URL
  // Add other relevant fields from your PropertyModel
  description?: string;
  propertySize?: string;
  condition?: string;
}

const MyPropertiesPage: React.FC = () => {
  // const { user } = useAuth(); // Agent's user object from context
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // Endpoint: GET /api/agents/get-all-property (server AgentRoutes)
        // This endpoint is protected by authAgent and controller now filters by agentId
        const response = await apiGet({ path: 'agents/get-all-property' });

        // Server controller now returns { message: "...", properties: [...] }
        if (response.data && response.data.properties) {
          setProperties(response.data.properties);
        } else {
          setProperties([]);
          // toast.info('No properties found or data in unexpected format.');
        }
      } catch (err: any) {
        console.error("Error fetching properties:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to fetch properties.';
        setError(errorMessage);
        toast.error(errorMessage);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm(`Are you sure you want to delete this property (${propertyId})? This action cannot be undone.`)) {
      try {
        // Endpoint: DELETE /api/agents/deleteProperty/:propertyId
        await apiDelete({ path: `agents/deleteProperty/${propertyId}` });
        toast.success(`Property ${propertyId} deleted successfully.`);
        // Update properties list by filtering out the deleted property
        setProperties(prevProperties => prevProperties.filter(property => property._id !== propertyId));
      } catch (err: any) {
        console.error("Error deleting property:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to delete property.';
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Loading your properties...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-red-600">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Properties</h1>
            <Link
              to="/agent/properties/new"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Add New Property
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="text-gray-600">You haven't listed any properties yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${property.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{property.category || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/agent/properties/edit/${property._id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete property"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPropertiesPage;
