export type ICreateAppointmentBookingReq = {
  serviceId: string;
  appointmentDate: Date;
  slotId: string;
};

export type ICreateAppointmentBookingRes = {
  appointmentDate: Date;
  createdAt: Date;
};

export type IUpdateAppointmentBookingReq = {
  serviceId?: string;
  appointmentDate?: Date;
  slotId?: string;
};

export type IAppointmentFilterRequest = {
  searchTerm?: string | undefined;
  serviceId?: string | undefined;
  appointmentDate?: string | undefined;
  slotId?: string | undefined;
};
