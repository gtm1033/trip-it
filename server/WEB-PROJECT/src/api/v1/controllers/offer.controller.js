
import mongoose from "mongoose";
import { Offer } from "../models/offer.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ApiError } from "../../../utils/ApiError.js";
import { Host } from "../models/host/host.model.js";
import e from "express";


const createOffer = asyncHandler(async (req, res) => {
    console.log("req.agent",req.agent, req.agent._id);
    const agentId = req.agent._id
    const { firstName,lastName,email, phoneNumber,password,hostStatus,propertyURL,offerStatus, statusReason, expiryDate, callBackTime, membershipPlan, quantity, planDetail, price } = req.body;

    const host = new Host({firstName,lastName,email, phoneNumber, password, hostStatus})  
    const hostId = host._id;
    // console.log("hostId",hostId);
    
    

    if (!hostId && !agentId && expiryDate && callBackTime) {
        throw new ApiError(400, "HostId, agentId, expiryDate and callBackTime are required")
        
    }

    if ([propertyURL, offerStatus, statusReason, membershipPlan, quantity, planDetail, price].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingOffer = await Offer.findById(hostId)
    const existingproperty = await Offer.findOne({propertyURL})
    if (existingproperty) {
        throw new ApiError(409, "Offer to this property already exists")
    }

    if (existingOffer) {
        throw new ApiError(409, "Offer to this host already exists")
    }

    const createdHost = await host.save()

    const offer = await Offer.create({
        agentId,
        hostId,
        propertyURL,
        offerStatus,
        statusReason,
        expiryDate,
        callBackTime,
        membershipPlan,
        quantity,
        planDetail,
        price
    })


    const createdOffer = await Offer.findById(offer._id)

    if (!createdOffer) {
        throw new ApiError(400, "Something went wrong couldn't create the offer")
    }

    return res.status(201).json(
        new ApiResponse(200, {createdOffer, createdHost}, "Offer created successfully")
    )
})


const updateOffer = asyncHandler(async (req, res) => {
    const agentId = req.agent._id
    const offerId = req.params.id
    console.log("req.body",req.params, offerId);
    const { offerStatus, statusReason, expiryDate, callBackTime, membershipPlan, quantity, planDetail, price } = req.body

    if (!offerId && !agentId && expiryDate && callBackTime) {
        throw new ApiError(400, "OfferId, agentId, expiryDate and callBackTime are required")
    }

    if ([ offerStatus, statusReason, membershipPlan, quantity, planDetail, price].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingOffer = await Offer.findById(offerId)

    if (!existingOffer) {
        throw new ApiError(404, "Offer not found")
    }
    console.log("existingOffer.agentId",existingOffer.agentId.toString(), typeof(agentId));
    if (existingOffer.agentId.toString() !== agentId.toString()) {
        throw new ApiError(403, "You are not authorized to update this offer")
    }

    existingOffer.offerStatus = offerStatus
    existingOffer.statusReason = statusReason
    existingOffer.expiryDate = expiryDate
    existingOffer.callBackTime = callBackTime
    existingOffer.membershipPlan = membershipPlan
    existingOffer.quantity = quantity
    existingOffer.planDetail = planDetail
    existingOffer.price = price

    await existingOffer.save()

    return res.status(200).json(
        new ApiResponse(200, existingOffer, "Offer updated successfully")
    )
})

export const getExpiredOffers = async (req, res) => {
    try {
        const expiredOffers = await Offer.find({ isExpired: true, offerStatus: "expired" });
        console.log('offers: ', expiredOffers);
        res.status(200).json({
            message: 'Expired offers retrieved successfully',
            expiredOffers
        });
    } catch (error) {
        console.error('Error retrieving expired offers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getPendingOffers = async (req, res) => {
    try {
        const pendingOffers = await Offer.find({ offerStatus: "pending" });
        res.status(200).json({
            message: 'Pending offers retrieved successfully',
            pendingOffers
        });
    } catch (error) {
        console.error('Error retrieving pending offers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getRejectedOffers = async (req, res) => {
    try {
        const rejectedOffers = await Offer.find({ offerStatus: "rejected" });
        res.status(200).json({
            message: 'Rejected offers retrieved successfully',
            rejectedOffers
        });
    } catch (error) {
        console.error('Error retrieving rejected offers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export { createOffer, updateOffer, getPendingOffers, getRejectedOffers }