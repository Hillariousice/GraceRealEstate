import React from 'react'

const Filter = ({icon, title}:any) => {
  return (
    <div className='flex items-center text-white bg-black hover:bg-gray-300
     hover:text-black hover:font-bold  duration-200 ease-out 
     gap-2 py-1  px-3 sm:px-4 rounded-full text-[15px] sm:text-[16px]'>
        {icon}
      {title}
    </div>
  )
}

export default Filter
