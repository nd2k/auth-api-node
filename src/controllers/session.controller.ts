import { Request, Response } from 'express';
import config from 'config';
import {
  createSession,
  findSessions,
  updateSession,
} from '../services/session.service';
import { validatePassword } from '../services/user.service';
import { signJwt } from '../utils/jwt.utils';

const NODE_ENV = process.env.NODE_ENV || config.get<string>('config.nodeEnv');

export const createSessionHandler = async (req: Request, res: Response) => {
  // Validate the user's password
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send('Invalid user credentials.');
  }
  // create a session
  const session = await createSession(user._id, req.get('user-agent') || '');
  // create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    {
      expiresIn:
        process.env.accessTokenExpiresIn ||
        config.get('config.accessTokenExpiresIn'),
    }
  );
  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    {
      expiresIn:
        process.env.refreshTokenExpiresIn ||
        config.get('config.refreshTokenExpiresIn'),
    }
  );
  // return cookies
  if (NODE_ENV === 'production') {
    res.cookie('accessToken', accessToken, {
      maxAge: 900000, //15min
      httpOnly: true,
      domain: 'auth-api-node-ts-2021.herokuapp.com',
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: 3.15e10, //1year
      httpOnly: true,
      domain: 'auth-api-node-ts-2021.herokuapp.com',
      path: '/',
      sameSite: 'strict',
      secure: true,
    });
  } else {
    res.cookie('accessToken', accessToken, {
      maxAge: 900000, //15min
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: 3.15e10, //1year
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    });
  }
  // return access & refresh tokens
  return res.send({ accessToken, refreshToken });
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};
