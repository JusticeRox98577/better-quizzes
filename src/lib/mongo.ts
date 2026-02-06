import { MongoClient } from "mongodb";
import { env } from "./env";

let cachedClient: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(env.mongoUrl);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db();
}
