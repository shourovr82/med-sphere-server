import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AppointmentBookingService } from './appointmentBooking.service';
import { IRequestUser } from '../users/user.interface';

//! createNewAppointmentBooking

const createNewAppointmentBooking = catchAsync(
  async (req: Request, res: Response) => {
    const profileId = (req.user as IRequestUser).profileId;
    const result = await AppointmentBookingService.createAppointmentBooking(
      profileId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'AppointmentBooking created successfully!',
      data: result,
    });
  }
);

export const AppointmentBookingController = {
  createNewAppointmentBooking,
};
