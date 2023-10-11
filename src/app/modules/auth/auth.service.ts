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

const createNewUser = async (req: Request) => {
  const file = req.file as IUploadFile;

  const uploadedImage = await FileUploadHelper.uploadUserImageToCloudinary(
    file
  );

  if (uploadedImage) {
    req.body.profileImage = uploadedImage.secure_url;
  }
  const data = req.body as IUserCreate;

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
      profileImage: data?.profileImage,
      role: data?.role,
    };

    const createdProfile = await transactionClient.profile.create({
      data: profileData,
    });

    if (!createdProfile) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Profile creation failed');
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
        userId: true,
        email: true,
        createdAt: true,
        userIsActive: true,
        profile: true,
      },
    });

    if (!createdUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    return createdUser;
  });

  return newUser;
};

//login
const userLogin = async (
  loginData: IUserLogin
): Promise<ILoginUserResponse> => {
  const { email, password } = loginData;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: {
        select: {
          profileId: true,
          role: true,
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

  const { userId, profile } = isUserExist;

  // create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    {
      userId,
      role: profile?.role,
      profileId: profile?.profileId,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    {
      userId: isUserExist.userId,
      role: profile?.role,
      profileId: profile?.profileId,
    },
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
    include: {
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
  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist?.userId,
      role: isUserExist?.profile?.role,
      profileId: isUserExist?.profile?.profileId,
    },
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
