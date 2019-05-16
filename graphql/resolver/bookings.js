const Event = require('../../models/event');
const Booking = require('../../models/booking');
const User = require('../../models/user');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        }
        catch(err) {
            throw err;
        }
    },

    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        let bookedEvent;
        try {
            const creator = await User.findById(req.userId);
            if(!creator) {
                throw new Error('User not found');
            }
            
            const isBooked = await creator.bookedEvents.some((item, index, array) => {
                return args.eventId === item.toString(); 
            });
            if(isBooked) {
                throw new Error('You already booked this event!');
            }
                
            const fetchedEvent = await Event.findOne({_id:args.eventId})
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent
            });
            const result = await booking.save();
            bookedEvent = transformBooking(result);

            creator.bookedEvents.push(fetchedEvent);
            await creator.save();

            return bookedEvent;
        }
        catch(err) {
            throw err;
        }
    },

    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id:args.bookingId});

            const user = await User.findById(req.userId);
            user.bookedEvents = user.bookedEvents.filter(id => id.toString() !== event._id);
            await user.save();
            
            return event;
        }
        catch(err) {
            throw err;
        }
    }
}