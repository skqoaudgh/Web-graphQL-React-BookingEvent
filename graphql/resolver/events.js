const Event = require('../../models/event');
const User = require('../../models/user'); 

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        }
        catch(err) {
            throw err;
        }
    },

    createEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId,
            bookingCount: 0
        });
        let createdEvent;
        try {
            const result = await event.save()
            createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId);

            if(!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        }
        catch(err) {
            throw err;
        }
    },

    updateEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = {
            _id: args.updateInput._id,
            title: args.updateInput.title,
            description: args.updateInput.description,
            price: args.updateInput.price,
            date: new Date(args.updateInput.date),
            bookingCount: args.updateInput.bookingCount
        };
        try {
            await Event.updateOne({_id:args.updateInput._id}, {$set: event});
            return event;
        }
        catch(err) {
            throw err;
        }
    }
}