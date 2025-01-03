import { User } from "../models/index.js"
import { signToken, AuthenticationError } from '../utils/auth.js'; 

const resolvers = {
  // Queries for GraphQL server
  Query: {
    users: async () => {
      return await User.find()
    },

    user: async (_, { username }) => {
      return await User.findOne(
        { username }
      )
    },

    me: async (_, __, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError('You need to be logged in!')
    }
  },

  Mutation: {
    createUser: async (_, { userInput }) => {
      const user = await User.create({ ...userInput})
      const token = signToken(user)
      return { token, user }
    },

    saveBook: async (_, { bookInput }) => {
      return await User.findOneAndUpdate(
        { username },
        { $addToSet: { savedBooks: {...bookInput} } },
        { new: true }
      )
    },

    removeBook: async (_, { username, bookId }) => {
      return await User.findOneAndUpdate(
        { username },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      )
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email })

      if (!user) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const token = signToken(user)
      return { token, user }
    }
  }
}

export default resolvers