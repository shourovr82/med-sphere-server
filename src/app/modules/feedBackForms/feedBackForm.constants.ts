export const FeedBackFilterableFields: string[] = [
  'feedbackComment',
  'searchTerm',
  'service',
  'profile',
];

export const FeedBackSearchableFields: string[] = [
  'feedbackComment',
  'service',
  'profile',
];

export const feedBackRelationalFields: string[] = ['profileId'];
export const feedBackRelationalFieldsMapper: { [key: string]: string } = {
  profileId: 'profileId',
};
