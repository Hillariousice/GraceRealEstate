import React, { useState } from 'react'

import { useAuth } from '../../context/authContext'


const Signin = () => {
  const [formData, setFormData] = useState({})

  const handleChange = (e:any) => {
      const{name, value} = e.target
      setFormData({...formData, [name]: value})
  }

  const {RegisterConfig} = useAuth();

  const handleSubmit = (e:any) => {
      e.preventDefault()
      RegisterConfig(formData)

      setFormData({})

  }
  return (
    <div className="w-full max-w-sm mx-auto mt-10">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          // value={email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          // value={password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  
  </div>
);
};

export default Signin;

