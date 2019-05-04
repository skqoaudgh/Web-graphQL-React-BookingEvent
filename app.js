const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

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
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.listen(8000);