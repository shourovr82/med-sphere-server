/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt';
import { Request } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { FileUploadHelper } from '../../../helpers/FileUploadHelper';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUploadFile } from '../../../interfaces/file';
import prisma from '../../../shared/prisma';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUserCreate,
  IUserLogin,
} from './auth.interface';
import { userRole } from '@prisma/client';

// ! user create
const createNewUser = async (req: Request) => {
  const file = req.file as IUploadFile;

  const uploadedImage = await FileUploadHelper.uploadUserImageToCloudinary(
    file
  );

  if (uploadedImage) {
    req.body.profileImage = uploadedImage.secure_url;
  }
  const data = (await req.body) as IUserCreate;

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
    };
    let createdProfile;
    let createdUser;

    if (data.role === userRole.USER) {
      createdProfile = await transactionClient.userProfile.create({
        data: profileData,
      });

      if (!createdProfile) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Profile creation failed');
      }

      createdUser = await transactionClient.user.create({
        data: {
          email,
          password: hashedPassword,
          role: data.role,
          userProfile: {
            connect: {
              userProfileId: createdProfile.userProfileId,
            },
          },
        },
        select: {
          userProfileId: true,
          createdAt: true,
          email: true,
          userId: true,
        },
      });
    } else if (data.role === userRole.ADMIN) {
      createdProfile = await transactionClient.adminProfile.create({
        data: profileData,
      });

      if (!createdProfile) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Admin creation failed');
      }

      createdUser = await transactionClient.user.create({
        data: {
          email,
          role: data.role,
          password: hashedPassword,
          adminProfile: {
            connect: {
              adminProfileId: createdProfile.adminProfileId,
            },
          },
        },
        select: {
          adminProfileId: true,
          createdAt: true,
          email: true,
          userId: true,
        },
      });
    } else if (data.role === userRole.SUPER_ADMIN) {
      createdProfile = await transactionClient.superAdminProfile.create({
        data: profileData,
      });

      if (!createdProfile) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Admin creation failed');
      }

      createdUser = await transactionClient.user.create({
        data: {
          email,
          role: data.role,
          password: hashedPassword,
          superAdminProfile: {
            connect: {
              superAdminProfileId: createdProfile.superAdminProfileId,
            },
          },
        },
        select: {
          superAdminProfileId: true,
          createdAt: true,
          email: true,
          userId: true,
        },
      });
    }

    if (!createdUser && !createdProfile) {
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
      email: true,
      role: true,
      password: true,
      adminProfile: true,
      userProfile: true,
      superAdminProfile: true,
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
    role: userRole;
    profileId?: string;
  };

  const tokenData: TokenData = {
    userId: isUserExist.userId,
    role: isUserExist?.role,
  };

  if (isUserExist.role === userRole.USER) {
    tokenData['profileId'] = isUserExist?.userProfile?.userProfileId!;
  } else if (isUserExist.role === userRole.ADMIN) {
    tokenData['profileId'] = isUserExist?.adminProfile?.adminProfileId!;
  }
  if (isUserExist.role === userRole.SUPER_ADMIN) {
    tokenData['profileId'] =
      isUserExist?.superAdminProfile?.superAdminProfileId!;
  }

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

  console.log(token, 'shafin=========');

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    console.log(error);
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
      role: true,
      password: true,
      adminProfile: true,
      userProfile: true,
      superAdminProfile: true,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists!!');
  }

  type TokenData = {
    userId: string;
    role: userRole;
    profileId?: string;
  };

  const tokenData: TokenData = {
    userId: isUserExist.userId,
    role: isUserExist?.role,
  };

  if (isUserExist.role === userRole.USER) {
    tokenData['profileId'] = isUserExist?.userProfile?.userProfileId!;
  } else if (isUserExist.role === userRole.ADMIN) {
    tokenData['profileId'] = isUserExist?.adminProfile?.adminProfileId!;
  }
  if (isUserExist.role === userRole.SUPER_ADMIN) {
    tokenData['profileId'] =
      isUserExist?.superAdminProfile?.superAdminProfileId!;
  }

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
