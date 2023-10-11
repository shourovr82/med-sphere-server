import { Factory } from '@prisma/client';

export type IStylesFilterRequest = {
  searchTerm?: string | undefined;
  factoryId?: string | undefined;
  styleNo?: string | undefined;
  profileId?: string | undefined;
  itemId?: string | undefined;
  startDate?: string | null; // Date range start
  endDate?: string | null;
};
export type IStyleCreateRequest = {
  styleNo: string;
  itemId: string;
  image: string;
  fabric: string;
};
export type IUpdateStyleRequest = {
  image?: string;
  fabric?: string;
  isActiveStyle?: boolean;
  factoryId?: string;
  itemId?: string;
};
export type IGetAllStyleNo = {
  styleNo: string;
};
export type IAssignedStyleResponse = {
  factory: Factory | null;
  styleNo: string;
};
export type IFactoryAssignToStyleResponse = {
  styleNo: string;
  factoryId: string;
};
