import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME as string;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

export const client = new MongoClient(uri);
export const db = client.db(dbName);