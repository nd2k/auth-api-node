import { Request, Response } from 'express';
import { omit } from 'lodash';
import { CreateUserInput } from '../schemas/user.schema';
import { createUser } from '../services/user.service';
import log from '../utils/logger.utils';

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  return res.send(res.locals.user);
};
