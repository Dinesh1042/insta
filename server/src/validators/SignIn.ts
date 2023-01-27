import { z } from 'zod';

const SignUser = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Email Is Invalid'),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export default SignUser;
