/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUserCreate,
  IUserLogin,
} from './auth.interface';
import { userRole } from '@prisma/client';

// ! user create
const createNewUser = async (data: IUserCreate) => {
  const { password, email } = data;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );

  // transaction start
  const newUser = await prisma.$transaction(async transactionClient => {
    const isUserExist = await transactionClient.user.findFirst({
      where: { email },
    });

    if (isUserExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already in use');
    }

    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      profileImage: data.profileImage!,
      role: data.role!,
    };

    const createdProfile = await transactionClient.profile.create({
      data: {
        ...profileData,
      },
      select: {
        profileId: true,
        role: true,
      },
    });

    if (createdProfile.role == userRole.DOCTOR) {
      await transactionClient.doctor.create({
        data: {
          qualification: data.qualification,
          specializationId: data.specializationId,
          profileId: createdProfile.profileId,
        },
        select: {
          profileId: true,
          createdAt: true,
        },
      });
    }

    const createdUser = await transactionClient.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          connect: {
            profileId: createdProfile.profileId,
          },
        },
      },
      select: {
        profileId: true,
        createdAt: true,
        email: true,
        userId: true,
      },
    });

    if (!createdUser || !createdProfile) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Creating New User Failed');
    }

    return createdUser;
  });

  return newUser;
};

//! login
const userLogin = async (
  loginData: IUserLogin
): Promise<ILoginUserResponse> => {
  const { email, password } = loginData;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      userId: true,
      password: true,
      email: true,
      profile: {
        select: {
          role: true,
          profileId: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found !!');
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist?.password);

  if (isUserExist && !isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect !!');
  }

  type TokenData = {
    userId: string;
    email: string;
    role: userRole;
    profileId: string;
  };

  const tokenData: TokenData = {
    userId: isUserExist.userId,
    email: isUserExist.email,
    role: isUserExist?.profile?.role!,
    profileId: isUserExist.profile?.profileId!,
  };

  const accessToken = jwtHelpers.createToken(
    tokenData,
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    tokenData,
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

// !refreshToken --------------------------------
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // ! verify token
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    // err
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  //! if user not exist
  // !checking deleted user's refresh token
  const { userId } = verifiedToken;

  const isUserExist = await prisma.user.findFirst({
    where: {
      userId,
    },
    select: {
      userId: true,
      email: true,
      password: true,
      profile: {
        select: {
          role: true,
          profileId: true,
        },
      },
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists!!');
  }

  type TokenData = {
    userId: string;
    email: string;
    role: userRole;
    profileId: string;
  };

  const tokenData: TokenData = {
    userId: isUserExist.userId,
    email: isUserExist.email,
    role: isUserExist?.profile?.role!,
    profileId: isUserExist?.profile?.profileId!,
  };

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    tokenData,
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createNewUser,
  userLogin,
  refreshToken,
};
