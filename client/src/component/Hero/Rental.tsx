import { BsStarFill } from "react-icons/bs"

const Rental = ({name,image,address,price}:any) => {
  return (
    <div className="">
        <div className="relative ">
        <div className="grad absolute w-full h-full rounded-[1.3rem]"></div>
        <div className='flex'>
       
   <img src={image} alt="" className='object-cover rounded-[1.3rem] sm:h-[14.5rem] md:h-[16.5rem] w-full h-full'/>
       <div className='absolute text-white font-bold
       bottom-6 left-6 text-[22px] flex items-center gap-2'>
        <p className="text-[20px] text-white">{name}</p>
    
        <span>&#x2022;</span>
      <p className="text-[16px] text-slate-200 ">${price}</p>
       </div>
        </div>
    </div>
    <div className="pt-3 flex justify-between items-start">
    <div className="">
    <p className="max-w-[17rem] font-semibold text-[17px]"
       >This place is usually fully booked</p>
     <p className="text-[18px] text-black "> {address}</p>
    <p className="max-w-[17rem]  text-[17px] -mt-1 text-gray-400">
     Feb 28 - Mar 16 </p>
     <p className="max-w-[17rem] text-[18px]font-semibold text-black">${price}</p>
    </div>
    <div className="flex items-center space-x-1">
        <BsStarFill/>
        <p className="text-[15px]">5.0</p>
    </div>
      
    </div>
    </div>
    
  )
}

export default Rental