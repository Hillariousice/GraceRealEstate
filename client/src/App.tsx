import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React from 'react'
import './App.css'
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import PropertyDetailsPage from "./pages/PropertyDetails/PropertyDetailsPage";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import ProfilePage from "./pages/Profile/ProfilePage";
import EditProfilePage from "./pages/Profile/EditProfilePage";
import AdminListUsersPage from "./pages/Admin/Users/AdminListUsersPage"; // Import AdminListUsersPage

function App() {

  return (
   <React.Fragment>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/property/:propertyId" element={<PropertyDetailsPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}> {/* General authenticated routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route path="/admin/users" element={<AdminListUsersPage />} />
          {/* Add other admin routes here: /admin/agents, etc. */}
        </Route>

        {/* TODO: Add a 404 Not Found route */}
      </Routes>
    </Router>
   </React.Fragment>
  )
}

export default App
