import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import { apiPost } from '../../utils/axios'; // Assuming apiPost handles auth token & FormData
import { toast } from 'react-toastify';
// import { useAuth } from '../../context/authContext'; // For agentId if needed, but server gets from token

interface PropertyFormData {
  name: string;
  description: string;
  address: string;
  category: string;
  price: string; // Keep as string for input, convert to number before sending if API expects number
  // propertySize?: string; // Add if these are part of creation form
  // condition?: string;
}

const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // To get agentId if server didn't use req.user._id

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    address: '',
    category: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!imageFile) {
      toast.error("Please select an image for the property.");
      setIsSubmitting(false);
      return;
    }

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('description', formData.description);
    submissionData.append('address', formData.address);
    submissionData.append('category', formData.category);
    submissionData.append('price', formData.price); // Server will parse, or convert here if needed
    submissionData.append('image', imageFile);
    // Add other fields like propertySize, condition if they are part of FormData

    try {
      // Endpoint: POST /api/agents/create-property (server AgentRoutes)
      // apiPost from utils/axios should automatically include the token
      // Server controller `CreateProperty` uses `req.agent._id` which should now be `req.user._id`
      await apiPost({ path: 'agents/create-property', data: submissionData });
      toast.success('Property created successfully!');
      navigate('/agent/my-properties'); // Redirect to agent's properties list
    } catch (err: any) {
      console.error("Error creating property:", err);
      const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to create property.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">List New Property</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Property Name / Title</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input // Consider making this a select dropdown with predefined categories
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Apartment, House, Villa"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number" // Use type="text" if you need to allow commas, then parse
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Property Image</label>
              <input
                type="file"
                name="image"
                id="image"
                onChange={handleFileChange}
                accept="image/*"
                required
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/agent/my-properties')}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Property...' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePropertyPage;
