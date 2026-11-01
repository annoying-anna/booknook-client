import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: MongoClient | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri);
  }
  client = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
}

const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "booknook_better_auth_secret_key_super_secret_60marks",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
