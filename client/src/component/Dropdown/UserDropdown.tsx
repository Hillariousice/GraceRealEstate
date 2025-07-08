import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext'; // Import useAuth

interface UserDropdownProps {
  isOpen: boolean;
  toggle: () => void; // Function to close the dropdown from parent if needed
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isOpen, toggle }) => {
  const { isAuthenticated, logoutUser, user } = useAuth();

  const handleLinkClick = () => {
    if (isOpen) { // Close dropdown on link click
      toggle();
    }
  };

  const handleLogout = () => {
    logoutUser();
    handleLinkClick(); // Also close dropdown
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-200 py-1"
      onClick={(e) => e.stopPropagation()} // Prevent click inside dropdown from closing it if parent handles outside clicks
    >
      {isAuthenticated ? (
        <>
          {user && <p className="px-4 py-2 text-sm text-gray-500">Hi, {user.firstName || user.email}!</p>}
          <hr className="my-1"/>
          <Link to="/profile" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            My Profile
          </Link>

          {/* Admin/Superadmin specific links */}
          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <>
              <Link to="/admin/users" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Manage Users
              </Link>
              <Link to="/admin/agents" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Manage Agents
              </Link>
            </>
          )}
          {/* Superadmin specific link */}
          {user?.role === 'superadmin' && (
             <Link to="/admin/manage-admins/new" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
               Create New Admin
             </Link>
          )}

           {user?.role === 'agent' && (
            <>
              <Link to="/agent/my-properties" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                My Properties
              </Link>
              <Link to="/agent/profile/edit" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                Edit Agent Profile
              </Link>
            </>
          )}
          <hr className="my-1"/>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/signin" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Sign In
          </Link>
          <Link to="/signup" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
