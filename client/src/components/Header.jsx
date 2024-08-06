import { useState } from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Logo from '../assets/TripItLOGO.png'
import React from 'react'


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


const Header = () => {

  const [active, setActive] = useState(false)
  const access = true;


  const links = access ? access_navLinks : navLinks;
  return (
    <div className='flex justify-stretch px-36'>
      <div className="flex justify-start items-center  w-full">
        <Link to="/">
          <img src={`${Logo}`} alt="TripIt_Logo" className='h-[100px] ' />
        </Link>

      </div>

      <div className="flex justify-end items-center gap-8 w-full">

        <div className='cursor-pointer font-medium text-sm text-rose-500 hover:border-b hover:border-rose-500 hover:scale-105 transition-all duration-[100ms] '>
          <Link to='/'>
            Home
          </Link>
        </div>
        <div className=' cursor-pointer font-medium text-sm text-rose-500 hover:border-b hover:border-rose-500 hover:scale-105 transition-all duration-[100ms]'> About Us</div>
        <div className=' cursor-pointer font-medium text-sm text-rose-500 hover:border-b hover:border-rose-500 hover:scale-105 transition-all duration-[100ms] '> How We Work?</div>
        <div className=' cursor-pointer font-medium text-sm text-rose-500 hover:border-b hover:border-rose-500 hover:scale-105 transition-all duration-[100ms]'> Become a Host</div>
        <div className='flex justify-center items-center cursor-pointer text-3xl ' onClick={() => setActive(!active)}> <FaUserCircle className='text-rose-500 hover:text-rose-600 ' />

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

    </div>
  )
}

export default Header