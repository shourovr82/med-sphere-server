import { userRole } from '@prisma/client';
export type IUserCreate = {
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string;
  password: string;
  role: userRole;
  qualification: string;
  specializationId: string;
};

export type IUserProfileResponse = {
  profileId: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null | undefined;
  role: userRole | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserResponse = {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile: IUserProfileResponse;
};

export type IUserLogin = {
  email: string;
  password: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
