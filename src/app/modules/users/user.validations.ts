import { UserRoles } from '@prisma/client';
import { z } from 'zod';
import { ZodUserRoles } from './users.constants';

const createUser = z.object({
  firstName: z.string({
    required_error: 'First name is required',
    invalid_type_error: 'First Name must be in string',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last Name must be in string',
  }),
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'email must be in string',
  }),
  password: z.string({
    required_error: 'password is required',
    invalid_type_error: 'password must be in string',
  }),
  role: z
    .enum([...ZodUserRoles] as [string, ...string[]], {
      required_error: 'Role is Required',
      invalid_type_error: 'role must be in string',
    })
    .default(UserRoles.USER),
});

const updateUser = z.object({
  body: z.object({
    firstName: z
      .string({ invalid_type_error: 'First Name must be in string' })
      .optional(),
    lastName: z
      .string({ invalid_type_error: 'Last Name must be in string' })
      .optional(),
    profileImage: z
      .string({ invalid_type_error: 'profileImage must be in string' })
      .optional(),
    role: z
      .enum([...ZodUserRoles] as [string, ...string[]], {
        invalid_type_error: 'role must be in string',
      })
      .optional(),
  }),
});

export const UserValidation = {
  createUser,
  updateUser,
};
