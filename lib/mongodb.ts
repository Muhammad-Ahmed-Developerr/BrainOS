import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI = 'mongodb+srv://ahmed:ahmed2007%40%23%24@ahmed.bs8ejjy.mongodb.net/brainoperatingsystem?retryWrites=true&w=majority';

function getSanitizedMongoUri(): string {
  let uri = (process.env.MONGODB_URI || '').trim();
  if (!uri) {
    uri = DEFAULT_MONGODB_URI;
  }
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    uri = DEFAULT_MONGODB_URI;
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached?.conn) {
    return cached.conn;
  }

  const uri = getSanitizedMongoUri();

  if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
    throw new Error('Invalid or missing MongoDB connection string.');
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

