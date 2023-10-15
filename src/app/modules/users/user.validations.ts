import { userRole } from '@prisma/client';
import { z } from 'zod';
import { ZodUserRoles } from './users.constants';

const createUser = z.object({
  body: z.object({
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
    profileImage: z
      .string({
        required_error: 'Profile Image is required',
        invalid_type_error: 'Profile Image must be in string',
      })
      .optional(),
    qualification: z
      .string({
        invalid_type_error: 'Qualification must be in string',
      })
      .optional(),
    specializationId: z
      .string({
        invalid_type_error: 'Specialization must be in string',
      })
      .optional(),
    role: z
      .enum([...ZodUserRoles] as [string, ...string[]], {
        required_error: 'Role is Required',
        invalid_type_error: 'role must be in string',
      })
      .default(userRole.USER),
  }),
});

const updateUser = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: 'Email  must be valid in string' })
      .optional(),
    password: z
      .string({ invalid_type_error: 'Password must be in string' })
      .optional(),
  }),
});
const loginUser = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is Required for Login',
      invalid_type_error: 'First Name must be in string',
    }),
    password: z.string({
      required_error: 'Password is required for login',
      invalid_type_error: 'Last Name must be in string',
    }),
  }),
});

export const UserValidation = {
  createUser,
  updateUser,
  loginUser,
};
