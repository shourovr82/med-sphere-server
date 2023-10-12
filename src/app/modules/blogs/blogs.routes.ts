import express, { NextFunction, Request, Response } from 'express';

import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import auth from '../../middlewares/auth';
import { BlogsController } from './blogs.controller';
import { BlogValidation } from './blogs.validation';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/create-blog',
  auth(userRole.ADMIN),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BlogValidation.createBlog.parse(JSON.parse(req.body.data));
    return BlogsController.createNewStyle(req, res, next);
  }
);
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

export const BlogRoutes = router;
