const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

const events = []; // temp database list variable

app.use(express.json());

app.use('/api', graphqlHttp({
    // define real endpoint
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Int!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Int!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: { // using example data now
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event.id };
                    })
                })
                .catch(err => {
                    throw err;
                });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5ccd637bf0ec583f48ec137e'
            });
            let createdEvent;
            return event.save()
                .then(result => {
                    createdEvent = {...result._doc, _id: result.id};
                    return User.findById('5ccd637bf0ec583f48ec137e')
                })
                .then(user => {
                    if(!user) {
                        throw new Error('User not found');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    throw err;
                });
        },

        createUser: (args) => {
            return User.findOne({email:args.userInput.email})
                .then(user => {
                    if(user) {
                        throw new Error('User exists already.');
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword   
                    });
                    return user.save();
                })
                .then(result => {
                    return {...result._doc, password: null, _id:result.id};
                })
                .catch(err => {
                    throw err;
                })
        }
    },
    graphiql: true
}));

mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + '@node-rest-shop-zqnku.mongodb.net/' + process.env.MONGO_DB + '?retryWrites=true', 
{ useNewUrlParser: true})
.then( () =>  {
    app.listen(8000);
})
.catch(err=> {
    console.log(err);
});