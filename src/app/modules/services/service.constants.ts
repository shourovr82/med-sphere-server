export const ServiceFilterableFields: string[] = [
  'searchTerm',
  'serviceName',
  'createdAt',
  'location',
  'servicePrice'
];

export const serviceSearchableFields: string[] = ['serviceName', 'location'];

export const serviceRelationalFields: string[] = ['categoryId'];
export const serviceRelationalFieldsMapper: { [key: string]: string } = {
  categoryId: 'categoryId'
};

export const ZodServiceStatus: string[] = ['available', 'upcoming'];
