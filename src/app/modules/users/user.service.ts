/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

import bcrypt from 'bcrypt';
import config from '../../../config';
import {
  IGetAllUserResponse,
  IProfileMyUpdateRequest,
  IProfileUpdateRequest,
  IUpdateUserResponse,
  IUserFilterRequest,
  IUserUpdateReqAndResponse,
  IUsersResponse
} from './user.interface';
import { IGenericResponse } from '../../../interfaces/common';
import { Prisma } from '@prisma/client';
import {
  UserSearchableFields,
  userRelationalFields,
  userRelationalFieldsMapper
} from './user.constants';

// ! getting all users ----------------------------------------------------------------------->>>

const getAllUserService = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<IGetAllUserResponse[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, role, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: UserSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }))
    });
  }

  if (role) {
    andConditions.push({
      OR: [
        {
          profile: {
            role: {
              equals: role
            }
          }
        }
      ]
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (userRelationalFields.includes(key)) {
          return {
            [userRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key]
            }
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key]
            }
          };
        }
      })
    });
  }

  // @ts-ignore
  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    select: {
      email: true,
      createdAt: true,
      userId: true,
      profileId: true,
      profile: true
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc'
          }
  });
  const total = await prisma.user.count({
    where: whereConditions
  });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage
    },
    data: result
  };
};

// ! getting single user data -------------------------------------------------------->>>
const getSingleUser = async (
  userId: string
): Promise<IUsersResponse | null> => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      userId
    },
    select: {
      profileId: true
    }
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !!');
  }

  const result = await prisma.user.findUnique({
    where: {
      profileId: existingUser.profileId!
    },

    select: {
      userId: true,
      email: true,
      profile: true,
      createdAt: true,
      updatedAt: true
    }
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
      profileId
    }
  });

  if (!existingProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found!');
  }

  // Extract relevant properties from the payload
  const {
    firstName,
    lastName,
    profileImage,
    role,
    address,
    bloodGroup,
    contactNumber
  } = payload;

  // Build the update data based on provided fields
  const updateData: Partial<IProfileUpdateRequest> = {};

  if (firstName !== undefined) updateData.firstName = firstName;

  if (lastName !== undefined) updateData.lastName = lastName;

  if (profileImage !== undefined) updateData.profileImage = profileImage;

  if (role !== undefined) updateData.role = role;

  if (contactNumber !== undefined) updateData.contactNumber = contactNumber;

  if (address !== undefined) updateData.address = address;

  if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;

  // Check if any data is provided for update
  if (Object.keys(updateData).length === 0) {
    return {
      message: 'No changes to update',
      updatedInfo: {}
    };
  }

  // Update the profile
  const result = await prisma.profile.update({
    where: {
      profileId
    },
    data: updateData
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile update failed');
  }

  return {
    message: 'Profile information updated successfully',
    updatedInfo: updateData
  };
};
const updateMyProfileInfo = async (
  profileId: string,
  payload: IProfileMyUpdateRequest
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
      profileId
    }
  });

  if (!existingProfile)
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found!');

  // Extract relevant properties from the payload
  const {
    firstName,
    lastName,
    profileImage,
    address,
    bloodGroup,
    contactNumber,
    coverPhoto
  } = payload;

  // Build the update data based on provided fields
  const updateData: Partial<IProfileMyUpdateRequest> = {};

  if (firstName !== undefined) updateData.firstName = firstName;

  if (address !== undefined) updateData.address = address;

  if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;

  if (contactNumber !== undefined) updateData.contactNumber = contactNumber;

  if (coverPhoto !== undefined) updateData.coverPhoto = coverPhoto;

  if (lastName !== undefined) updateData.lastName = lastName;

  if (profileImage !== undefined) updateData.profileImage = profileImage;

  if (profileImage !== undefined) updateData.profileImage = profileImage;

  if (profileImage !== undefined) updateData.profileImage = profileImage;

  if (profileImage !== undefined) updateData.profileImage = profileImage;

  // Check if any data is provided for update
  if (Object.keys(updateData).length === 0) {
    return {
      message: 'No changes to update',
      updatedInfo: {}
    };
  }

  // Update the profile
  const result = await prisma.profile.update({
    where: {
      profileId
    },
    data: updateData
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile update failed');
  }

  return {
    message: 'Profile information updated successfully',
    updatedInfo: updateData
  };
};

// ! update user info -------------------------------------------------------->>>

const updateMyUserInfo = async (
  userId: string,
  payload: IUserUpdateReqAndResponse
): Promise<IUpdateUserResponse> => {
  const { oldPassword, newPassword, email } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      userId
    }
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found!');
  }

  const updatedData: { email?: string; password?: string } = {};

  if (oldPassword && newPassword) {
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );

    if (!isOldPasswordCorrect) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
    }

    const hashPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds)
    );
    updatedData.password = hashPassword;
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });

    if (existingEmail) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Email Already Exist!');
    } else {
      updatedData.email = email;
    }
  }

  if (Object.keys(updatedData).length === 0) {
    return {
      message: 'No changes to update',
      updatedInfo: {}
    };
  }

  const result = await prisma.user.update({
    where: { userId },
    data: updatedData
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User update failed');
  }

  return {
    message: 'User information updated successfully',
    updatedInfo: {
      email: email || 'Not updated',
      password: newPassword ? 'Updated' : 'Not updated'
    }
  };
};

//! get my profile ----------------------------------------------------------------------->>>
const getMyProfile = async (userId: string): Promise<IUsersResponse | null> => {
  const result = await prisma.user.findUnique({
    where: {
      userId
    },
    select: {
      userId: true,
      email: true,
      profile: true,
      createdAt: true,
      updatedAt: true
    }
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
  updateMyUserInfo,
  getMyProfile,
  updateMyProfileInfo
};
