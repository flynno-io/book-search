import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

// clientOptions for MongoDB Atlas
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const db = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    if (process.env.NODE_ENV === 'production') {
      await mongoose.connect(MONGODB_URI, clientOptions);
    } else {
      await mongoose.connect(MONGODB_URI);
    }
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
};

export default db
