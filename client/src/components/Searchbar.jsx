import React from 'react'
import { IoSearch } from "react-icons/io5";


const Searchbar = () => {
    return (
        <div className='flex justify-between rounded-md mx-auto bg-white overflow-hidden  w-full'>
            <div className="flex w-full items-center justify-center  rounded-l-md focus:border-rose-500">
                <input type="text" name="" className='rounded-l-md   outline-none h-full border w-full text-sm text-rose-500 px-4' placeholder="Search Here . . ." />
            </div>
            <div className='flex items-center justify-center bg-rose-500 p-2 text-white cursor-pointer  '>
                <IoSearch  />
            </div>
        </div>
    )
}

export default Searchbar