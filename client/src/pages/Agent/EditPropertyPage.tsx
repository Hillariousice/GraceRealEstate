import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import { apiGet, apiPatch } from '../../utils/axios';
import { toast } from 'react-toastify';

interface PropertyFormData {
  name: string;
  description: string;
  address: string;
  category: string;
  price: string;
  propertySize?: string;
  condition?: string;
}

// Interface for the fetched property (might include more fields like _id, image URL)
interface Property extends PropertyFormData {
  _id: string;
  image?: string;
}

const EditPropertyPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    address: '',
    category: '',
    price: '',
    propertySize: '',
    condition: '',
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // For initial data load
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("Property ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Endpoint: GET /api/agents/get-property/:propertyId
        const response = await apiGet({ path: `agents/get-property/${propertyId}` });
        if (response.data && response.data.agent) { // Server returns property under 'agent' key
          const propData = response.data.agent as Property;
          setFormData({
            name: propData.name || '',
            description: propData.description || '',
            address: propData.address || '',
            category: propData.category || '',
            price: String(propData.price) || '',
            propertySize: propData.propertySize || '',
            condition: propData.condition || '',
          });
          setCurrentImageUrl(propData.image);
        } else {
          setError("Property not found or data in unexpected format.");
          toast.error("Property not found.");
        }
      } catch (err: any) {
        console.error("Error fetching property:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to fetch property details.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0])); // Preview new image
    } else {
      setImageFile(null);
      // Optionally revert to original image URL if user deselects file, or handle in submit
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!propertyId) {
      toast.error("Property ID is missing.");
      return;
    }
    setIsSubmitting(true);

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('description', formData.description);
    submissionData.append('address', formData.address);
    submissionData.append('category', formData.category);
    submissionData.append('price', formData.price);
    if (formData.propertySize) submissionData.append('propertySize', formData.propertySize);
    if (formData.condition) submissionData.append('condition', formData.condition);

    if (imageFile) {
      submissionData.append('image', imageFile);
    }
    // If no new imageFile, the server should keep the old image if 'image' field is not sent,
    // or handle 'image' field being explicitly set to currentImageUrl if needed by backend.
    // The current server PATCH /agents/updateProperty/:_id uses upload.single('image'),
    // so it expects 'image' if a file is uploaded. If no file, it might keep old or clear it.
    // Best to ensure backend keeps old image if 'image' field is not part of FormData.

    try {
      // Endpoint: PATCH /api/agents/updateProperty/:propertyId
      await apiPatch({ path: `agents/updateProperty/${propertyId}`, data: submissionData });
      toast.success('Property updated successfully!');
      navigate('/agent/my-properties');
    } catch (err: any) {
      console.error("Error updating property:", err);
      const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to update property.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col min-h-screen"><NavBar /><main className="flex-grow container mx-auto px-4 py-8 text-center"><p>Loading property details...</p></main><Footer /></div>
  );
  if (error) return (
    <div className="flex flex-col min-h-screen"><NavBar /><main className="flex-grow container mx-auto px-4 py-8 text-center"><p className="text-red-500">Error: {error}</p><button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:underline">Go Back</button></main><Footer /></div>
  );
  if (!formData.name && !isLoading) return ( // Basic check if formData is not populated after loading
    <div className="flex flex-col min-h-screen"><NavBar /><main className="flex-grow container mx-auto px-4 py-8 text-center"><p>Property data could not be loaded.</p></main><Footer /></div>
  );


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Edit Property</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Property Name / Title</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} required className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full input-class" placeholder="e.g., Apartment, House" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" className="mt-1 block w-full input-class" />
            </div>
             <div>
              <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700">Property Size (e.g., sqft)</label>
              <input type="text" name="propertySize" id="propertySize" value={formData.propertySize} onChange={handleChange} className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition (e.g., New, Used)</label>
              <input type="text" name="condition" id="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Property Image</label>
              {currentImageUrl && !imageFile && <img src={currentImageUrl.startsWith('blob:') ? currentImageUrl : `${import.meta.env.VITE_SERVER_URL_WITHOUT_API || 'http://localhost:8080'}/${currentImageUrl.replace(/\\/g, '/')}`} alt="Current property" className="mt-2 mb-2 w-full max-w-xs h-auto rounded"/>}
              {imageFile && <img src={URL.createObjectURL(imageFile)} alt="New preview" className="mt-2 mb-2 w-full max-w-xs h-auto rounded"/>}
              <input type="file" name="image" id="image" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one.</p>
            </div>
            <div className="flex justify-end space-x-4 pt-2">
              <button type="button" onClick={() => navigate('/agent/my-properties')} disabled={isSubmitting} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary bg-green-600 hover:bg-green-700">
                {isSubmitting ? 'Updating Property...' : 'Update Property'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      {/* Helper CSS for input-class, btn-primary, btn-secondary if not globally defined via Tailwind components */}
      <style>{`
        .input-class {
          display: block;
          width: 100%;
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-width: 1px;
          border-color: #D1D5DB;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .input-class:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
        .btn-primary {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-width: 1px;
          border-color: transparent;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 500;
          color: white;
        }
        .btn-primary:disabled {
          opacity: 0.5;
        }
        .btn-secondary {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-width: 1px;
          border-color: #D1D5DB;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 500;
          color: #374151;
        }
        .btn-secondary:hover {
          background-color: #F9FAFB;
        }
        .btn-secondary:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default EditPropertyPage;
