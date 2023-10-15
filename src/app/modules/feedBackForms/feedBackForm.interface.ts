export type ICreateFeedBackFormReq = {
  feedbackComment: string;
  serviceId: string;
};
export type ICreateFeedBackFormResponse = {
  feedbackComment: string;
  createdAt: Date;
};

export type IFeedBackFilterRequest = {
  searchTerm?: string | undefined;
  feedbackComment?: string | undefined;
  service?: string | undefined;
  profile?: string | undefined;
};

export type IUpdateFeedBackRequest = {
  feedbackComment?: string;
  serviceId?: string;
};
