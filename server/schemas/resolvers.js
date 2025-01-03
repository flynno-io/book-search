import { User } from "../models"

const resolvers = {

  Query: {
    users: async () => {
      return await User.find()
    },

    user: async (parent, { username }) => {
      return await User.findOne(
        { username }
      )
    },

    book: async (parent, { username, bookId }) => {
      return await User.findOne({
        $and: [
          { username },
          { "savedBooks.bookId": bookId }
        ]
      })
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError('You need to be logged in!')
    }
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      return await User.create({ username, email, password })
    },

    saveBook: async (parent, { username, bookData }) => {
      return await User.findOneAndUpdate(
        { username },
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      )
    },

    deleteBook: async (parent, { username, bookId }) => {
      return await User.findOneAndUpdate(
        { username },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      )
    },

    login: async (parent, { email, password }) => {
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