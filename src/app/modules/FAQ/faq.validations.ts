import { z } from 'zod';

const createFaq = z.object({
  body: z.object({
    faqTitle: z.string({
      required_error: 'Faq Title  is required',
      invalid_type_error: 'Faq Title must be in   string'
    }),
    faqDescription: z.string({
      required_error: 'Faq Description   is required',
      invalid_type_error: 'Faq Description must be in   string'
    })
  })
});
const updateFaq = z.object({
  body: z.object({
    faqTitle: z
      .string({
        invalid_type_error: 'Faq Title must be in   string'
      })
      .optional(),
    faqDescription: z
      .string({
        invalid_type_error: 'Faq Description must be in   string'
      })
      .optional()
  })
});

export const FaqValidation = {
  createFaq,
  updateFaq
};
