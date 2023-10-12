/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { TimeSlot } from '@prisma/client';
import { ICreateSlotReq, ICreateSlotResponse } from './slots.interface';

// ! user create
const createNewSlot = async (
  payload: ICreateSlotReq
): Promise<ICreateSlotResponse> => {
  //
  const existingSlot = await prisma.timeSlot.findFirst({
    where: {
      startTime: payload.startTime,
      endTime: payload.endTime,
    },
  });

  if (existingSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot already booked');
  }
  const createdNewSlot = await prisma.timeSlot.create({
    data: {
      startTime: payload.startTime,
      endTime: payload.endTime,
    },
    select: {
      slotId: true,
      startTime: true,
      endTime: true,
      createdAt: true,
    },
  });
  if (!createNewSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot already booked');
  }

  return createdNewSlot;
};

const getAllSlots = async (): Promise<TimeSlot[]> => {
  //
  const allSlots = await prisma.timeSlot.findMany({});

  return allSlots;
};

export const SlotService = {
  createNewSlot,
  getAllSlots,
};
