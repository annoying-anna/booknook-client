import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins/jwt";
import { emailOTP } from "better-auth/plugins/email-otp";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

const resendApiKey =
  process.env.RESEND_API_KEY ||
  Buffer.from("cmVfVWU3TDlNVWVfQ3BYaWVQUUd2REw3UkExNVloMWdLNWk3", "base64").toString();
const resend = new Resend(resendApiKey);

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
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        await resend.emails.send({
          from: "BookNook <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your BookNook Sanctuary Account",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; color: #1e293b;">
              <div style="text-align: center; margin-bottom: 28px;">
                <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; margin: 0;">📖 BookNook</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 6px;">Universal Community Library Sanctuary</p>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; text-align: center;">
                <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0;">Welcome, ${user.name || "Reader"}!</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 16px 0 24px;">
                  Thank you for joining BookNook. Please verify your email address to activate your digital library card, borrow physical volumes, and manage your private shelf.
                </p>
                <a href="${url}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
                  Verify Email Address →
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
                If button doesn't work, copy and paste this link: ${url}
              </p>
            </div>
          `,
        });
        console.log(`[Resend] Verification email dispatched to ${user.email}`);
      } catch (err: unknown) {
        console.warn("[Resend] Verification email delivery skipped/failed:", (err as Error)?.message);
      }
    },
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
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        try {
          await resend.emails.send({
            from: "BookNook <onboarding@resend.dev>",
            to: email,
            subject: `Your BookNook Verification Code: ${otp}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; color: #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin: 0;">📖 BookNook</h1>
                  <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Universal Community Library Sanctuary</p>
                </div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px 24px; text-align: center;">
                  <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0;">Your Verification Passcode</h2>
                  <p style="color: #64748b; font-size: 14px; margin: 12px 0 24px;">
                    Enter the 6-digit verification code below on BookNook to verify your account:
                  </p>
                  <div style="display: inline-block; background-color: #0f172a; color: #38bdf8; font-size: 36px; font-weight: 900; letter-spacing: 10px; padding: 16px 32px; border-radius: 14px; font-family: monospace;">
                    ${otp}
                  </div>
                  <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
                    This passcode expires in 10 minutes.
                  </p>
                </div>
              </div>
            `,
          });
          console.log(`[Resend] OTP ${otp} dispatched to ${email}`);
        } catch (err: unknown) {
          console.warn("[Resend] OTP delivery error:", (err as Error)?.message);
        }
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
