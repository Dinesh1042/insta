import { ZodError } from 'zod';
import RegisterUser from './RegisterUser';
import SignUser from './SignIn';

export type Validator = ZodError;

export default {
  RegisterUser,
  SignUser,
};
