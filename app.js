const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

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

        input EventInput {
            title: String!
            description: String!
            price: Int!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
                date: new Date(args.eventInput.date)
            });
            return event.save()
                .then(result => {
                    console.log(result);
                    return {...result._doc, _id: result.id};
                })
                .catch(err => {
                    throw err;
                });
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