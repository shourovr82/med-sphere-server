import { z } from 'zod';

const createCategory = z.object({
  body: z.object({
    categoryName: z.string({
      required_error: 'categoryName is Required'
    }),
    description: z.string({
      required_error: 'description is Required'
    })
  })
});

const updateCategory = z.object({
  body: z.object({
    categoryName: z.string().optional(),
    description: z.string().optional()
  })
});
const factoryStyleAssign = z.object({
  body: z.object({
    factoryId: z.string({
      required_error: 'Factory Id is Required',
      invalid_type_error: 'Factory ID must be in String'
    }),
    styleNo: z.string({
      required_error: 'Style No is Required',
      invalid_type_error: 'Style No must be in String'
    })
  })
});

export const CategoryValidation = {
  createCategory,
  updateCategory,
  factoryStyleAssign
};
