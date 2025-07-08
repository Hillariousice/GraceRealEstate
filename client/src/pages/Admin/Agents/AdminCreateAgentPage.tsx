import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../component/NavBar/NavBar';
import Footer from '../../../component/Footer/Footer';
import { apiPost } from '../../../utils/axios'; // Assuming apiPost handles auth token
import { toast } from 'react-toastify';

interface AgentFormData {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  password?: string; // Password might be optional if server generates one or separate flow
  // confirm_password?: string; // If password is set by admin
}

const AdminCreateAgentPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    companyName: '',
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

    // Basic validation (can be expanded with a library like Yup or Zod)
    if (!formData.password) { // Server's agentSchema requires password
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
      // Endpoint: POST /api/admins/create-agent (server AdminRoutes)
      // apiPost from utils/axios should automatically include the token
      // The server controller `CreateAgent` expects: name, companyName, email, password, phone
      const dataToSubmit = {
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await apiPost({ path: 'admins/create-agent', data: dataToSubmit });
      toast.success('Agent created successfully!');
      navigate('/admin/agents'); // Redirect to agents list page
    } catch (err: any) {
      console.error("Error creating agent:", err);
      const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to create agent.';
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Create New Agent</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
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
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name (Optional)</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
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
                minLength={6} // Example: align with potential server validation
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            {/* <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div> */}
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/agents')}
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
                {isSubmitting ? 'Creating Agent...' : 'Create Agent'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCreateAgentPage;
