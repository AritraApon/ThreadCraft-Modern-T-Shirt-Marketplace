import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const dbClient = clientPromise;

/**
 * 🎯 ডাটাবেস ইনস্ট্যান্স পাওয়ার মূল হেল্পার ফাংশন (১০০% সেফ)
 */
export async function getDb(): Promise<Db> {
  const resolvedClient = await clientPromise;
  return resolvedClient.db('Thread-Craft');
}

/**
 * 💡 টার্বোপ্যাকের স্ট্যাটিক অ্যানালাইসিস এরর কাটানোর জন্য সেফ ডামি এক্সপোর্ট
 * এর ফলে অ্যাপের যেকোনো জায়গায় পুরানো স্টাইলের ইম্পোর্ট থাকলেও ক্র্যাশ করবে না।
 */
export const db = {
  collection: (name: string) => {
    throw new Error(`⚠️ db.collection("${name}") এর বদলে দয়া করে await getDb() ব্যবহার করো মামা!`);
  }
} as any;