import { z } from 'zod';

const createSpecialization = z.object({
  body: z.object({
    specializationName: z.string({
      required_error: 'specializationName is Required'
    }),
    description: z.string({
      required_error: 'description is Required'
    })
  })
});

const updateSpecialization = z.object({
  body: z.object({
    specializationName: z.string().optional(),
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

export const SpecializationValidation = {
  createSpecialization,
  updateSpecialization,
  factoryStyleAssign
};
