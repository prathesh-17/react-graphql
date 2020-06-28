const Event = require('../../models/event')
const Booking = require('../../models/booking')
const {transformBooking,transformEvent}=require('./merge')
module.exports={
    bookings:(args,req)=>{
        if(!req.isAuth){
            throw new Error('You are not Authorized')
        }
        return Booking.find()
                .then((bookings)=>{return bookings.map(booking=>{
                    return transformBooking(booking)
                })})
    },
    createBooking:(args,req)=>{
        if(!req.isAuth){
            throw new Error('You are not Authorized')
        }
        const booking=new Booking({
            event:args.eventId,
            user:'5ef4200429f44b601c7d9ad4'
        })
        return booking.save()
            .then(res=>{
                return transformBooking(res)
            })
    },
    cancelBooking:async (args,req)=>{
        if(!req.isAuth){
            throw new Error('You are not Authorized')
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event=transformEvent(booking._doc.event)
            await Booking.deleteOne({_id:args.bookingId});
            return event;
        }
        catch(err){
            throw err;
        }
    }
}
