import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins/jwt";
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

const getAuthBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "production") return "https://booknook-client-tau.vercel.app";
  return "http://localhost:3000";
};

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
  plugins: [
    jwt({
      jwt: {
        definePayload: async (session) => {
          return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
          };
        },
      },
    }),
  ],
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://booknook-client-tau.vercel.app",
    "https://booknook-server-ashy.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || "",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  ].filter(Boolean),
  secret: process.env.BETTER_AUTH_SECRET || "booknook_better_auth_secret_key_super_secret_60marks",
  baseURL: getAuthBaseUrl(),
});
