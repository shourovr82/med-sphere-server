export type ICreateFeedBackFormReq = {
  feedbackSubject: string;
  feedbackComment: string;
};
export type ICreateFeedBackFormResponse = {
  feedbackSubject: string;
  feedbackComment: string;
  createdAt: Date;
};

export type IFeedBackFilterRequest = {
  searchTerm?: string | undefined;
  feedbackSubject?: string | undefined;
  profile?: string | undefined;
};

export type IUpdateFeedBackRequest = {
  feedbackSubject?: string;
  feedbackComment?: string;
};
