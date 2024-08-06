import { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa6";


const SliderComponent = ({ sliderFor, onChangeVal_adult, onChangeVal_child, onChangeVal_room }) => {
    const def = sliderFor === "Children" ? 0 : 1;
    const [value, setValue] = useState(def); // Initial value for the slider
    const [inputs, setInputs] = useState([]);

    let max = sliderFor === "Adults" | "Rooms" ? 30 : 10;
    let min = sliderFor === "Children" ? 0 : 1;

    const justHandleChangVal = (val) => {
        sliderFor === "Adults" && onChangeVal_adult(val)
        sliderFor === "Children" && onChangeVal_child(val)
        sliderFor === "Rooms" && onChangeVal_room(val)
    }

    useEffect(() => {
        setInputs(Array.from({ length: value }, () => '')); // Create empty strings for each input
    }, [value]);

    const handleIncrement = () => {
        setValue((prev) => Math.min(prev + 1, max)); // Assuming slider max value is 100

    };

    const handleDecrement = () => {
        setValue((prev) => Math.max(prev - 1, min)); // Assuming slider min value is 0
    };

    justHandleChangVal(value)

    const handleTextInputChange = (index, e) => {
        const newInputs = [...inputs];
        newInputs[index] = e.target.value;
        setInputs(newInputs);
    };

    return (
        <div className="flex items-center max-h-[500px] overflow-y-auto">

            <div className="flex  flex-col w-full ">

                <div className='flex items-center  w-full justify-between py-1'>
                    <div className='text-blue-700 cursor-default  tracking-wide'>
                        {sliderFor}
                    </div>
                    <div className="flex">
                        <button
                            className={` w-7 h-7 bg-blue-500 hover:bg-blue-700 text-white font-extrabold flex justify-center items-center      ${value == min ? 'cursor-not-allowed' : 'cursor-pointer'} outline-none  rounded-l-md`}
                            onClick={handleDecrement}
                        >
                            <FaMinus className='text-xs' />
                        </button>
                        <div className='w-8 text-center flex justify-center items-center border'>
                            {value}
                        </div>
                        <button
                            className={`w-7 h-7 bg-blue-500 hover:bg-blue-700 text-white font-extrabold flex justify-center items-center       ${value < max ? 'cursor-pointer' : 'cursor-not-allowed'} outline-none  rounded-r-md`}
                            onClick={handleIncrement}
                        >
                            <FaPlus className='text-xs ' />
                        </button>
                    </div>
                </div>
                {/*--------------------------------------------------------------------------------------------------*/}

                {sliderFor === "Children" &&

                    <div className="absolute -left-72  top-0 bg-white rounded drop-shadow-lg min-w-[200px] ">
                        <div className="grid grid-cols-5">
                            {inputs.map((input, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={input}
                                    onChange={(e) => handleTextInputChange(index, e)}
                                    className="m-2 p-1  w-[50px] border border-gray-300"
                                />
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div >
    );
};

export default SliderComponent;
