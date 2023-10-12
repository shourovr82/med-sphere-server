export const blogFilterableFields: string[] = [
  'searchTerm',
  'profileId',
  'createdAt',
];

export const blogSearchableFields: string[] = [
  'blogId',
  'profileId',
  'blogTitle',
  'blogDescription',
];

export const blogRelationalFields: string[] = ['profileId'];
export const blogRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
