import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import { apiPatch } from '../../utils/axios';
import { toast } from 'react-toastify';

interface AgentProfileFormData {
  name: string; // Full name
  companyName: string;
  phone: string;
  address: string;
  pincode: string;
  email: string; // Display only, or handle email change carefully
}

const EditAgentProfilePage: React.FC = () => {
  const { user, token, isLoading: authLoading } = useAuth(); // Assuming loginUser can refresh user state
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AgentProfileFormData>({
    name: '',
    companyName: '',
    phone: '',
    address: '',
    pincode: '',
    email: '',
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Pre-fill form. Agent data might be directly on user object if role is 'agent'
      // or might need a separate fetch if agent details are stored differently.
      // Assuming agent-specific details might be on the user object or fetched separately.
      // For now, using fields available on the 'User' type from authContext.
      // The server's agentUpdate controller expects 'name', 'companyName', etc.
      setFormData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        companyName: (user as any).companyName || '', // Cast if not in User type
        phone: (user as any).phone || '',
        address: (user as any).address || '',
        pincode: (user as any).pincode || '',
        email: user.email || '',
      });
      setCurrentCoverImageUrl((user as any).coverImage); // Assuming coverImage URL is on user object
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
      setCurrentCoverImageUrl(URL.createObjectURL(e.target.files[0])); // Preview
    } else {
      setCoverImageFile(null);
      // Revert to original image if needed, or handle on submit
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    if (user.role !== 'agent') {
        toast.error("Only agents can update an agent profile."); // Should be caught by ProtectedRoute too
        return;
    }
    setIsSubmitting(true);

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('companyName', formData.companyName);
    submissionData.append('phone', formData.phone);
    submissionData.append('address', formData.address);
    submissionData.append('pincode', formData.pincode);
    // Email is typically not updatable or handled via a separate verification process
    // submissionData.append('email', formData.email);

    if (coverImageFile) {
      submissionData.append('coverImage', coverImageFile);
    }

    try {
      // Endpoint: PATCH /api/agents/update-agent/:agentId
      // agentId is user._id for an agent user
      await apiPatch({ path: `agents/update-agent/${user._id}`, data: submissionData });

      toast.success('Agent profile updated successfully!');
      // TODO: Implement a robust way to refresh user data in authContext
      // For now, redirecting to main profile page, which might show some user details
      navigate('/profile');
    } catch (err: any) {
      console.error("Error updating agent profile:", err);
      toast.error(err.response?.data?.Error || err.response?.data?.message || 'Failed to update agent profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'agent') {
    // ProtectedRoute should handle this, but as a fallback
    navigate(user ? '/' : '/signin'); // Redirect home if logged in but not agent, else to signin
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Edit Agent Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full input-class" />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (cannot be changed)</label>
              <input type="email" name="email" id="email" value={formData.email} readOnly disabled className="mt-1 block w-full input-class bg-gray-100" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input type="text" name="pincode" id="pincode" value={formData.pincode} onChange={handleChange} className="mt-1 block w-full input-class" />
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Profile Picture (Cover Image)</label>
              {currentCoverImageUrl && !coverImageFile && <img src={currentCoverImageUrl.startsWith('blob:') ? currentCoverImageUrl : `${import.meta.env.VITE_SERVER_URL_WITHOUT_API || 'http://localhost:8080'}/${currentCoverImageUrl.replace(/\\/g, '/')}`} alt="Current profile" className="mt-2 mb-2 w-32 h-32 object-cover rounded-full"/>}
              {coverImageFile && <img src={URL.createObjectURL(coverImageFile)} alt="New preview" className="mt-2 mb-2 w-32 h-32 object-cover rounded-full"/>}
              <input type="file" name="coverImage" id="coverImage" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
            <div className="flex justify-end space-x-4 pt-2">
              <button type="button" onClick={() => navigate('/profile')} disabled={isSubmitting} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? 'Saving Profile...' : 'Save Agent Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      {/* Reusing styles from EditPropertyPage for consistency, or define globally */}
      <style>{`
        .input-class { display: block; width: 100%; padding-left: 0.75rem; padding-right: 0.75rem; padding-top: 0.5rem; padding-bottom: 0.5rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .input-class:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); }
        .btn-primary { padding-left: 1.5rem; padding-right: 1.5rem; padding-top: 0.5rem; padding-bottom: 0.5rem; border-width: 1px; border-color: transparent; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; color: white; }
        .btn-primary:disabled { opacity: 0.5; }
        .btn-secondary { padding-left: 1.5rem; padding-right: 1.5rem; padding-top: 0.5rem; padding-bottom: 0.5rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem; font-weight: 500; color: #374151; }
        .btn-secondary:hover { background-color: #F9FAFB; }
        .btn-secondary:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default EditAgentProfilePage;
