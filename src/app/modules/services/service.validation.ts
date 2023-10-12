import { z } from 'zod';

const createService = z.object({
  serviceName: z.string({
    required_error: 'Service Name is Required',
    invalid_type_error: 'Blog Title must be in String',
  }),
  description: z.string({
    required_error: 'Description is Required',
    invalid_type_error: 'Description must be in String',
  }),
  location: z.string({
    required_error: 'Location is Required',
    invalid_type_error: 'Location must be in String',
  }),
  categoryId: z.string({
    required_error: 'categoryId is Required',
    invalid_type_error: 'categoryId must be in String',
  }),
  servicePrice: z.number({
    required_error: 'Service Price is Required',
    invalid_type_error: 'Service Price must be in Number',
  }),
});
//
const updateStyle = z.object({
  body: z.object({
    itemId: z
      .string({ invalid_type_error: 'Item ID must be in String' })
      .optional(),
    image: z
      .string({ invalid_type_error: 'Image Link must be in String' })
      .optional(),
    fabric: z
      .string({ invalid_type_error: 'Fabric must be in String' })
      .optional(),
    isActiveStyle: z
      .boolean({
        invalid_type_error: 'Is active Style must be between true or false',
      })
      .optional(),
    factoryId: z
      .string({
        invalid_type_error: 'Factory ID must be in String',
      })
      .optional(),
  }),
});

export const MedServiceValidation = {
  createService,
  updateStyle,
};
