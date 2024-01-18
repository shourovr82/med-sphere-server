import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../shared/prisma';

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // If there's no token, the user is not authorized.
      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized user'
        );
      }

      // Verify the token using JWT helper.
      const verifiedUser: JwtPayload = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      // Check if the user exists in the database.
      const isUserExist = await prisma.user.findUnique({
        where: {
          userId: verifiedUser?.userId,
          profile: {
            profileId: verifiedUser?.profileId
          }
        },
        select: {
          email: true,
          userId: true,
          profile: {
            select: {
              profileId: true
            }
          }
        }
      });

      // // If the user doesn't exist, they are not a valid user.
      if (!isUserExist)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not a valid user');

      //  Set the authenticated user on the request object.
      req.user = verifiedUser; // Include user role and ID

      // Checking if the user has the required roles for access.
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        const rolesString = requiredRoles.join(', ');
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Access Forbidden. Required role(s): ${rolesString}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
