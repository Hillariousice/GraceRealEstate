import React from 'react'

const Filter = ({ icon, title, isActive, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center cursor-pointer duration-200 ease-out
     gap-2 py-1 px-3 sm:px-4 rounded-full text-[15px] sm:text-[16px] ${
       isActive
         ? 'bg-blue-600 text-white font-bold'
         : 'text-white bg-black hover:bg-gray-300 hover:text-black hover:font-bold'
     }`}
    >
      {icon}
      {title}
    </div>
  )
}

export default Filter
