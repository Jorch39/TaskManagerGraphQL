const { ApolloServer, gql } = require('apollo-server');
const typeDefs =  require('./db/schema');
const resolvers =  require('./db/resolvers');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config('variables.env')


//Conectar a la BD 
connectDB();

const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: ({req}) => { 
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
                console.log(user);
                return {
                    user
                }
            } catch (error) {
                console.log(error)
            }
        }
    } }
);

server.listen({port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });

