export type IProductFilterRequest = {
  searchTerm?: string | undefined;
  productId?: string | undefined;
  productTitle?: string | undefined;
  productPrice?: string | undefined;
};

export type IProductCreateRequest = {
  productTitle: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  serviceId: string;
};

export type IUpdateProductRequest = {
  productTitle?: string;
  productDescription?: string;
  productPrice?: number;
  productImage?: string;
  serviceId?: string;
};
