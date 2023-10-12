export type IServiceCreateRequest = {
  serviceName: string;
  description: string;
  serviceImage: string;
  location: string;
  categoryId: string;
  servicePrice: number;
};

export type ICreateNewBlogResponse = {
  serviceId: string;
  categoryId: string;
  createdAt: Date;
};

export type IServiceFilterRequest = {
  searchTerm?: string | undefined;
  categoryId?: string | undefined;
};
