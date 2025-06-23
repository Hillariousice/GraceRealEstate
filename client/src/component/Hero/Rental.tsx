import { BsStarFill } from "react-icons/bs";
import { Link } from "react-router-dom"; // Import Link

// It's good practice to define types for props
interface RentalProps {
  _id: string; // Added _id prop
  name: string;
  image: string;
  address: string;
  price: number | string; // Allow string if price can be formatted like "$1,000"
}

const Rental = ({ _id, name, image, address, price }: RentalProps) => { // Added _id to destructuring
  return (
    <Link to={`/property/${_id}`} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white no-underline hover:no-underline focus:no-underline active:no-underline text-current"> {/* Added Link and styling to remove default link appearance */}
      <div className="relative">
        {/* grad overlay seems to be part of the design, kept it */}
        <div className="grad absolute w-full h-full rounded-t-xl"></div> {/* Ensure grad only covers top rounded part if image is also rounded */}
        <img
          src={image}
          alt={`Rental image for ${name}`} // Improved alt text
          className="object-cover rounded-t-xl w-full h-48 sm:h-52 md:h-56" // Adjusted heights, ensure top rounding matches container
        />
        <div className="absolute text-white font-bold bottom-4 left-4 right-4 flex items-center gap-2"> {/* Adjusted padding, ensure it doesn't overflow */}
          <p className="text-lg sm:text-xl text-white truncate">{name}</p> {/* Added truncate, responsive text */}
          <span className="text-lg sm:text-xl">&#x2022;</span>
          <p className="text-base sm:text-lg text-slate-200">${price}</p> {/* Responsive text */}
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow"> {/* Added flex-grow to make text content fill space */}
        <div className="flex-grow">
          <p className="font-semibold text-sm sm:text-base text-gray-800"> {/* Responsive text */}
            This place is usually fully booked
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate"> {address}</p> {/* Responsive text, truncate */}
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5"> {/* Responsive text */}
            Feb 28 - Mar 16
          </p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm sm:text-base font-semibold text-black">${price}</p> {/* Responsive text */}
          <div className="flex items-center space-x-1">
            <BsStarFill className="text-yellow-500" /> {/* Added color to star */}
            <p className="text-xs sm:text-sm text-gray-700">5.0</p> {/* Responsive text */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rental;