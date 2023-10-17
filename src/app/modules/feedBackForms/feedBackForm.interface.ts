export type ICreateFeedBackFormReq = {
  feedbackSubject: string;
  feedbackDescription: string;
};
export type ICreateFeedBackFormResponse = {
  feedbackSubject: string;
  feedbackDescription: string;
  createdAt: Date;
};

export type IFeedBackFilterRequest = {
  searchTerm?: string | undefined;
  feedbackSubject?: string | undefined;
  profile?: string | undefined;
};

export type IUpdateFeedBackRequest = {
  feedbackSubject?: string;
  feedbackDescription?: string;
};
