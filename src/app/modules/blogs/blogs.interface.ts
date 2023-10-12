export type IBlogCreateRequest = {
  blogTitle: string;
  blogDescription: string;
  blogImage: string;
};
export type ICreateNewBlogResponse = {
  blogId: string;
  blogTitle: string;
  createdAt: Date;
};

export type IBlogFilterRequest = {
  searchTerm?: string | undefined;
  profileId?: string | undefined;
};
