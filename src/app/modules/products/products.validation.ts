import { z } from 'zod';

const createStyle = z.object({
  styleNo: z.string({
    invalid_type_error: 'Style No must be in String',
    required_error: 'Style No is Required',
  }),
  itemId: z.string({
    required_error: 'Item ID is Required',
    invalid_type_error: 'Item id must be in String',
  }),
  fabric: z.string({
    required_error: 'Fabric is Required',
    invalid_type_error: 'Fabric must be in String',
  }),
});

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
const factoryStyleAssign = z.object({
  body: z.object({
    factoryId: z.string({
      required_error: 'Factory Id is Required',
      invalid_type_error: 'Factory ID must be in String',
    }),
    styleNo: z.string({
      required_error: 'Style No is Required',
      invalid_type_error: 'Style No must be in String',
    }),
  }),
});

export const StylesValidation = {
  createStyle,
  updateStyle,
  factoryStyleAssign,
};
