export type ICreateReviewAndRatingReq = {
  reviewComment: string;
  reviewRating: string;
  serviceId: string;
};
export type ICreateReviewAndRatingResponse = {
  reviewComment: string;
  reviewRating: string;
  createdAt: Date;
};

export type IUpdateReviewRequest = {
  reviewComment?: string;
  reviewRating?: string;
};
