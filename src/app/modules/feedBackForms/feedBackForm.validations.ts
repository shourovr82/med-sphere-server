import { z } from 'zod';

const createFeedBack = z.object({
  body: z.object({
    feedbackSubject: z.string({
      required_error: ' Feedback subject  is required',
      invalid_type_error: 'Feedback  subject  must be in   string',
    }),
    feedbackComment: z.string({
      required_error: 'feedback Comment  is required',
      invalid_type_error: 'Comment must be in   string',
    }),
  }),
});

export const FeedBackValidation = {
  createFeedBack,
};
