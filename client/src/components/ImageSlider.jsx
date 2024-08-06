"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
// import { StaticImageData } from "next/image";
// import image1 from "@/public/assets/image1.jpeg";
import image2 from "@/public/assets/image2.jpeg";
import image3 from "@/public/assets/image3.jpeg";
import image4 from "@/public/assets/image4.jpeg";
import image5 from "@/public/assets/image5.jpeg";
import image6 from "@/public/assets/image6.jpeg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


// Image data array
const images = [
    //   {
    //     src: image1,
    //   },
    {
        src: image2,
    },
    {
        src: image3,
    },
    {
        src: image4,
    },
    {
        src: image5,
    },
    {
        src: image6,
    },
];

export default function ImageSlider() {
    // State to keep track of the current image index
    const [currentIndex, setCurrentIndex] = useState(0);

    // State to determine if the image is being hovered over
    const [isHovered, setIsHovered] = useState(false);

    // Function to show the previous slide
    const prevSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    // Function to show the next slide
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // useEffect hook to handle automatic slide transition
    useEffect(() => {
        // Start interval for automatic slide change if not hovered
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 2000);

            // Cleanup the interval on component unmount
            return () => {
                clearInterval(interval);
            };
        }
    }, [isHovered]);

    // Handle mouse over event
    const handleMouseOver = () => {
        setIsHovered(true);
    };

    // Handle mouse leave event
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="relative w-full mx-auto ">
            <div className=" h-[460px] mx-12 group " onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} >
                <Image
                    src={images[currentIndex].src}
                    alt={`Slider Image ${currentIndex + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="   transition-all duration-500 ease-in-out cursor-pointer"
                />
            </div>

            {/* BUTTONS */}
            <button
                className="absolute left-0 top-1/2 transform   hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
                onClick={prevSlide}
            >
                <FaChevronLeft className="text-gray-400 group-hover:text-white" />
            </button>

            <button
                className="absolute right-0 top-1/2 transform  hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
                onClick={nextSlide}
            >
                <FaChevronRight className="text-gray-400 group-hover:text-white" />
            </button>
                
            {/* INDICATORS */}
            <div className="flex z-10 justify-center drop-shadow ">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full drop-shadow-md z-10  mx-1 my-3 ${index === currentIndex ? "bg-[#010101] " : "bg-white "} transition-all duration-500 ease-in-out`}
                    ></div>
                ))}
            </div>
        </div>
    );
}