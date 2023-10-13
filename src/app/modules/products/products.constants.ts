export const ProductFilterableFields: string[] = [
  'productPrice',
  'searchTerm',
  'productTitle',
];

export const ProductSearchableFields: string[] = [
  'productTitle',
];

export const productRelationalFields: string[] = ['profileId'];
export const productRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
