export type ICreateFeedBackFormReq = {
  feedbackComment: string;
  serviceId: string;
};
export type ICreateFeedBackFormResponse = {
  feedbackComment: string;
  createdAt: Date;
};
