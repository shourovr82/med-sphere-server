export const blogFilterableFields: string[] = [
  'searchTerm',
  'profileId',
  'createdAt',
];

export const serviceSearchableFields: string[] = [
  'serviceId',
  'serviceName',
  'description',
  'location',
  'categoryId',
  'servicePrice',
];

export const serviceRelationalFields: string[] = ['categoryId'];
export const serviceRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'categoryId',
};
