const TypeDefs = gql`
  type Book {
    bookId: String!
    authors: [String!]
    description: String!
    image: String
    link: String
    title: String!
  }
    
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    Books: [Book]
    Book(bookId: ID!): Book
    Users: [User]
    User(userId: ID!): User
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`