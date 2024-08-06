import React from 'react'
import { Link } from 'react-router-dom'


export const Home = () => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-8 text-md font-medium'>Home
    <Link to='/create-listing ' className='text-md font-bold  drop-shadow-md  px-2 rounded hover:bg-rose-500 hover:text-white  text-rose-500 '>Create Listing</Link>
    <Link to='/CRM ' className='text-md   font-bold drop-shadow-md px-2 rounded hover:bg-rose-500 hover:text-white  text-rose-500 '>CRM</Link>
     </div>
  )
}

