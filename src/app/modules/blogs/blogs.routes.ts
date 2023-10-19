import express from 'express';

import auth from '../../middlewares/auth';
import { BlogsController } from './blogs.controller';
import { BlogValidation } from './blogs.validation';
import { userRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-blog',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(BlogValidation.createBlog),
  BlogsController.createNewBlog
);
router.get('/:blogId', BlogsController.getSingleBlog);

router.get('/', BlogsController.getAllBlogs);

router.patch(
  '/update/:blogId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  BlogsController.updateBlog
);
router.delete(
  '/delete/:blogId',
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  BlogsController.deleteBlog
);

export const BlogRoutes = router;
