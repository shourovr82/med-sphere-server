export const specializationFilterableFields: string[] = [
  'specializationName',
  'searchTerm',
];

export const specializationSearchableFields: string[] = ['specializationName'];

export const specializationFields: string[] = ['profileId'];
export const specializationRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
