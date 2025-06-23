import { TbBeach, TbSailboat } from 'react-icons/tb'
import { GiIsland, GiSandCastle, GiPalmTree, GiParkBench } from 'react-icons/gi'
import { MdHouseboat } from 'react-icons/md'
import { RiAliensFill } from 'react-icons/ri'
import { BsSnow2 } from 'react-icons/bs'
import Filter from './Filter' // Assuming Filter.tsx is already responsive internally

const Filters = () => {
  const sorting = [
    { id: "boat", title: "Boat", icon: <MdHouseboat /> },
    { id: "beachfront", title: "Beachfront", icon: <TbBeach /> },
    { id: "houseboats", title: "Houseboats", icon: <TbSailboat /> },
    { id: "island", title: "Island", icon: <GiIsland /> },
    { id: "castle", title: "Castle", icon: <GiSandCastle /> },
    { id: "tropical", title: "Tropical", icon: <GiPalmTree /> },
    { id: "park", title: "Park", icon: <GiParkBench /> },
    { id: "omg", title: "OMG!", icon: <RiAliensFill /> },
    { id: "arctic", title: "Arctic", icon: <BsSnow2 /> }
    // Add more filters here if needed to test wrapping thoroughly
  ];

  return (
    <div className="py-4"> {/* Added padding to the container itself */}
      <div className='flex flex-wrap justify-start items-center gap-2 sm:gap-3 mt-4 px-1 sm:px-3'> {/* Added flex-wrap, items-center, adjusted gap and padding */}
        {sorting.map((obj) => (
          <Filter key={obj.id} title={obj.title} icon={obj.icon} /> // Added key prop
        ))}
      </div>
      {/*
        Future enhancement idea (commented out):
        A dedicated "Filters" button for mobile that opens a modal or drawer
        could be an alternative to wrapping if the list of filters is very long.
      */}
      {/* <div className="flex lg:hidden items-center border px-4 py-2 rounded-full gap-2 bg-[#0c0606] text-white shadow-sm shadow-gray-100 hover:bg-gray-500 duration-100 ease-out mt-4">
          <FiMenu className="text-[19px] "/> // FiMenu would need to be imported
         <p>All Filters</p>
      </div> */}
    </div>
  )
}

export default Filters