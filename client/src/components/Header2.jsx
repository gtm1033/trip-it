import { useState } from 'react'
import SearchBar from './Searchbar'
import { FaUserCircle } from "react-icons/fa";
import {Link} from 'react-router-dom';
import Logo from '../assets/TripItLOGO.png'

const navLinks = [
    {
        name: 'Log In',
        link: '/log_in'
    },
    {
        name: 'Sign Up',
        link: '/sign_up'
    }
]
const access_navLinks = [
    {
        name: 'Your Property',
        link: '/log_in'
    },
    {
        name: 'Your bookings',
        link: '/log_in'
    },
    {
        name: 'Your Property',
        link: '/log_in'
    },
    {
        name: 'Your Profile',
        link: '/sign_up'
    }
]



const Header2 = () => {

    const [active, setActive] = useState(false)
    const access = true;


    const links = access ? access_navLinks : navLinks;
    return (
        <>
            <header className=" px-4 sm:px-4 md:px-8  lg:px-36 flex justify-between items-center ">
                <Link href="/" className='drop-shadow-md shadow-black'>
                    <div className="flex items-center justify-center  ">
                        <img src={`${Logo}`} alt="TripIt_Logo"  className='h-[100px] ' />
                    </div>
                </Link>
                <div className='w-[30%] '>
                    <SearchBar />
                </div>
                <div className='flex  gap-1 rounded-md'>
                    <div className='border rounded border-rose-500 py-1 px-4 cursor-pointer font-medium text-sm text-rose-500 hover:bg-rose-500 hover:text-white  '> Become a Host</div>
                    <div className='flex justify-center items-center cursor-pointer px-2 text-3xl ' onClick={() => setActive(!active)}> <FaUserCircle className='text-rose-500 hover:text-rose-600 ' />
                   
                    {
                        active && <div className={`absolute z-10 right-24 top-14 ${access ? 'w-40' : 'w-36'} bg-white drop-shadow-lg rounded-md p-2`}>
                            {
                                links.map((link, index) => (
                                    <Link href={link.link} key={index}>
                                        <div className='text-sm text-rose-500 hover:bg-rose-500 hover:text-white rounded py-1 px-2 cursor-pointer tracking-wider font-medium'>{link.name}</div>
                                    </Link>
                                ))
                            }
                            </div>
                    }
                     </div>
                </div>
            </header>
        </>
    )
}

export default Header2