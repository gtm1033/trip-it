import React,{ useState } from "react"
import { FaPlus, FaMinus } from "react-icons/fa6";


const Counter = ({For, store_val}) => {
  const [val, setVal] = useState(0)

  const addVal = () => {
    setVal(val + 1)
  }

  const subVal = () => {  
    if(val > 0){
      setVal(val - 1) 
    }}

    const handleValChange = (val) => {
      store_val(val)
    }
handleValChange(val)


  return (
    <>
    
    <div className="flex justify-between items-center gap-4 sm:gap-6 md:gap-8 p-2   w-[170px] h-[40px]  sm:w-[225px] sm:h-[46px] border rounded-md font-semibold text-xs sm:text-sm  tracking-wider text-gray-700">
      {For}
      <div className="flex justify-center items-center cursor-pointer">

        <div className="h-4 w-4 sm:h-6 sm:w-6 flex justify-center items-center  bg-rose-500 hover:bg-rose-600 text-white rounded font-bold" onClick={()=>subVal()}>
          <FaMinus />
        </div>

        <span className={`px-2  sm:px-4 py-1  font-semibold ${val > 0 ? 'text-rose-500' : 'text-gray-500'}`}>{val}</span>

        <div className="h-4 w-4 sm:h-6 sm:w-6 flex justify-center items-center  bg-rose-500 hover:bg-rose-600 text-white rounded font-bold" onClick={()=>addVal()}>
          <FaPlus />
        </div>

      </div>
    </div>
    
    </>
  )
}

export default Counter