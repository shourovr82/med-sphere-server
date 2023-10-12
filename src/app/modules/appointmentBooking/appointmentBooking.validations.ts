import { z } from 'zod';
import { isValidISOString } from '../../../shared/utils';

const createAppointmentBooking = z.object({
  body: z.object({
    appointmentDate: z
      .string({
        required_error: 'Appointment Date is required',
      })
      .refine(value => isValidISOString(value)),
    slotId: z.string({
      required_error: 'Slot Id is required',
      invalid_type_error: 'Slot id must be in   string',
    }),
    serviceId: z.string({
      required_error: 'Service Id is required',
      invalid_type_error: 'Service Id must be in   string',
    }),
  }),
});

export const AppointmentBookingValidation = {
  createAppointmentBooking,
};
