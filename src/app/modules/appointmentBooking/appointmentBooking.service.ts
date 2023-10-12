/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICreateAppointmentBookingReq,
  ICreateAppointmentBookingRes,
} from './appointmentBooking.interface';

// ! appointment booking
const createAppointmentBooking = async (
  profileId: string,
  payload: ICreateAppointmentBookingReq
): Promise<ICreateAppointmentBookingRes> => {
  //
  const isExistingService = await prisma.service.findUnique({
    where: {
      serviceId: payload.serviceId,
    },
  });

  if (!isExistingService) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Service not found');
  }
  const isExistingSlot = await prisma.timeSlot.findUnique({
    where: {
      slotId: payload.slotId,
    },
  });

  if (!isExistingSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'slot not found');
  }

  const createdBooking = await prisma.appointmentBooking.create({
    data: {
      appointmentDate: payload.appointmentDate,
      serviceId: payload.serviceId,
      slotId: payload.slotId,
      profileId,
    },
    select: {
      appointmentDate: true,
      createdAt: true,
    },
  });
  if (!createdBooking) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Appointment Booking failed to add'
    );
  }

  return createdBooking;
};

export const AppointmentBookingService = {
  createAppointmentBooking,
};
