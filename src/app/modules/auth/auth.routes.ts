import express from 'express';
import { UserValidation } from '../users/user.validations';
import { AuthController } from './auth.controller';

import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUser),
  AuthController.createNewUser
);

router.post(
  '/login',
  validateRequest(UserValidation.loginUser),
  AuthController.userLogin
);

router.post(
  '/refresh-token',

  AuthController.refreshToken
);

export const AuthRoutes = router;
