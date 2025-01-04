const typeDefs = `
    
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    bookId: ID!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    userBooks(userId: ID!): [Book]
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(userInput: UserInput!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`

export default typeDefs