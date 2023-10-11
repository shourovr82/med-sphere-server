import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validations';
import { UserController } from './users.controller';
import { userRole } from '@prisma/client';

const router = express.Router();

// !  get all Users ------------------------------>>>
router.get(
  '/',
  auth(userRole.admin, userRole.superadmin),
  UserController.getAllUsersController
);

// !  get My Profile ------------------------------>>>
// router.get(
//   '/my-profile',
//   auth(userRole.admin, userRole.superadmin),
//   UserController.getMyProfile
// );
// !  Update  User data ------------------------------>>>
// router.patch(
//   '/update-user/:userId',
//   auth(userRole.admin, userRole.superadmin),
//   validateRequest(UserValidation.updateUser),
//   UserController.updateUserInfo
// );
// !  Update  Profile data ------------------------------>>>
// router.patch(
//   '/update-profile/:profileId',
//   auth(userRole.admin, userRole.superadmin),
//   validateRequest(UserValidation.updateUser),
//   UserController.updateProfileInfo
// );
// !  get single user ------------------------------>>>
// router.get(
//   '/:userId',
//   auth(userRole.admin, userRole.superadmin),
//   UserController.getSingleUser
// );

export const UserRoutes = router;
