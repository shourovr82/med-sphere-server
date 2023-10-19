import { z } from 'zod';

const createSlot = z.object({
  body: z.object({
    slotTime: z.string({
      required_error: 'Slot Time is required',
      invalid_type_error: 'Slot Time must be in  Date string',
    }),
  }),
});

export const SlotValidation = {
  createSlot,
};
