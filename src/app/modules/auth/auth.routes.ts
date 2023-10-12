import express, { NextFunction, Request, Response } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import { UserValidation } from '../users/user.validations';
import { AuthController } from './auth.controller';
import { userRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-user',
  FileUploadHelper.uploadProfileImage.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUser.parse(JSON.parse(req.body.data));
    return AuthController.createNewUser(req, res, next);
  }
);

router.post(
  '/login',
  validateRequest(UserValidation.loginUser),
  AuthController.userLogin
);

router.post(
  '/refresh-token',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.USER),
  AuthController.refreshToken
);

export const AuthRoutes = router;
