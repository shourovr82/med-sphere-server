import { z } from 'zod';

const createSlot = z.object({
  body: z.object({
    slotTime: z.string({
      required_error: 'StarTime is required',
      invalid_type_error: 'Start Time must be in  Date string',
    }),
  }),
});

export const SlotValidation = {
  createSlot,
};
