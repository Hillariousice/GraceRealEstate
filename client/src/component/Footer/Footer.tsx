import React from 'react';
// Logo import was unused, so removed.
import { BsTwitter, BsInstagram, BsFacebook } from 'react-icons/bs';
import { FaSnapchatGhost } from 'react-icons/fa';

// Define a type for better safety, though not strictly necessary for this simple case
type IconType = {
  id: string;
  component: JSX.Element;
  label: string;
  href?: string; // Optional: if you plan to add actual links
};

const Footer = () => {
  const iconsData: IconType[] = [
    { id: 'fb', component: <BsFacebook />, label: 'Facebook', href: '#' },
    { id: 'tw', component: <BsTwitter />, label: 'Twitter', href: '#' },
    { id: 'ig', component: <BsInstagram />, label: 'Instagram', href: '#' },
    { id: 'sc', component: <FaSnapchatGhost />, label: 'Snapchat', href: '#' },
  ];

  return (
    <div className='bg-black border-t-2 border-gray-700 shadow-md
                    sticky bottom-0 h-16 sm:h-20 w-full
                    flex items-center justify-center gap-5 sm:gap-6 px-4'> {/* Adjusted gap, added px-4 */}
      {iconsData.map((iconItem) => (
        <a
          key={iconItem.id}
          href={iconItem.href}
          aria-label={iconItem.label}
          className='text-xl sm:text-2xl md:text-3xl text-white hover:text-gray-400 duration-150 ease-out p-1' // Responsive icon size, hover effect, padding for touch
          target="_blank" // Open in new tab if actual links are used
          rel="noopener noreferrer" // Security for target="_blank"
        >
          {iconItem.component}
        </a>
      ))}
    </div>
  );
};

export default Footer;