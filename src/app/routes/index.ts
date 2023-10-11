import express from 'express';

import { UserRoutes } from '../modules/users/user.routes';
// import { AuthRoutes } from '../modules/auth/auth.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  // {
  //   path: '/auth',
  //   route: AuthRoutes,
  // },
  // {
  //   path: '/styles',
  //   route: StyleRoutes,
  // }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
