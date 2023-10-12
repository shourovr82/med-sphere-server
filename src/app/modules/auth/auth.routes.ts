import express, { NextFunction, Request, Response } from 'express';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { UserValidation } from '../users/user.validations';
import { AuthController } from './auth.controller';

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

router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;
