'use client'

import { GrLocation } from "react-icons/gr";
import DatePicker from "@/components/DatePicker";
import { useState } from "react";
import SliderComponent from "./SliderComponent";
import { GrGroup } from "react-icons/gr";






const UpperSurface = () => {

    const [open, setOpen] = useState(false)
    const [adult, setAdult] = useState(1)
    const [child, setChild] = useState(0)
    const [room, setRoom] = useState(1)

    const handleChangeValAdult = (val) => {
        setAdult(val);
    }
    const handleChangeValChild = (val) => {
        setChild(val);
    }
    const handleChangeValRoom = (val) => {
        setRoom(val);
    }


    var adult_str = adult > 1 ? "Adults" : "Adult"

    var child_str = child > 1 ? "Children" : "Child"
    var room_str = room > 1 ? "Rooms" : "Room"

    return (
        <div className="absolute rounded-lg p-4 bottom-14 flex flex-col justify-center items-center gap-2  bg-black/[.45] transition-all ">

            <div id="textbox" className="my-3 mx-6 pl-8 w-full flex flex-col justify-center items-start text-white drop-shadow">
                <h1 className="text-7xl font-serif tracking-wider font-extrabold drop-shadow-2xl shadow-white">
                    Find Your Perfect Stay.
                </h1>
                <h3 className="text-3xl tracking-wider pb-8 pt-4 font-sans font-bold">From Luxurious Hotels to Cozy Homes</h3>

            </div>


            {/* ========================================================================================================= */}

            <div className="flex justify-between bg-white mt-8 -mb-4 py-4 px-6 rounded-lg w-[105%]">

                <label htmlFor="text" className="flex items-center border rounded px-4 " >
                    <GrLocation className="text-blue-700 h-5 w-5" />
                    <input type="text" className="px-2 font-semibold text-sm tracking-wider outline-none focus:border-b-blue-600 focus:border focus:border-white duration-[2000ms] transition-all active:border-b-black  " placeholder="Search your location" />
                </label>
                {/* ----------CALENDER----------------- */}
                <div>
                    <DatePicker />
                </div>
                {/* -----------ADULTS | CHILDREN | ROOMS ---------------- */}
                <div className="relative border rounded"  >
                    <div id="x" className=" cursor-pointer px-6 h-full flex items-center justify-even gap-4  rounded text-gray-400  hover:text-black " onClick={() => setOpen(!open)}>
                        < GrGroup className="h-4 w-4 text-blue-700" />

                        <p className="cursor-pointer text-sm tracking-wider font-semibold">
                            {`${adult} ${adult_str} | ${child} ${child_str} | ${room} ${room_str}`}
                        </p>
                    </div>

                    {open &&
                        <div className=" absolute min-w-[250px]   -bottom-40 border py-3 px-6 flex flex-col  bg-white rounded-md drop-shadow-xl">

                            <SliderComponent sliderFor="Adults" onChangeVal_adult={handleChangeValAdult} onChangeVal_child={handleChangeValChild} onChangeVal_room={handleChangeValRoom} />

                            <SliderComponent sliderFor="Children" onChangeVal_adult={handleChangeValAdult} onChangeVal_child={handleChangeValChild} onChangeVal_room={handleChangeValRoom} />

                            <SliderComponent sliderFor="Rooms" onChangeVal_adult={handleChangeValAdult} onChangeVal_child={handleChangeValChild} onChangeVal_room={handleChangeValRoom} />
                        </div>

                    }
                </div>
                {/* ---------SEARCH BUTTON------------------ */}

                <button className="bg-blue-700 hover:bg-blue-800 cursor-pointer text-white px-6 py-2 rounded-md drop-shadow-lg font-bold tracking-wide ">
                    Search
                </button>
            </div>
        </div>
    )
}

export default UpperSurface