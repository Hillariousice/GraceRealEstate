import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import { apiPatch } from '../../utils/axios'; // Using apiPatch for PATCH requests
import { toast } from 'react-toastify';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  // gender: string; // Assuming gender is not typically user-editable or handled differently
  // coverImage: File | null; // For file uploads
}

const EditProfilePage: React.FC = () => {
  const { user, token, isLoading: authLoading, loginUser } = useAuth(); // Assuming loginUser can refresh user state
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    // gender: '',
    // coverImage: null,
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null); // For displaying form-specific errors

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: (user as any).phone || '', // Assuming phone might not be in base User type
        address: (user as any).address || '',
        // gender: (user as any).gender || '',
      });
      // Note: coverImage is not pre-filled as it's a file input
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    } else {
      setCoverImageFile(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }
    setIsSubmitting(true);
    // setError(null);

    // Use FormData for multipart/form-data if sending files
    const submissionData = new FormData();
    submissionData.append('firstName', formData.firstName);
    submissionData.append('lastName', formData.lastName);
    submissionData.append('phone', formData.phone);
    submissionData.append('address', formData.address);
    // submissionData.append('gender', formData.gender);
    if (coverImageFile) {
      submissionData.append('coverImage', coverImageFile);
    }

    try {
      // The userController.userUpdate expects /updateUser/:_id
      // Assuming API_BASE_URL in utils/axios includes /api
      const response = await apiPatch({ path: `users/updateUser/${user._id}`, data: submissionData });

      toast.success('Profile updated successfully!');

      // Refresh user data in authContext - tricky if apiPatch doesn't return full user
      // A better way is for loginUser or a new fetchUser function in authContext to update it.
      // For now, we can try to update parts of it or re-fetch.
      // A simple approach if the response contains the updated user:
      if (response.data && response.data.user) {
         // This depends on how loginUser is implemented to update localStorage and context state
         // A dedicated updateUserInContext function would be better in authContext.
         // For now, this is a placeholder for refreshing user state.
        const updatedUser = { ...user, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Trigger a re-fetch or update in authContext if available, e.g. by calling a modified loginUser or a new function
        // This is a simplified way to update the local user state, might need a proper context update function.
        // For a quick refresh, if loginUser takes the user object:
        // loginUser(updatedUser); // This is not how loginUser is defined, just an idea
      }


      navigate('/profile');
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.Error || err.response?.data?.message || 'Failed to update profile.');
      // setError(err.response?.data?.Error || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  if (!user) {
    // Should be handled by ProtectedRoute, but good to have a fallback.
    navigate('/signin');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                id="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Profile Picture (Cover Image)</label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {/* {error && <p className="text-sm text-red-600">{error}</p>} */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfilePage;
