import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../../context/authContext';
import NavBar from '../../component/NavBar/NavBar'; // Assuming NavBar should be on this page
import Footer from '../../component/Footer/Footer';   // Assuming Footer should be on this page

// Interface for form data, matching RegisterData in authContext
interface SignupFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  phone?: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: ''
  });
  const { registerUser, isLoading } = useAuth(); // Use registerUser and isLoading

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation, can be enhanced
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!"); // Replace with toast notification
      return;
    }
    if (formData.email && formData.password && formData.firstName && formData.lastName && formData.phone) {
      await registerUser(formData);
      // Navigation is handled within registerUser in authContext (redirects to signin)
      // setFormData({ firstName: '', lastName: '', email: '', password: '', confirm_password: '', phone: '' }); // Clear form if needed
    } else {
      alert("Please fill in all required fields."); // Replace with toast
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white shadow-xl rounded-xl p-8 md:p-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="First Name"
                       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} placeholder="Last Name"
                       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="Email address"
                       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
               <div>
                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" required value={formData.phone} onChange={handleChange} placeholder="Phone Number"
                       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} placeholder="Password"
                       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="confirm_password" className="sr-only">Confirm Password</label>
                <input id="confirm_password" name="confirm_password" type="password" autoComplete="new-password" required value={formData.confirm_password} onChange={handleChange} placeholder="Confirm Password"
                       className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;

