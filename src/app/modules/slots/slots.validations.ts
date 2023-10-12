import { z } from 'zod';
import { isValidISOString } from '../../../shared/utils';

const createSlot = z.object({
  body: z.object({
    startTime: z
      .string({
        required_error: 'StarTime is required',
        invalid_type_error: 'Start Time must be in  Date string',
      })
      .refine(value => isValidISOString(value)),
    endTime: z
      .string({
        required_error: 'End Time is required',
        invalid_type_error: 'End Time must be in Date string',
      })
      .refine(value => isValidISOString(value)),
  }),
});

export const SlotValidation = {
  createSlot,
};
