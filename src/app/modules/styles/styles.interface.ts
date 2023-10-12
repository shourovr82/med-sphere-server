export type IBlogFilterRequest = {
  searchTerm?: string | undefined;
  profileId?: string | undefined;
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

export type IFactoryAssignToStyleResponse = {
  styleNo: string;
  factoryId: string;
};
