import * as mongoose from 'mongoose';

async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  // console.log('MONGODB_URI', process.env.MONGODB_URI)
  // console.log('FB CLIENT ID', process.env.FACEBOOK_CLIENT_ID);
  // console.log('FB CLIENT SECRET', process.env.FACEBOOK_CLIENT_SECRET);

  if (mongoose.connection.readyState >= 1) {
    return
  }

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

export default dbConnect
