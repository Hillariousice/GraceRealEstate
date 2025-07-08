import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by ProtectedRoute,
    // but as a fallback or if isLoading was false too soon.
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl">User not found. Please log in.</p>
          <Link to="/signin" className="text-blue-500 hover:underline">Go to Login</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Assuming user object has: firstName, lastName, email, role. Add phone, address if available.
  // The User interface in authContext may need to be updated if more fields are expected from login.
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">My Profile</h1>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row">
              <strong className="sm:w-1/3 text-gray-600">First Name:</strong>
              <p className="sm:w-2/3 text-gray-800">{user.firstName || 'N/A'}</p>
            </div>
            <div className="flex flex-col sm:flex-row">
              <strong className="sm:w-1/3 text-gray-600">Last Name:</strong>
              <p className="sm:w-2/3 text-gray-800">{user.lastName || 'N/A'}</p>
            </div>
            <div className="flex flex-col sm:flex-row">
              <strong className="sm:w-1/3 text-gray-600">Email:</strong>
              <p className="sm:w-2/3 text-gray-800">{user.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row">
              <strong className="sm:w-1/3 text-gray-600">Role:</strong>
              <p className="sm:w-2/3 text-gray-800 capitalize">{user.role}</p>
            </div>
            {/* Add more fields as available and needed, e.g., phone, address */}
            {/* Example for a field that might not be in the initial User interface from authContext */}
            {/* <div className="flex flex-col sm:flex-row">
              <strong className="sm:w-1/3 text-gray-600">Phone:</strong>
              <p className="sm:w-2/3 text-gray-800">{(user as any).phone || 'N/A'}</p>
            </div> */}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/profile/edit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
