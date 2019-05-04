const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolver/index');

const app = express();

app.use(express.json());

app.use('/api', graphqlHttp({
    // define real endpoint
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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