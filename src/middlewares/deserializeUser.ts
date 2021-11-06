import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';
import config from 'config';

const NODE_ENV = process.env.NODE_ENV || config.get<string>('config.nodeEnv');

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');
  const refreshToken =
    get(req, 'cookies.refreshToken') || get(req, 'headers.x-refresh');
  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);

      if (NODE_ENV === 'production') {
        res.cookie('accessToken', newAccessToken, {
          maxAge: 900000, //15min
          httpOnly: true,
          domain: 'auth-api-node-ts-2021.herokuapp.com',
          path: '/',
          sameSite: 'strict',
          secure: true,
        });
      } else {
        res.cookie('accessToken', newAccessToken, {
          maxAge: 900000, //15min
          httpOnly: true,
          domain: 'localhost',
          path: '/',
          sameSite: 'strict',
          secure: false,
        });
      }
    }
    const result = verifyJwt(newAccessToken as string);
    res.locals.user = result.decoded;
    return next();
  }
  return next();
};

export default deserializeUser;
