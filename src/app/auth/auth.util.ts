import { TokenPayload } from 'google-auth-library';
import { BaseException } from '../../errors/BaseException';
import { oAuthClient } from '../../utils/googleClient';

export const extractPayloadFromGoogleIdToken = async (token: string) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new BaseException(400, 'Invalid Google Token');
  }

  return payload;
};

export const verifyGoogleUserPayload = (payload: TokenPayload) => {
  if (payload.email === undefined) {
    throw new BaseException(400, 'Login fail due to missing email information');
  }
  if (payload.name === undefined) {
    throw new BaseException(
      400,
      'Login fail due to missing fullname information'
    );
  }
};
