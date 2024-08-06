import { useState } from "react"
import { Link } from "react-router-dom"
import { FaCircleChevronRight } from "react-icons/fa6";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { BiSolidOffer } from "react-icons/bi";
import { FaTasks, FaSignOutAlt } from "react-icons/fa";
import { CgCalendarDates } from "react-icons/cg";
import { TbReport } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import logo from "../assets/TripItLOGO.png"
import bg_img from "../assets/bg_img.jpg"


const options = [

  {
    name: "Dashboard",
    icon: <BsFillPersonVcardFill />,
    link: "/dashboard"
  },
  {
    name: "Leads",
    icon: <IoMdContacts />,
    link: "/leads",
  },


  {
    name: "Deals",
    icon: <BiSolidOffer />,
    link: "/deals"
  },
  {
    name: "Tasks",
    icon: <FaTasks />,
    link: "/tasks"
  },
  {
    name: "Calendar",
    icon: <CgCalendarDates />,
    link: "/calendar"
  },
  {
    name: "Reports",
    icon: <TbReport />,
    link: "/reports"
  },
  {
    name: "Settings",
    icon: <IoSettings />,
    link: "/settings"
  },
  {
    name: "Logout",
    icon: <FaSignOutAlt />,
    link: "/logout"
  },
]
const date = new Date()
const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const displayDate = week[date.getDate()] + ", " + date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear()
const backendData = {
  fname: "Gautam",
  lname: "Arora",
  email: "gtmdhoni@gmail.com",
  contact: "1234567890",
  userImg: `${bg_img}`
}

export const CRM = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className=" h-full w-screen bg-gray-100 ">

        {/* ---------------------------- SIDEBAR ---------------------------- */}
        <div className={`flex flex-col fixed h-screen top-0 left-0 z-10  bg-white shadow ${open ? "w-60" : "w-16"}   duration-[500ms]  `}>
          <div className="text-bold pt-2  absolute -right-2  top-3.5 cursor-pointer" onClick={() => setOpen(!open)}>
            <FaCircleChevronRight className={`text-gray-700 text-xl ${open ? "rotate-180" : "rotate-0"} duration-[600ms] ring-2 rounded-full ring-gray-200`} />
          </div>


          <div className={`w-full flex items-center mx-auto bg-gray-200 `}>
            <img className={`mx-auto ${open && "w-44"} duration-[600ms] `} src={`${logo}`} alt="" />
          </div>

          <div className={`flex flex-col gap-2  mt-4`}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center  gap-4 p-2  hover:bg-slate-100 text-gray-800   cursor-pointer">
                <span className={`${!open && "w-full flex items-center justify-center text-3xl"} ${open && "pl-4"} text-xl`}>
                  {option.icon}
                </span>
                <span className={`${!open && "hidden "} duration-700 transition-all  `}>
                  {option.name}
                </span>
              </div>
            ))}
          </div>
        </div>


        <div className=" ml-[66px]  ">

          {/* ----------------------------- HEADER ----------------------------- */}
          <div className="flex items-center justify-between bg-white shadow p-3">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">Dashboard</div>
              <div className="text-sm text-gray-400">{displayDate}</div>
            </div>
            <div className="bg-slate-400 text-white h-10 w-10 rounded-full p-2 cursor-pointer">
              {backendData.fname[0] + backendData.lname[0]}
            </div>
          </div>

          {/* ---------------------------- MAIN CONTENT ---------------------------- */}
          <div className="p-4">
            <div className="bg-white shadow p-4 rounded-lg">
              <div className="text-xl font-semibold w-full pb-2 mb-3 border-b">
                Welcome to <Link to="/" className="font-bolder">TripIt</Link> , <span className="text-rose-500 text-2xl font-medium">{"  " + backendData.fname + "  " + backendData.lname}</span>
              </div>

              <div className="flex justify-between items-center  gap-x-8">

                <div className=" bg-white border-r w-full flex justify-center items-center">
                  <span className="w-40 h-40 rounded-full shadow bg-white flex justify-center items-center">
                    <img src={`${backendData.userImg}`} alt="Profile Pic" className="object-cover w-40 h-40 rounded-full" />
                  </span>
                </div>

                <div className="w-full rounded-md bg-white  flex flex-col gap-2 py-8 items-center">
                  <span className="font-semibold tracking-wide w-full text-center text-xl py-2">
                    Agent Details
                  </span>
                  <div className="w-full py-2 px-14  flex gap-2">
                    <div className="w-[100px]  flex justify-between font-medium">
                      <span className="">Name</span>
                      <span className="">:</span>
                    </div>
                    <div className=" tracking-wider">
                      {backendData.fname + " " + backendData.lname}
                    </div>
                  </div>
                  <div className="w-full py-2 px-14  flex gap-2">
                    <div className="w-[100px]  flex justify-between font-medium">
                      <span className="">Contact</span>
                      <span className="">:</span>
                    </div>
                    <div className=" tracking-wider">
                      {backendData.contact}
                    </div>
                  </div>
                  <div className="w-full py-2 px-14  flex gap-2">
                    <div className="w-[100px]  flex justify-between font-medium">
                      <span className="">Email</span>
                      <span className="">:</span>
                    </div>
                    <div className=" tracking-wider">
                      {backendData.email}
                    </div>
                  </div>
                </div>
              </div>            
            </div>


            <div className="bg-white my-5 p-4 shadow rounded-md flex flex-col justify-center items-center">
              <p className="text-center py-4 text-sm text-gray-700 ">Check the status of the contact number, you would like to call.</p>
              <div className="flex font-semibold gap-4">
               Contact no. 
               <input type="number" className="w-12  px-2 py-0.5 outline-none border font-normal" />
               <input type="number" className=" px-2 py-0.5 outline-none border font-normal" />
              </div>
              <Link className="mt-4 py-1 px-3 rounded-md flex justify-center items-center border border-black hover:text-white hover:bg-black ">
                Check Lead
              </Link>
            </div>

          </div>
        </div>

      </div>



    </>
  )
}

