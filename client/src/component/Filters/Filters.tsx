import {TbBeach,TbSailboat} from 'react-icons/tb'
import {GiIsland,GiSandCastle,GiPalmTree,GiParkBench} from 'react-icons/gi'
import {MdHouseboat} from 'react-icons/md'
import {RiAliensFill} from 'react-icons/ri'
import { BsSnow2 } from 'react-icons/bs'
import Filter from './Filter'


const Filters = () => {
  const sorting =[{title:"Boat",icon:<MdHouseboat/>},
  {title:"Beachfront",icon:<TbBeach/>},
  {title:"Houseboats",icon:<TbSailboat/>},
  {title:"Island",icon:<GiIsland/>},
  {title:"Castle",icon:<GiSandCastle/>},
  {title:"Tropical",icon:<GiPalmTree/>},
  {title:"Park",icon:<GiParkBench/>},
  {title:"OMG!",icon:<RiAliensFill/>},
  {title:"Arctic",icon:<BsSnow2/>}]
  return (
    <div className="">
      <div className='flex justify-start gap-3 sm:gap-4 mt-4 px-3 '>
        {sorting.map((obj)=>(<Filter title={obj.title}icon={obj.icon}/>))}
      </div>
      {/* <div className="flex items-center border px-4 py-2 rounded-full gap-2 bg-[#0c0606] text-white  shadow-sm shadow-gray-100 hover:bg-gray-500
        duration-100 ease-out">
          <FiMenu className="text-[19px] "/>
         <p>Filter</p>
      </div> */}
    </div>
  )
}

export default Filters