export type ICreateNewFaqReq = {
  faqTitle: string;
  faqDescription: string;
};
export type ICreateReviewAndRatingResponse = {
  faqTitle: string;
  faqDescription: string;
  createdAt: Date;
};
export type IUpdateFaqReq = {
  faqTitle?: string;
  faqDescription?: string;
};
