import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is a mandatory field.',
    }).email('Email field must be a valid email.'),
    password: string({
      required_error: 'Password is a mandatory field.',
    }).min(6, 'The password field must at least contain 4 characters.'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is a mandatory field.',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match.',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
