import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../../component/NavBar/NavBar';
import Footer from '../../../component/Footer/Footer';
import { apiGet, apiDelete } from '../../../utils/axios'; // Import apiDelete
import { toast } from 'react-toastify';
import { User as AuthUser } from '../../../context/authContext';

// Define a more specific User type for the list if needed, or extend from authContext User
interface ListedUser extends AuthUser { // Assuming AuthUser has _id, email, role, firstName, lastName
  phone?: string;
  address?: string;
  verified?: boolean;
  createdAt?: string; // Assuming server might send this
}

const AdminListUsersPage: React.FC = () => {
  const [users, setUsers] = useState<ListedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Endpoint GET /api/users/get-all-users (server UserRoutes)
        // The apiGet from utils/axios should automatically include the token if stored by authContext
        const response = await apiGet({ path: 'users/get-all-users' });
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        } else {
          setUsers([]);
          // toast.info('No users found or data in unexpected format.');
        }
      } catch (err: any) {
        console.error("Error fetching users:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to fetch users.';
        setError(errorMessage);
        toast.error(errorMessage);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    // To be implemented in the next step
    if (window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
      try {
        // Endpoint: DELETE /api/users/deleteUser/:userId
        // The apiDelete from utils/axios should automatically include the token
        await apiDelete({ path: `users/deleteUser/${userId}` }); // Corrected to use apiDelete
        toast.success(`User ${userId} deleted successfully.`);
        // Update users list by filtering out the deleted user
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } catch (err: any) {
        console.error("Error deleting user:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to delete user.';
        toast.error(errorMessage);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Loading users...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
            {/* Optional: Add New User button if admins can create users directly */}
            {/* <Link to="/admin/users/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add New User
            </Link> */}
          </div>

          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName || ''} {user.lastName || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ user.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.verified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* <Link to={`/admin/users/edit/${user._id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link> */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          Delete (Not Implemented)
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

export default AdminListUsersPage;
