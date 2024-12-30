import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Container from 'typedi';
import AccessService from '../services/access.service';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';

const accessService = Container.get(AccessService);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://bright-boss-grouper.ngrok-free.app/v1/api/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('No email found in Google profile'));
      }
      const username = profile.displayName;
      const avatar = profile.photos?.[0]?.value as string;
      const result = await accessService.loginWithGoogle({email, username, avatar, googleId: profile.id});
      done(null, result);
    }
  )
);

export default passport;
