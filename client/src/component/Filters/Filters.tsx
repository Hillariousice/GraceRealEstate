import { TbBeach, TbSailboat } from 'react-icons/tb'
import { GiIsland, GiSandCastle, GiPalmTree, GiParkBench } from 'react-icons/gi'
import { MdHouseboat } from 'react-icons/md'
import { RiAliensFill } from 'react-icons/ri'
import { BsSnow2 } from 'react-icons/bs'
import Filter from './Filter'
import { useState } from 'react'

const Filters = ({ onFilterChange, activeCategory }: any) => {
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
  ];

  const handleCategoryClick = (category: string) => {
    onFilterChange({ category: activeCategory === category ? '' : category });
  };

  const handleSearch = () => {
    onFilterChange({ address, minPrice, maxPrice });
  };

  return (
    <div className="py-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by location..."
          className="border p-2 rounded-md flex-grow"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            className="border p-2 rounded-md w-24"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="border p-2 rounded-md w-24"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
      <div className='flex flex-wrap justify-start items-center gap-2 sm:gap-3 mt-4 px-1 sm:px-3'>
        {sorting.map((obj) => (
          <Filter
            key={obj.id}
            title={obj.title}
            icon={obj.icon}
            isActive={activeCategory === obj.title}
            onClick={() => handleCategoryClick(obj.title)}
          />
        ))}
      </div>
    </div>
  )
}

export default Filters