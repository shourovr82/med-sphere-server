export type ICreateSlotReq = {
  startTime: Date;
  endTime: Date;
};
export type ICreateSlotResponse = {
  slotId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
};
