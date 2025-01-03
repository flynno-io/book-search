// import user model
import { User } from '../models/index.js';
// import sign token function from auth
import { signToken } from '../utils/auth.js';

// get a single user by either their id or their username
export const getSingleUser = async ({ user = null, params }, res) => {
  const foundUser = await User.findOne({
    $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
  });

  if (!foundUser) {
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  res.json(foundUser);
}

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
export const createUser = async ({ body }, res) => {
  const user = await User.create(body);

  if (!user) {
    return res.status(400).json({ message: 'Something is wrong!' });
  }
  const token = signToken(user);
  res.json({ token, user });
}

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
// {body} is destructured req.body
export const login = async ({ body }, res) => {
  const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const correctPw = await user.isCorrectPassword(body.password);

  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }
  const token = signToken(user);
  res.json({ token, user });
}

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = async ({ user, body }, res) => {
  console.log(user);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { savedBooks: body } },
      { new: true, runValidators: true }
    );
    return res.json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
}

// remove a book from `savedBooks`
export const deleteBook = async ({ user, params }, res) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { savedBooks: { bookId: params.bookId } } },
    { new: true }
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "Couldn't find user with this id!" });
  }
  return res.json(updatedUser);
}
