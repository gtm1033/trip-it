import schedule from 'node-schedule';
import {Offer} from '../models/offer.model.js';
import { ApiError } from '../../../utils/ApiError.js';

try {
    // async function expireOffers() {
    //     const now = new Date();
    //     const weekAgo = new Date(now);
    //     weekAgo.setDate(now.getDate() - 7);
      
    //     await Offer.updateMany(
    //       { createdAt: { $lt: weekAgo }, isExpired: false },
    //       { $set: { isExpired: true } }
    //     );
      
    //     console.log('Expired offers updated');
    // }

    // Schedule the job to run every minute for testing (adjust the schedule as needed)
    // schedule.scheduleJob('* * * * *', async function() {
    //     console.log('Running scheduled job to check for expired offers');
    //     await expireOffers();
    //   });     
    // schedule job to run every hour schedule.scheduleJob('0 * * * *', async function() {





    const job = schedule.scheduleJob('* * * * *', async function() {
        const now = new Date();
        console.log('Current time:', now);
        const updateOffer = await Offer.updateMany(
          { expiryDate: { $lt: now }, offerStatus: 'pending' },
          { $set: { offerStatus: 'expired' }, $set: { isExpired: true } }
        );
        const offer = await Offer.findOne({});
        console.log("offer",offer);
        console.log('Expired offers updated',updateOffer);
      });
    
} catch (error) {
    throw new ApiError(500, 'Somthing went wrong while setting offer to expired');
}


