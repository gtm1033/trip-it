import { useEffect , useState } from "react";
// import "../styles/ListingDetails.scss";
import { useParams } from "react-router-dom";
import { facilities } from "../data/data.js";
import bg_img from "../assets/bg_img.jpg";
 import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Header from "../components/Header";
// import { useSelector } from "react-redux";
// import Footer from "../components/Footer"

export const ListingDetails = () => {
  const [loading, setLoading] = useState(true);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(
       `http://localhost:8000/api/v1/hosts/properties/${listingId}`,
    // `http://localhost:9000/properties/${listingId}`,
        {
          method: "GET",
        }
      );


      const data = await response.json();
      console.log("data",data.data.facilities)
      setListing(data.data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
     getListingDetails();
     // eslint-disable-next-line
  }, []);




  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    // Update the selected date range when user makes a selection
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24); // Calculate the difference in day unit

  //   /* SUBMIT BOOKING */
  //   const customerId = useSelector((state) => state?.user?._id)

  //   const navigate = useNavigate()

  //   const handleSubmit = async () => {
  //     try {
  //       const bookingForm = {
  //         customerId,
  //         listingId,
  //         hostId: listing.creator._id,
  //         startDate: dateRange[0].startDate.toDateString(),
  //         endDate: dateRange[0].endDate.toDateString(),
  //         totalPrice: listing.price * dayCount,
  //       }

  //       const response = await fetch("http://localhost:3001/bookings/create", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(bookingForm)
  //       })

  //       if (response.ok) {
  //         navigate(`/${customerId}/trips`)
  //       }
  //     } catch (err) {
  //       console.log("Submit Booking Failed.", err.message)
  //     }
  //   }
  
  console.log("listings ",listing)

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="listing-details my-10  mx-2 md:mx-20 lg:mx-36  ">
        <div className="title text-2xl sm:text-3xl md:text-4xl font-bold text-rose-500 tracking-wide">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos flex flex-wrap justify-center items-center gap-0.5 sm:gap-2 lg:gap-3 p-1.5 sm:p-4   m-0 sm:m-2">
          {listing.listingPhotoPaths?.map((item) => (
            <img
              src={`http://localhost:8000/${item.replace("public", "")}`}
              alt="listing pic"
              className="object-cover shadow h-[90px] w-[130px] sm:h-[130px]  sm:w-[180px] md:h-[140px] md:w-[200px]"
            />
          ))}
        </div>

        <h2 className="text-md text-center sm:text-left sm:text-xl tracking-wide font-semibold my-2  text-gray-700">
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>

        <p className="sm:font-semibold text-center sm:text-left text-[12px] sm:text-xs sm:tracking-wide mb-4 text-gray-700">
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) - {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="w-full p-2 md:p-3 flex items-center gap-3">
          <span>
            <img src={`${bg_img}`} alt="user_img" className="border border-rose-500 p-0.5 rounded-full object-cover w-[40px] h-[40px]" />
          </span>
          <p className="font-medium trakcing-wider text-xs  sm:text-sm">
            Hosted by <span className="text-rose-500">User Name</span> 
          </p>
        </div>


        {/* 
        <div className="profile">
          <img
            src={`http://localhost:3001/${listing.creator.profileImagePath.replace(
              "public",
              ""
            )}`}
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div> */}
        <hr />

        <section className="my-4 text-gray-700">
          <h3 className="font-semibold text-md sm:text-lg tracking-wide">Description</h3>
          <p className="text-justify text-xs sm:text-sm">{listing.description}</p>
        </section>
        <hr />

        <section className="my-4 text-gray-700">
          <h3 className="font-semibold  text-md sm:text-lg tracking-wide">{listing.highlight}</h3>
          <p className="text-justify text-xs sm:text-sm">{listing.highlightDesc}</p>
        </section>

        <hr className="mb-4" />

        <div className="booking  w-full flex flex-col lg:flex-row justify-between gap-4 ">
          <div>
            <h2 className="text-xl sm:text-2xl tracking-wide font-semibold my-2 text-rose-500">What this place offers?</h2>
            <div className="facilities grid grid-cols-2 gap-x-4 md:gap-x-10  ">
              {listing.facilities.map((item, index) => (
                <div className="facility flex items-center p-1 gap-1 sm:gap-2" key={index}>
                  <div className="facility_icon text-lg md:text-xl font-bold m-0.5  sm:m-2 text-gray-900 ">
                    {
                      facilities.find((facility) => facility.name === item)
                        ?.icon
                    }
                  </div>
                  <p className="text-xs sm:text-sm font-medium tracking-wide text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:border-l lg:pl-6 lg:pr-4">
            <h2 className="text-xl sm:text-2xl tracking-wide font-semibold my-2 text-rose-500 ">How long do you want to stay?</h2>
            <div className="date-range-calendar flex flex-col items-center p-2 ">
              <DateRange ranges={dateRange} onChange={handleSelect}  rangeColors={['#f43f5e', '#f43f5e', '#f43f5e']} className=" " />
              
              <div className="w-full flex flex-row justify-between items-center  font-medium text-[10px] sm:text-xs">

                <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
                <p>End Date: {dateRange[0].endDate.toDateString()}</p>
              </div>
              <div className="flex w-full justify-between items-center py-2 text-md">

              <h2 className=" text-sm sm:text-md font-semibold">
                {`${listing.price} x ${dayCount} Night${dayCount > 1 ? "s" : ""}`}
              </h2>

              <span className="font-semibold text-right text-sm sm:text-md ">Total Price = ${listing.price * dayCount}</span>
              </div>



              <button className="button w-full rounded-md bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center font-semibold tracking-wider py-2 mt-2" type="submit" >
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};
