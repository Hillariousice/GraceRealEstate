import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center  rounded text-sm focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
     <FiMenu className="text-[19px] " />
        <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293l-3. 79 3. 79-3. 082zm0 6. 08l3. 79 3. 79-3. 083-3. 79z"/></svg>
      </button>
      <ul className={`${isOpen ? "block" : "hidden"} absolute bg-white border border-gray-200 rounded py-2`}>
        <li>
          <a href="/" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-200">Home</a>
        </li>
        <li>
          <a href="/about" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-200">About</a>
        </li>
        <li>
          <a href="/contactus" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-200">Contact Us</a>
        </li>
        <li>
          <a href="/login" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-200">SignIn</a>
        </li>
        <li>
          <a href="/signup" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-200">Signup</a>
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
