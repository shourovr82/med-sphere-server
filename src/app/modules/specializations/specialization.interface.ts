export type ISpecializationFilterRequest = {
  searchTerm?: string | undefined;
  specializationId?: string | undefined;
  specializationName?: string | undefined;
};

export type ISpecializationReq = {
  specializationName: string;
  description: string;
};
export type IUpdateSpecializationRequest = {
  specializationName?: string;
  description?: string;
  createdAt: string;
};
