import { Application, Request, Response } from 'express';
import validateResource from '../middlewares/validateResource';
import { createUserSchema } from '../schemas/user.schema';
import {
  createUserHandler,
  getCurrentUser,
} from '../controllers/user.controller';
import { createSessionSchema } from '../schemas/session.schema';
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from '../controllers/session.controller';
import requireUser from '../middlewares/requireUser';

const routes = (app: Application) => {
  /**
   * Healthcheck route
   * GET /healthcheck
   */
  app.get('/healthcheck', (req: Request, res: Response) =>
    res.status(200).send('HealthCheck -- OK')
  );

  /**
   * Register user route
   * POST /auth-api/v1/users
   */
  app.post(
    '/auth-api/v1/users',
    validateResource(createUserSchema),
    createUserHandler
  );

  /**
   * Get current user route
   * GET /auth-api/v1/user
   */
  app.get('/auth-api/v1/user', requireUser, getCurrentUser);

  /**
   * Login user route
   * POST /auth-api/v1/sessions
   */
  app.post(
    '/auth-api/v1/sessions',
    validateResource(createSessionSchema),
    createSessionHandler
  );

  /**
   * Get user's sessions route
   * GET /auth-api/v1/sessions
   */
  app.get('/auth-api/v1/sessions', requireUser, getUserSessionsHandler);

  /**
   * Delete user's sessions route
   * DELETE /auth-api/v1/sessions
   */
  app.delete('/auth-api/v1/sessions', requireUser, deleteSessionHandler);
};

export default routes;
