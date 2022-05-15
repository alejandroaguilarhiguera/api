import { Moment } from 'moment';

export interface Session {
  token: string;
  refreshToken: string;
  firebaseToken: string;
  accessTokenExpiresIn: string | Date | Moment;
  refreshTokenExpiresIn: string | Date | Moment;
  user: {
    _id: string,
    role: string,
    displayName: string,
  };
}
