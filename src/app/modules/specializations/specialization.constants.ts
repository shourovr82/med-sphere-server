export const stylesFilterableFields: string[] = [
  'orderNo',
  'searchTerm',
  'factoryId',
  'styleNo',
  'profileId',
  'itemId',
  'createdAt',
  'startDate',
  'endDate',
];

export const specializationSearchableFields: string[] = [
  'specializationName',
];

export const specializationFields: string[] = ['profileId'];
export const specializationRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
