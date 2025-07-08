import React, { createContext, ReactElement, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'; // Using axios directly for now, ensure baseUrl consistency
import { useNavigate } from 'react-router-dom';
// import { apiPost, apiGet } from '../utils/axios'; // Could use these if baseUrl is aligned

// Server routes are NOT prefixed with /api. Base URL should just be the server origin.
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

interface User {
  _id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  // Add other user fields you expect from login/profile API
}

interface RegisterData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  phone?: string; // Assuming phone is part of registration based on userController
}

interface LoginData {
  email?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // For initial auth check
  registerUser: (data: RegisterData) => Promise<void>;
  loginUser: (data: LoginData) => Promise<void>;
  logoutUser: () => void;
  // getAllProperty: () => Promise<void>; // Consider moving this
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromStorage = () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem('token');
      const storedUserString = localStorage.getItem('user');
      if (storedToken && storedUserString) {
        try {
          const storedUser = JSON.parse(storedUserString) as User;
          setToken(storedToken);
          setUser(storedUser);
          setIsAuthenticated(true);
          // Optionally: verify token with a silent API call here
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    loadUserFromStorage();
  }, []);


  const registerUser = async (formData: RegisterData) => {
    try {
      // The /users/signup endpoint is correct based on server/routes/User.ts
      // No Authorization header needed for registration
      const response = await axios.post(`${API_BASE_URL}/users/signup`, formData);
      console.log(response.data);
      toast.success(response.data.message || "Registration successful! Please login.");
      // Typically, registration redirects to login or auto-logs in.
      // For now, redirecting to login.
      setTimeout(() => {
        navigate('/signin'); // Use navigate
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.Error || err.response?.data?.message || "Registration failed.");
    }
  };

  const loginUser = async (formData: LoginData) => {
    try {
      // The /users/login endpoint
      // No Authorization header needed for login
      const response = await axios.post(`${API_BASE_URL}/users/login`, formData);
      console.log(response.data);

      const { token: apiToken, role, email, _id, firstName, lastName } = response.data; // Assuming API returns these

      if (apiToken && role && email && _id) {
        const userData: User = { _id, email, role, firstName, lastName };
        localStorage.setItem('token', apiToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(apiToken);
        setUser(userData);
        setIsAuthenticated(true);
        toast.success(response.data.message || "Login successful!");

        setTimeout(() => {
          // Redirect based on role, or to a default dashboard/home
          if (role === 'agent' || role === 'admin' || role === 'superadmin') {
            navigate('/admin/users'); // Example: Redirect admin/agent to a dashboard
          } else {
            navigate('/'); // Default redirect for 'user' role
          }
        }, 1000);
      } else {
        toast.error("Login failed: Invalid data received from server.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.Error || err.response?.data?.message || "Login failed.");
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info("You have been logged out.");
    navigate('/signin');
  };

  // const getAllProperty = async () => { /* ... implementation ... */ }; // Placeholder for now

  return (
    <AuthContext.Provider value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        registerUser,
        loginUser,
        logoutUser,
        // getAllProperty
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
