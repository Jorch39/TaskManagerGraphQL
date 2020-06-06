const { gql } = require('apollo-server');

const typeDefs = gql`

    type Project {
        name: String
        id: ID
    }

    type Task {
        name: String
        id: ID
        project: String
        state: Boolean
    }

    type Token {
        token : String
    }

    type Query {
        getProjects: [Project]
        getTasks (input: ProjectIDInput): [Task]
    }

    input UserInput {
        name: String!
        email: String!
        password: String!
    }

    input AuthenticateInput {
        email: String!
        password: String!
    }

    input ProjectInput {
        name: String!
    }

    input TaskInput {
        name: String!
        project: String
    }

    input ProjectIDInput {
        project: String!
    }

    type Mutation {
    #Auth
        createUser ( input: UserInput) : String
        authenticateUser ( input: AuthenticateInput ) : Token
    #Proyectos
        createProject ( input: ProjectInput ) : Project
        updateProject (id: ID!, input: ProjectInput ) : Project
        deleteProject (id: ID!) : String 
    #Tareas
        createTask ( input: TaskInput ) : Task
        updateTask (id: ID!, input: TaskInput, state: Boolean ) : Task
        deleteTask (id: ID!) : String 
    }

`;


module.exports = typeDefs;