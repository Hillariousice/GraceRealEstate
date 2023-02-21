import React from 'react'
// import './Input.css'

function Input({type,placeholder}:any) {
  return (
    <div className='flex justify-center items-center relative'>
        <input className='absolute bg-white border max-w-2 h-5 shadow-gray-300 my-3'  
        placeholder={placeholder && placeholder} type={type ? type:"text"}
        required
        autoComplete='off'/>
    </div>
  )
}

export default Input