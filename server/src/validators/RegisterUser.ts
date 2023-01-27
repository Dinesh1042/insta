import { z } from 'zod';

const RegisterUser = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Email Is Invalid'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters')
    .max(64, 'Password must be at least 64 characters'),
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, 'Username must be at least 3 characters'),
});

export default RegisterUser;
