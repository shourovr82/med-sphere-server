import { Profile, userRole } from '@prisma/client';

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
  password?: string;
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
export type IUpdateMyProfileInfoResponse = {
  message: string;
  updatedInfo: IProfileUpdateRequest;
};
