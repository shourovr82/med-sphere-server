/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

import bcrypt from 'bcrypt';
import config from '../../../config';
import {
  IProfileUpdateRequest,
  IUpdateUserResponse,
  IUserUpdateReqAndResponse,
  IUsersResponse,
} from './user.interface';

// ! getting all users ----------------------------------------------------------------------->>>
const getAllUserService = async (options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      userId: true,
      email: true,
      createdAt: true,
      profile: true,
    },
  });
  const total = await prisma.user.count();

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ! getting single user data -------------------------------------------------------->>>
const getSingleUser = async (
  userId: string
): Promise<IUsersResponse | null> => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      profileId: true,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  const result = await prisma.user.findUnique({
    where: {
      profileId: existingUser.profileId!,
    },
    select: {
      userId: true,
      email: true,
      profile: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not Found !!');
  }

  return result;
};

const updateProfileInfo = async (
  profileId: string,
  payload: IProfileUpdateRequest
): Promise<{
  message: string;
  updatedInfo: IProfileUpdateRequest;
}> => {
  // Ensure ProfileId cannot be changed
  if ('profileId' in payload) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile ID cannot be changed');
  }

  // Check if the profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: {
      profileId,
    },
  });

  if (!existingProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found!');
  }

  // Extract relevant properties from the payload
  const { firstName, lastName, profileImage, role } = payload;

  // Build the update data based on provided fields
  const updateData: Partial<IProfileUpdateRequest> = {};

  if (firstName !== undefined) {
    updateData.firstName = firstName;
  }

  if (lastName !== undefined) {
    updateData.lastName = lastName;
  }

  if (profileImage !== undefined) {
    updateData.profileImage = profileImage;
  }

  if (role !== undefined) {
    updateData.role = role;
  }

  // Check if any data is provided for update
  if (Object.keys(updateData).length === 0) {
    return {
      message: 'No changes to update',
      updatedInfo: {},
    };
  }

  // Update the profile
  const result = await prisma.profile.update({
    where: {
      profileId,
    },
    data: updateData,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile update failed');
  }

  return {
    message: 'Profile information updated successfully',
    updatedInfo: updateData,
  };
};
const updateMyProfileInfo = async (
  profileId: string,
  payload: IProfileUpdateRequest
): Promise<{
  message: string;
  updatedInfo: IProfileUpdateRequest;
}> => {
  // Ensure ProfileId cannot be changed
  if ('profileId' in payload) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile ID cannot be changed');
  }

  // Check if the profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: {
      profileId,
    },
  });

  if (!existingProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found!');
  }

  // Extract relevant properties from the payload
  const { firstName, lastName, profileImage, role } = payload;

  // Build the update data based on provided fields
  const updateData: Partial<IProfileUpdateRequest> = {};

  if (firstName !== undefined) {
    updateData.firstName = firstName;
  }

  if (lastName !== undefined) {
    updateData.lastName = lastName;
  }

  if (profileImage !== undefined) {
    updateData.profileImage = profileImage;
  }

  if (role !== undefined) {
    updateData.role = role;
  }

  // Check if any data is provided for update
  if (Object.keys(updateData).length === 0) {
    return {
      message: 'No changes to update',
      updatedInfo: {},
    };
  }

  // Update the profile
  const result = await prisma.profile.update({
    where: {
      profileId,
    },
    data: updateData,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile update failed');
  }

  return {
    message: 'Profile information updated successfully',
    updatedInfo: updateData,
  };
};

// ! update user info -------------------------------------------------------->>>

const updateUserInfo = async (
  userId: string,
  { password, email }: IUserUpdateReqAndResponse
): Promise<IUpdateUserResponse> => {
  if ('userId' in { userId, password, email }) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User ID cannot be changed');
  }

  const existingUser = await prisma.user.findUnique({ where: { userId } });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const updatedData: { email?: string; password?: string } = {};

  if (password) {
    const hashPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
    );
    updatedData.password = hashPassword;
  }

  if (email) {
    updatedData.email = email;
  }

  if (Object.keys(updatedData).length === 0) {
    return {
      message: 'No changes to update',
      updatedInfo: {},
    };
  }

  const result = await prisma.user.update({
    where: { userId },
    data: updatedData,
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User update failed');
  }

  return {
    message: 'User information updated successfully',
    updatedInfo: {
      email: email || 'Not updated',
      password: password ? 'Updated' : 'Not updated',
    },
  };
};

//! get my profile ----------------------------------------------------------------------->>>
const getMyProfile = async (userId: string): Promise<IUsersResponse | null> => {
  const result = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
      email: true,
      profile: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  return result;
};

// ! --------------- exports all user service
export const UserService = {
  getAllUserService,
  getSingleUser,
  updateProfileInfo,
  updateUserInfo,
  getMyProfile,
  updateMyProfileInfo,
};
