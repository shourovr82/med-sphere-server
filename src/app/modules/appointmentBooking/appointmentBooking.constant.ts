export const appointmentFilterableFields: string[] = [
  'slotId',
  'searchTerm',
  'appointmentDate',
  'serviceId',
];

export const appointmentSearchableFields: string[] = [
  'serviceId',
  'appointmentDate',
  'slotId',
];

export const appointmentFields: string[] = ['profileId'];
export const appointmentRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
