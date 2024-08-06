import { ApiError } from "../../../../utils/ApiError.js";
import { ApiResponse } from "../../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";
import { Listing } from "../../models/host/listing.model.js";
import { Host } from "../../models/host/host.model.js";

const allListings = asyncHandler( async(req, res) => {
    console.log("in here")
    try{
        const listings = await Listing.find()
        return res.status(200).json(
            new ApiResponse(200, listings, "Listings fetched successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while fetching the listings")
    }
});

const getListingbypartId = asyncHandler( async(req, res) => {
    const {listingId} = req.params
    try{
        const listing = await Listing.findById(listingId)
        return res.status(200).json(
            new ApiResponse(200, listing, "Listing fetched successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while fetching the listing")
    }
});


const getCreateListing = asyncHandler( async(req, res) => {
    const {hostId} = req.hostData._id
    const host = await Host.findById(hostId)
    return res.status(200).json(
        new ApiResponse(200, `The listing form of ${host.firstName} goes from here`)
    )
})

const createListing = asyncHandler( async(req, res) => {
    const hostId = req.hostData._id
    const {
        category,
        type,
        streetAddress,
        aptSuite,
        city,
        province,
        country,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        facilities,
        title,
        description,
        highlight,
        highlightDesc,
        price,
        listingPhotoPaths} = req.body
    console.log("Host ID: ", hostId, req.hostData._id)
    if(!hostId){
        throw new ApiError(401, "Unauthorized request")
    }

    if([category, type, streetAddress, aptSuite, city, province, country, 
        title, description, highlight, highlightDesc, price].some(field => field?.trim() === "")){
        throw new ApiError(400, "All the fields are required")
    }
    if(!guestCount || !bedroomCount || !bedCount || !bathroomCount){
        throw new ApiError(400, "All the fields are required")
    }
    console.log("Files: ", req.files);
    const photosPath = req.files.listingPhotoPaths?.map(file => file.path);

    try{
        const listing = await Listing.create({
            hostId,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            facilities,
            title,
            description,
            highlight,
            highlightDesc,
            price,
            listingPhotoPaths: photosPath
        })
        return res.status(200).json(
            new ApiResponse(200, listing, "Property registered successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400,error.message || "Something went wrong while creating the listing")
    }
})
const getListings = asyncHandler( async(req, res) => {
    const hostId = req.hostData._id
    if(!hostId){
        throw new ApiError(401, "Unauthorized request")
    }
    try{
        const listings = await Listing.find({hostId})
        return res.status(200).json(
            new ApiResponse(200, listings, "Listings fetched successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while fetching the listings")
    }
})

const getListingById = asyncHandler( async(req, res) => {
    const hostId = req.hostData._id
    const {listId} = req.params
    console.log("listId: ", listId, req.params)
    if(!hostId){
        throw new ApiError(401, "Unauthorized request")
    }
    try{
        const listing = await Listing.findById(listId)
        if(!listing){
            throw new ApiError(404, "Listing not found")
        }
        return res.status(200).json(
            new ApiResponse(200, listing, "Listing fetched successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while fetching the listing")
    }
})

const updateListing = asyncHandler( async(req, res) => {
    const hostId = req.hostData._id
    const {listId} = req.params
    const {category, type, streetAddress, aptSuite, city, province, country, guestCount, bedroomCount, 
        bedCount, bathroomCount, facilities, title, description, highlight, highlightDesc, price
      } = req.body
    const listing = await Listing.findById(listId)
    console.log("Listing: ", listing)
    if(!listing){   
        throw new ApiError(404, "Listing not found")
    }

    if(!hostId){
        throw new ApiError(401, "Unauthorized request")
    }
    if([category, type, streetAddress, aptSuite, city, province, country, 
        title, description, highlight, highlightDesc, price].some(field => field?.trim() === "")){
        throw new ApiError(400, "All the fields are required")
    }
    if(!guestCount || !bedroomCount || !bedCount || !bathroomCount){
        throw new ApiError(400, "All the fields are required")
    }
    try{
        const listing = await Listing.findByIdAndUpdate(listId, {
            hostId,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            facilities,
            title,
            description,
            highlight,
            highlightDesc,
            price
        }, {new: true, runValidators: true})
        return res.status(200).json(
            new ApiResponse(200, listing, "Property updated successfully")
        )
    }catch(error){
        throw new ApiError(400, error.message || "Something went wrong while updating the listing")
    }
})

const updatePhotos = asyncHandler( async(req, res) => {
    const hostId = req.hostData._id
    const {listId} = req.params
    console.log("Files: ", req.files);
    const photosPath = req.files.listingPhotoPaths?.map(file => file.path);

    if(!hostId || !listId){
        throw new ApiError(401, "Unauthorized request")
    }
    if(!photosPath){
        throw new ApiError(400, "Please upload photos")
    }
    try{
        const listing = await Listing.findByIdAndUpdate(listId, {
            listingPhotoPaths: photosPath
        }, {new: true})
        return res.status(200).json(
            new ApiResponse(200, listing, "Property photos updated successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while updating the listing photos")
    }
})

const deleteListing = asyncHandler( async(req, res) => {
    console.log("coming here");
    const hostId = req.hostData._id
    const {listId} = req.params

    if(!hostId || !listId){
        throw new ApiError(401, "Unauthorized request")
    }
    try{
        const listing = await Listing.findByIdAndDelete(listId);
        return res.status(200).json(
            new ApiResponse(200, listing, "Property deleted successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, error.message || "Something went wrong while deleting the listing")
    }
})

export { 
        getCreateListing, 
        getListingbypartId,
        createListing,
        allListings,
        getListings,
        getListingById,
        updateListing,
        updatePhotos,
        deleteListing
}

