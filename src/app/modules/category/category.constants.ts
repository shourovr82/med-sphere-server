export const categoryFilterableFields: string[] = ['searchTerm', 'createdAt'];

export const categorySearchableFields: string[] = ['categoryName'];

export const categoryFields: string[] = ['profileId'];
export const categoryRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
