import { OAuth2Client } from 'google-auth-library';

export const oAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
