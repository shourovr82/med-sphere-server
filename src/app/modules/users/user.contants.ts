export const UserSearchableFields: string[] = ['profileId', 'email'];

export const userRelationalFields: string[] = ['profileId'];
export const userRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
export const userFilterableFields: string[] = ['searchTerm', 'profileId'];
