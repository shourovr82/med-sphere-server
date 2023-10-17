import { z } from 'zod';

const createFeedBack = z.object({
  body: z.object({
    feedbackSubject: z.string({
      required_error: ' Feedback subject  is required',
      invalid_type_error: 'Feedback  subject  must be in   string',
    }),
    feedbackDescription: z.string({
      required_error: 'feedbackDescription Id is required',
      invalid_type_error: 'feedbackDescription Id must be in   string',
    }),
  }),
});

export const FeedBackValidation = {
  createFeedBack,
};
