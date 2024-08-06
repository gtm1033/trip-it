import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BiSolidCheckSquare } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import { categories, types, facilities } from '../data/data'
import Header from '../components/Header';
import Counter from '../components/Counter'

export const CreateListing = () => {

  const [categDivs, setCategDivs] = useState([]);
  const [typesDivs, setTypesDivs] = useState('');
  const [facilityDivs, setFacilityDivs] = useState([]);

  const handleCatgClick = (label) => {

    if (label === 'All') {
      // Select All functionality
      if (categDivs.length === categories.length - 1) {
        setCategDivs([]);
      } else {
        setCategDivs(categories.slice(1).map(cat => cat.label));
      }
      return;
    }

    if (categDivs.includes(label)) {
      setCategDivs(categDivs.filter(selectedLabel => selectedLabel !== label));
    } else {
      setCategDivs([...categDivs, label]);
    }
  };

  const handleTypeClick = (name) => {

    if (typesDivs === name) {
      setTypesDivs('');
    } else {
      setTypesDivs(name);
    }
  };

  const handleFacilityClick = (name) => {
    if (facilityDivs.includes(name)) {
      setFacilityDivs(facilityDivs.filter(selectedName => selectedName !== name));
    } else {
      setFacilityDivs([...facilityDivs, name]);
    }
  };

  // ADDING AND DRAGGING IMAGES
  const [imgs, setImgs] = useState([]);

  const handleUploadImgs = (e) => {
    const newImgs = e.target.files;
    setImgs((prevImgs) => [...prevImgs, ...newImgs]);
  };

  const handleDragImg = (result) => {
    if (!result.destination) return;

    const items = Array.from(imgs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImgs(items);
  };

  const handleRemoveImg = (indexToRemove) => {
    setImgs((prevImgs) =>
      prevImgs.filter((_, index) => index !== indexToRemove)
    );
  };

  //LOCATION INFORMATION
const [locationInfo, setLocationInfo] = useState({
  street : "",
  apt_suite:"",
  city:"",
  province:"",
  country:""  
})

const handleLocationChange = (e) => {
  const {name, value} = e.target;
  setLocationInfo({
    ...locationInfo,
    [name]: value
  })
}

//COUNTERS
const [guests, setGuests] = useState(0)
const [bedrooms, setBedrooms] = useState(0)
const [beds, setBeds] = useState(0)
const [bathrooms, setBathrooms] = useState(0)

const countGuests = (val) => {
  setGuests(val)
}

const countBedrooms = (val) => {
  setBedrooms(val)
}


const countBeds = (val) => {
  setBeds(val)
}

const countBathrooms = (val) => {
  setBathrooms(val)
}
   //PLACE DESCRIPTION
    const [placeDesc, setPlaceDesc] = useState({
      title : "",
      description:"",
      highlight:"",
      h_description:"",
      price:0
    })

    const handlePlaceDescChange = (e) => {
      const {name, value} = e.target;
      setPlaceDesc({
        ...placeDesc,
        [name]: value
      })
    }
    
  // const creatorId = useSelector((state) => state.user._id);

  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      /* Create a new FormData onject to handle file uploads */
      const listingForm = new FormData();
      //listingForm.append("creator", creatorId);
      listingForm.append("category", categDivs);
      listingForm.append("type", typesDivs);
      listingForm.append("streetAddress", locationInfo.street);
      listingForm.append("aptSuite", locationInfo.apt_suite);
      listingForm.append("city", locationInfo.city);
      listingForm.append("province", locationInfo.province);
      listingForm.append("country", locationInfo.country);
      listingForm.append("guestCount", guests);
      listingForm.append("bedroomCount", bedrooms);
      listingForm.append("bedCount", beds);
      listingForm.append("bathroomCount", bathrooms);
      listingForm.append("facilities", facilityDivs);
      listingForm.append("title", placeDesc.title);
      listingForm.append("description", placeDesc.description);
      listingForm.append("highlight", placeDesc.highlight);
      listingForm.append("highlightDesc", placeDesc.h_description);
      listingForm.append("price", placeDesc.price);

      /* Append each selected photos to the FormData object */
      imgs.forEach((photo) => {
        listingForm.append("listingPhotoPaths", photo);
      });
      

      /* Send a POST request to server */
      const response = await fetch("http://localhost:8000/api/v1/hosts/listings", {
        method: "POST",
        body: listingForm,
        credentials: 'include'
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log("Publish Listing failed", err.message);
    }
  };

    return (
    <>
  
      <div className='bg-gray-100/[0.8]'  >
        
        <Header />
        <div className='px-4 sm:px-4 md:px-8  lg:px-36  py-8 bg-transparent  '>

          <div className=" rounded-lg  flex flex-col  "> {/*MAIN CONTAINER*/}
            <div className='font-bold  px-1.5 sm:px-2 md:px-2 lg:px-4 py-1 sm:py-1.5 md:py-2 lg:py-2 mb-4  h-10 sm:h-12 md:h-14 lg:h-14 text-lg sm:text-xl md:text-2xl lg:text-3xl w-full text-white bg-rose-500 rounded-t-md tracking-wide '>
              Publish Your Place Here
            </div>
            <div className="py-4 ">

              <form onSubmit={handlePost} >
                <div>
                  <p className='text-rose-500 font-bold text-md sm:text-md md:text-lg lg:text-lg tracking-wider border-b border-rose-500 py-2  '>STEP 1  |  TELL US ABOUT YOUR PLACE</p>
                  <div className="rounded-md bg-white py-4 px-2 sm:px-2 md:px-4 lg:px-6 mt-2 flex flex-col gap-4 ">

                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500'>Which of the following categories best describes your place ?</p>
                    <div className='flex flex-wrap gap-3 justify-center px-4 sm:px-6 md:px-10 lg:px-12'>
                      {
                        categories?.map((category, index) => (
                          <div key={index} className={`relative flex items-center justify-center h-16 w-20  lg:h-20 lg:w-24 p-1.5 rounded-lg  cursor-pointer  border hover:shadow-md   ${categDivs.includes(category.label) ? 'border-2 border-rose-500 ' : ''}`} onClick={() => handleCatgClick(category.label)}>
                            <label htmlFor={category.label} className={`flex flex-col items-center justify-center gap-2 cursor-pointer }`}>
                              <div className={`text-xl text-gray-700 cursor-pointer `}>
                                {category.icon}
                              </div>
                              <p className={` text-xs font-semibold md:font-bold lg:font-bold  text-center text-gray-700 cursor-pointer ${index===0 ? 'text-rose-500' : ''}`}>{category.label}</p>
                            </label>

                            {categDivs.includes(category.label) &&
                              <div className='absolute top-1 right-1'>
                                <BiSolidCheckSquare className='text-rose-500 h-5 w-5' />
                              </div>}
                          </div>
                        ))
                      }
                    </div>
                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500'>What type of place will guests have ?</p>
                    <div className='flex flex-col  items-center px-2 md:px-6 lg:px-8  mt-4 gap-4'>
                      {
                        types?.map((type, index) => (
                          <div className={` border rounded-md w-[300px] sm:w-[400px] md:w-[500px] lg:w-[650px]  bg-gray-100/[0.3]  hover:border-rose-500 flex items-center gap-2 md:gap-4 p-3 md:p-2 cursor-pointer hover:shadow-md ${typesDivs === type.name ? 'bg-white  border-rose-500' : ''}`} key={index} onClick={() => handleTypeClick(type.name)}>

                            <div className='text-xl  h-12 flex items-center justify-center px-2.5 sm:px-3 md:px-4 lg:px-6 text-gray-700 cursor-pointer'>
                              {type.icon}
                            </div>
                            <div className='flex flex-col h-12 items-start justify-center '>
                              <p className='font-bold text-rose-500 text-xs md:text-sm lg:text-sm tracking-wider cursor-pointer'>{type.name}</p>
                              <p className='font-medium text-xs text-justify md:text-sm lg:text-sm text-gray-700 cursor-pointer'>{type.description}</p>
                            </div>

                          </div>
                        ))
                      }
                    </div>
                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500'>Where's your place located ?</p>
                    <div className='flex flex-col  py-4  px-2 sm:px-16 md:px-20 lg:px-24  gap-4'>

                      <label htmlFor="text" className='flex flex-col text-sm sm:text-sm  md:text-md lg:text-md font-semibold text-gray-700 tracking-wide'>
                        Street Address
                        <input type="text" className='border focus:border-rose-500 outline-none py-1.5 px-3 rounded-md' name="street" value={locationInfo.street} onChange={handleLocationChange} />
                      </label>

                      <div className='flex flex-col  lg:flex-row  justify-between gap-2'>
                        <label htmlFor="text" className='flex flex-col text-sm sm:text-sm  md:text-md lg:text-md w-full   font-semibold text-gray-700 tracking-wide'>
                          <span className='p-0'>Apartment, Suite, etc. <span className='text-[10px] p-0'> (If applicable) </span> </span>
                          <input type="text" className='border focus:border-rose-500 outline-none py-1.5 px-3 rounded-md' name="apt_suite" value={locationInfo.apt_suite} onChange={handleLocationChange}  />
                        </label>
                        <label htmlFor="text" className='flex flex-col text-sm sm:text-sm  md:text-md lg:text-md w-full  font-semibold text-gray-700 tracking-wide '>
                          <span>City</span>
                          <input type="text"  className='border focus:border-rose-500 outline-none py-1.5 px-3 rounded-md' name="city" value={locationInfo.city} onChange={handleLocationChange} />
                        </label>
                      </div>

                      <div className='flex flex-col lg:flex-row justify-between gap-2'>
                        <label htmlFor="text" className='flex flex-col text-sm sm:text-sm  md:text-md lg:text-md  w-full font-semibold text-gray-700 tracking-wide'>
                          Province
                          <input type="text"  className='border focus:border-rose-500 outline-none py-1.5 px-3 rounded-md' name="province" value={locationInfo.province} onChange={handleLocationChange} />
                        </label> 

                        <label  className='flex flex-col text-sm sm:text-sm  md:text-md lg:text-md w-full font-semibold text-gray-700 tracking-wide'>
                          Country
                          <input type="text"  className='border focus:border-rose-500 outline-none py-1.5 px-3 rounded-md' name="country" value={locationInfo.country} onChange={handleLocationChange} />

                          {/* <select name="country" id="country" className='border-2 shadow focus:border-rose-500 outline-none py-1.5 px-3 rounded-md' >
                            <option key="">Select Country</option>
                            {countries_data.map((country, index) => (
                              <option key={index} value={country.name}>{country.name}</option>
                            ))}
                          </select> */}
                        </label>
                      </div>

                    </div>
                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500 '>Share some basics about your place.</p>
                    <div className='flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-6 py-3 mb-4 px-8  items-center justify-center md:flex-wrap sm:flex-wrap'>
                      <Counter For='Guests'   store_val = {countGuests}/>
                      <Counter For='Bedrooms' store_val = {countBedrooms} />
                      <Counter For='Beds'  store_val = {countBeds}/>
                      <Counter For='Bathrooms'  store_val = {countBathrooms}/>

                    </div>
                  </div>
                </div> 

                {/* =================================== STEP 2 =================================== */}

                 <div>
                  <p className='text-rose-500 font-bold text-md sm:text-md md:text-lg lg:text-lg tracking-wider border-b border-rose-500 py-2 mt-8'>STEP 2 | MAKE YOUR PLACE STAND OUT</p>
                  <div className="rounded-md bg-white py-4 px-2 sm:px-2 md:px-4 lg:px-6 mt-2 flex flex-col gap-4 ] ">

                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500'>Tell guests what your place has to offer.</p>
                    <div className='flex flex-wrap gap-3 justify-center px-2 sm:px-6 md:px-10 lg:px-12'>
                      {facilities?.map((facility, index) => (
                        <div key={index} className={`relative flex  items-center justify-center  h-[68px] w-[90px] md:h-20 md:w-28 p-2 rounded-lg  cursor-pointer  border hover:shadow   ${facilityDivs.includes(facility.name) ? 'border border-rose-500  bg-gray-100/[0.5]' : ''}`} onClick={() => handleFacilityClick(facility.name)}>
                          <label htmlFor={facility.name} className={`flex flex-col items-center justify-center gap-2 cursor-pointer }`}>
                            <div className={`text-md sm:textlg lg:text-xl text-gray-700 cursor-pointer`}>
                              {facility.icon}
                            </div>
                            <p className={`text-[10px] sm:text-xs font-bold  text-center text-gray-700 cursor-pointer `}>{facility.name}</p>
                          </label>

                          {facilityDivs.includes(facility.name) &&
                            <div className='absolute top-1 right-1'>
                              <BiSolidCheckSquare className='text-rose-500 h-5 w-5' />
                            </div>}
                        </div>

                      ))}
                    </div>

                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500'>Add some images of your place.</p>
                    <div className=' py-4 px-1 sm:px-6 md:px-10 flex items-center justify-center'>
                      <DragDropContext onDragEnd={handleDragImg}>
                        <Droppable droppableId="photos" direction="horizontal">
                          {(provided) => (
                            <div id="photos" className="photos w-full h-full p-0  sm:p-1 lg:p-2 flex justify-around items-center " {...provided.droppableProps} ref={provided.innerRef} >
                              {imgs.length < 1 && (
                                <>
                                  <input id="image" type="file" style={{ display: "none" }} accept="image/*" onChange={handleUploadImgs} multiple />
                                  <label htmlFor="image" className="shadow-md p-2 text-gray-700 rounded flex flex-col justify-center items-center cursor-pointer  hover:scale-105 ">
                                    <div className="icon cursor-pointer ">
                                      <IoIosImages />
                                    </div>
                                    <p className='font-semibold cursor-pointer text-xs'>Upload from your device</p>
                                  </label>
                                </>
                              )}

                              {imgs.length >= 1 && (
                                <>
                                  {imgs.map((img, index) => {
                                    return (
                                      <Draggable key={index} draggableId={index.toString()} index={index}>
                                        {(provided) => (
                                          <div className="photo  w-[135px]  h-[80px] md:w-[250px] md:h-[170px]  shadow-md " ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                            <img src={URL.createObjectURL(img)} alt="place" />
                                            <button type="button" className='del_btn absolute  top-0 right-0 p-1 bg-white hover:bg-rose-500 text-md cursor-pointer ' onClick={() => handleRemoveImg(index)} >
                                              <BiTrash className='h-[13px] w-[13px] md:h-[16px] md:w-[16px] text-rose-500 hover:text-white font-bold' />
                                            </button>
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  <input id="image" type="file" style={{ display: "none" }} accept="image/*" onChange={handleUploadImgs} multiple />
                                  <label htmlFor="image" className="border border-rose-500 p-2 text-gray-700 rounded flex flex-col justify-center items-center cursor-pointer  w-[135px]  h-[80px] md:w-[250px] md:h-[170px] ">
                                    <div className="icon  cursor-pointer ">
                                      <IoIosImages />
                                    </div>
                                    <p className='cursor-pointer font-semibold text-xs '>Add more images</p>
                                  </label>
                                </>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                    </div>

                    <p className='font-semibold text-sm sm:text-sm md:text-md lg:text-lg text-justify px-1 sm:pl-2 md:pl-4 lg:pl-6 mt-4 lg:mt-6 text-rose-500'>Tell guests what your place has to offer.</p>
                    <div className="flex flex-col justify-center items-center w-full gap-4 py-4 px-4 sm:px-6 md:px-16 lg:px-24">

                      <label htmlFor="title" className='flex flex-col w-full text-sm sm:text-sm  md:text-md lg:text-md font-semibold text-gray-700 tracking-wide '>
                        Title
                        <input type="text" name='title' id="title" className='border focus:border-rose-500 outline-none py-1.5 px-3 rounded-md w-full' onChange={handlePlaceDescChange} />
                      </label>
                      <label htmlFor="description" className='flex flex-col w-full  text-sm sm:text-sm  md:text-md lg:text-md font-semibold text-gray-700 tracking-wide'>
                        Description
                        <textarea name="description" id="description" className='border  focus:border-rose-500 outline-none py-1.5 px-3 rounded-md w-full' onChange={handlePlaceDescChange} ></textarea>
                      </label>
                      <label htmlFor="highlight" className='flex flex-col w-full text-sm sm:text-sm  md:text-md lg:text-md font-semibold text-gray-700 tracking-wide'>
                        Highlight
                        <input type="highlight" name='highlight' id="title" className='border  focus:border-rose-500 outline-none py-1.5 px-3 rounded-md w-full' onChange={handlePlaceDescChange} />
                      </label>
                      <label htmlFor="h_description" className='flex flex-col w-full text-sm sm:text-sm  md:text-md lg:text-md font-semibold text-gray-700 tracking-wide'>
                        Highlight Description
                        <textarea name="h_description" id="description" className='border  focus:border-rose-500 outline-none py-1.5 px-3 rounded-md w-full' onChange={handlePlaceDescChange} ></textarea>
                      </label>

                      <label htmlFor="price" className='m-6 md:m-8 flex  flex-col items-center justify-center'>
                      <span className="text-gray-700 text-sm  md:text-md lg:text-md  font-semibold">
                      Now, set your Price   
                      </span>
                      <span className='text-lg md:text-xl font-medium  text-rose-500'>$
                       <input type="number" name="price" id="price" className='border mx-2 focus:border-rose-500 outline-none py-1.5 px-3 rounded-md w-36 font-semibold' onChange={handlePlaceDescChange} />
                        </span> 
                      </label>

                    </div>


                 </div>
                </div> 

                <div className='w-full flex justify-center px-8 items-center py-4 '>
                    <input type="submit" value="Create your listing" className='rounded-md bg-rose-500 hover:bg-rose-600 cursor-pointer font-semibold tracking-wider text-lg text-white outline-none border-none py-2 px-14 md:px-16 lg:px-20 ' />
                </div>
              </form>
            </div>
          </div>


        </div>

      </div >

    </>
  )
}
