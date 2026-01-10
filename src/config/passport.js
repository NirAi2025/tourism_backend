import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateAccessToken } from "../utils/jwt.js";
import { findOrCreateGoogleUser } from "../services/auth.service.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // and create them if they don't exist.
                const userData = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profileImage: profile.photos?.[0]?.value || null,
                };

                console.log("userData", userData);
                
                // store into DB
                const { email, googleId, name, profileImage } = userData;
                const user = await findOrCreateGoogleUser({
                    email,
                    googleId,
                    name,
                    profileImage,
                });
                // JWT generated using DB user id
                const accessToken = generateAccessToken({
                    id: userData.googleId,
                    email: userData.email,
                    roles: ["user"]
                });

                return done(null, { user, accessToken });
            } catch (error) {
                return done(error, null);
            }
        }
    )
)