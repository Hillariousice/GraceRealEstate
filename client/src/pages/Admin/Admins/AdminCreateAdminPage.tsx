import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../component/NavBar/NavBar';
import Footer from '../../../component/Footer/Footer';
import { apiPost } from '../../../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/authContext';

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  // confirm_password?: string;
}

const AdminCreateAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // To check if current user is superadmin (client-side check, server enforces)

  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    // confirm_password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (user?.role !== 'superadmin') {
        toast.error("Only superadmins can create new admins.");
        setIsSubmitting(false);
        return;
    }

    if (!formData.password) { // Server's adminSchema requires password
        toast.error("Password is required.");
        setIsSubmitting(false);
        return;
    }
    // if (formData.password !== formData.confirm_password) {
    //   toast.error("Passwords do not match.");
    //   setIsSubmitting(false);
    //   return;
    // }

    try {
      // Endpoint: POST /api/admins/create-admin (server AdminRoutes)
      // The server controller `CreateAdmin` expects: firstName, lastName, email, password, phone
      const dataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await apiPost({ path: 'admins/create-admin', data: dataToSubmit });
      toast.success('Admin created successfully!');
      // Consider where to navigate: a list of admins? or back to a general admin dashboard?
      // For now, navigating to home or a general admin page (if one existed).
      // Let's assume we want to navigate to an admin user list page if it existed, or /admin/users for now.
      navigate('/admin/users');
    } catch (err: any) {
      console.error("Error creating admin:", err);
      const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to create admin.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side check to render form only if user is superadmin.
  // ProtectedRoute already restricts access to admin/superadmin, but this is an additional UI check.
  if (user?.role !== 'superadmin') {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-red-600">Access Denied: Only superadmins can create new admins.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:underline">Go Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Create New Admin</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
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
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)} // Go back to previous page or a specific admin dashboard
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
                {isSubmitting ? 'Creating Admin...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCreateAdminPage;
