const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Int!
        date: String!
        creator: User!
        bookingCount: Int!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
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

    input UpdateInput {
        _id: ID!
        title: String!
        description: String!
        price: Int!
        date: String!
        bookingCount: Int!
    }

    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
        updateEvent(updateInput: UpdateInput): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)