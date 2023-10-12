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

export const stylesSearchableFields: string[] = [
  'styleNo',
  'factoryId',
  'styleNo',
  'profileId',
  'itemId',
];

export const stylesRelationalFields: string[] = ['profileId'];
export const stylesRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
