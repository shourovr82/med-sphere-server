/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IAppointmentFilterRequest,
  ICreateAppointmentBookingReq,
  ICreateAppointmentBookingRes,
  IUpdateAppointmentBookingReq,
} from './appointmentBooking.interface';
import { AppointmentBooking, Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import {
  appointmentFields,
  appointmentRelationalFieldsMapper,
  appointmentSearchableFields,
} from './appointmentBooking.constant';

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

const getAllAppointment = async (
  filters: IAppointmentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AppointmentBooking[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: appointmentSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (appointmentFields.includes(key)) {
          return {
            [appointmentRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.AppointmentBookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointmentBooking.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.appointmentBooking.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ! update Category ----------------------
const updateAppointment = async (
  appointmentId: string,
  payload: Partial<IUpdateAppointmentBookingReq>
): Promise<AppointmentBooking | null> => {
  const isExist = await prisma.appointmentBooking.findUnique({
    where: {
      appointmentId,
    },
  });

  if (!isExist) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Appointment Booking Not Found !!!'
    );
  }

  const updateData = {
    serviceId: payload?.serviceId,
    appointmentDate: payload?.appointmentDate,
    slotId: payload?.slotId,
  };

  const result = await prisma.appointmentBooking.update({
    where: {
      appointmentId,
    },
    data: updateData,
  });
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Updating Failed !!!');
  }
  return result;
};

const deleteAppointment = async (
  appointmentId: string
): Promise<AppointmentBooking | null> => {
  const result = await prisma.$transaction(async transactionClient => {
    const isExist = await transactionClient.appointmentBooking.findUnique({
      where: {
        appointmentId,
      },
    });

    if (!isExist) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Appointment Booking Not Found');
    }

    const BookingDeleted = await transactionClient.appointmentBooking.delete({
      where: {
        appointmentId,
      },
    });

    return BookingDeleted;
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment Booking Not Deleted');
  }
  return result;
};

export const AppointmentBookingService = {
  createAppointmentBooking,
  getAllAppointment,
  deleteAppointment,
  updateAppointment,
};
