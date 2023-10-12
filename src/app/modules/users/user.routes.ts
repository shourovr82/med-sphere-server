import express from 'express';
import auth from '../../middlewares/auth';

import { UserController } from './users.controller';
import { userRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validations';

const router = express.Router();

// !  get all Users ------------------------------>>>
router.get(
  '/',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  UserController.getAllUsersController
);

// !  get My Profile ------------------------------>>>
router.get(
  '/my-profile',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.USER, userRole.DOCTOR),
  UserController.getMyProfile
);
// !  Update  User data ------------------------------>>>
router.patch(
  '/update-user/:userId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(UserValidation.updateUser),
  UserController.updateUserInfo
);
// !  Update  Profile data ------------------------------>>>
router.patch(
  '/update-profile/:profileId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.USER, userRole.DOCTOR),
  validateRequest(UserValidation.updateUser),
  UserController.updateProfileInfo
);
// !  Update  My Profile data ------------------------------>>>
router.patch(
  '/update-my-profile',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.USER, userRole.DOCTOR),
  validateRequest(UserValidation.updateUser),
  UserController.updateMyProfileInfo
);
// !  get single user ------------------------------>>>
router.get(
  '/:userId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  UserController.getSingleUser
);

export const UserRoutes = router;
