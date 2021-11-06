import jwt from 'jsonwebtoken';
import config from 'config';

const privateKey =
  process.env.privateKey || config.get<string>('config.privateKey');
const publicKey =
  process.env.publicKey || config.get<string>('config.publicKey');

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === 'JWT expired.',
      decoded: null,
    };
  }
};
