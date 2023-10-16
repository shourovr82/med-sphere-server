import { z } from 'zod';

const createBlog = z.object({
  body: z.object({
    blogTitle: z.string({
      required_error: 'Blog Title is Required',
      invalid_type_error: 'Blog Title must be in String',
    }),
    blogDescription: z.string({
      required_error: 'Blog Description is Required',
      invalid_type_error: 'Blog Description must be in String',
    }),
    blogImage: z.string({
      required_error: 'Blog blogImage is Required',
      invalid_type_error: 'Blog Image must be in String',
    }),
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

export const BlogValidation = {
  createBlog,
  updateStyle,
};
