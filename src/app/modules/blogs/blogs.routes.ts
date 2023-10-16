import express from 'express';

import auth from '../../middlewares/auth';
import { BlogsController } from './blogs.controller';
import { BlogValidation } from './blogs.validation';
import { userRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-blog',
  auth(userRole.ADMIN),
  validateRequest(BlogValidation.createBlog),
  BlogsController.createNewBlog
);
router.get('/', BlogsController.getAllBlogs);
router.get('/:blogId', BlogsController.getSingleBlog);

router.get(
  '/',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  BlogsController.getAllBlogs
);
router.get(
  '/:blogId',
  auth(userRole.USER, userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  BlogsController.getSingleBlog
);

router.patch(
  '/:blogId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  BlogsController.updateBlog
);
router.delete(
  '/:blogId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  BlogsController.deleteBlog
);

export const BlogRoutes = router;
