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
      slotTime: payload.slotTime
    }
  });

  if (existingSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot already booked');
  }
  const createdNewSlot = await prisma.timeSlot.create({
    data: {
      slotTime: payload.slotTime
    },
    select: {
      slotId: true,
      slotTime: true,
      createdAt: true
    }
  });
  if (!createNewSlot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot already booked');
  }

  return createdNewSlot;
};

const getAllSlots = async (): Promise<TimeSlot[]> => {
  //
  const allSlots = await prisma.timeSlot.findMany({
    include: {
      _count: true,
      appointments: true
    }
  });

  return allSlots;
};

// ! update Slot ----------------------

// ! delete Service ----------------------

const SlotDelete = async (slotId: string): Promise<TimeSlot | null> => {
  //

  const isExistSlot = await prisma.timeSlot.findUnique({
    where: {
      slotId
    }
  });

  if (!isExistSlot) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time Slot Not Found !!!');
  }

  const result = await prisma.timeSlot.delete({
    where: {
      slotId
    }
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, ' Time Slot Not deleted !!!');
  }

  return result;
};

export const SlotService = {
  createNewSlot,
  getAllSlots,
  SlotDelete
};
