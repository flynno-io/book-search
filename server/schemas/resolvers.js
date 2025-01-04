import { User } from "../models/index.js"
import { signToken, throwAuthenticationError } from '../utils/auth.js'; 

const resolvers = {
  // Queries for GraphQL server
  Query: {
    users: async () => {
      return await User.find().select('_id username email')
    },

    userBooks: async (_, { userId }) => {
      const user = await User.findById(
        { userId }
      ).populate('savedBooks')
      return user.savedBooks
    },

    me: async (_, __, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks')
        
        return userData
      }
      return null // return null if the user is not logged in
    }
  },

  Mutation: {
    addUser: async (_, { userInput }) => {
      const user = await User.create({ ...userInput})
      const token = signToken(user)
      return { token, user }
    },

    saveBook: async (_, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        )
        console.log(updatedUser)
        return updatedUser
      }
      throwAuthenticationError('You need to be logged in!')
    },

    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        )

        return updatedUser
      }
      throwAuthenticationError('You need to be logged in!')
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email })

      if (!user) {
        throwAuthenticationError('Incorrect credentials')
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throwAuthenticationError('Incorrect credentials')
      }

      const token = signToken(user)
      return { token, user }
    }
  }
}

export default resolvers