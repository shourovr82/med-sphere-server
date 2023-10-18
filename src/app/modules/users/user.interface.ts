import { Profile, userRole } from '@prisma/client';
import { ENUM_USER_ROLE } from '../../../enums/user';

export type IRequestUser = {
  role: userRole;
  userId: string;
  profileId: string;
  iat: number;
  exp: number;
};

export type IUsersResponse = {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile: Profile | null;
};

export type IUserUpdateReqAndResponse = {
  email?: string;
  oldPassword?: string;
  newPassword?: string;
};
export type IUpdateUserResponse = {
  message: string;
  updatedInfo: { email?: string; password?: string };
};
export type IProfileUpdateRequest = {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  contactNumber?: string;
  address?: string;
  coverPhoto?: string;
  bloodGroup?: string;
  role?: userRole;
};
export type IProfileMyUpdateRequest = {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  contactNumber?: string;
  address?: string;
  coverPhoto?: string;
  bloodGroup?: string;
};
export type IUpdateMyProfileInfoResponse = {
  message: string;
  updatedInfo: IProfileUpdateRequest;
};

export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  role?: ENUM_USER_ROLE | undefined;
};

export type IGetAllUserResponse = {
  email: string;
  userId: string;
  profileId: string | null;
  profile: Profile | null;
};
