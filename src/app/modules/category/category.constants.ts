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

export const categorySearchableFields: string[] = [
  'categoryName',
];

export const categoryFields: string[] = ['profileId'];
export const categoryRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
