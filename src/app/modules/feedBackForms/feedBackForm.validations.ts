import { z } from 'zod';

const createFeedBack = z.object({
  body: z.object({
    feedbackComment: z.string({
      required_error: ' Feedback Comment  is required',
      invalid_type_error: 'Feedback Comment  must be in   string',
    }),
    serviceId: z.string({
      required_error: 'Service Id is required',
      invalid_type_error: 'Service Id must be in   string',
    }),
  }),
});

export const FeedBackValidation = {
  createFeedBack,
};
