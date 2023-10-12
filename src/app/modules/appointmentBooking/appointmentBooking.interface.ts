export type ICreateAppointmentBookingReq = {
  serviceId: string;
  appointmentDate: Date;
  slotId: string;
};

export type ICreateAppointmentBookingRes = {
  appointmentDate: Date;
  createdAt: Date;
};
