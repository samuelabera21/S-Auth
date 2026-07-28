import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";
import { prisma } from "../lib/prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"));
        }

        // Check OAuth account
        let oauth = await prisma.oAuthAccount.findUnique({
          where: {
            provider_providerUserId: {
              provider: "GOOGLE",
              providerUserId: profile.id,
            },
          },
          include: {
            user: true,
          },
        });

        if (oauth) {
          return done(null, oauth.user);
        }

        // Existing user?
        let user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              fullName: profile.displayName,
              email,
              emailVerified: true,
            },
          });
        }

        await prisma.oAuthAccount.create({
          data: {
            provider: "GOOGLE",
            providerUserId: profile.id,
            userId: user.id,
          },
        });

        return done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);



export default passport;
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  done(null, user);
});