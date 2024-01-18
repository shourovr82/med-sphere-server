import { z } from 'zod';

const createProduct = z.object({
  body: z.object({
    productTitle: z.string({
      required_error: 'productTitle is Required'
    }),
    serviceId: z.string({
      required_error: 'serviceId is Required'
    }),
    productImage: z.string({
      required_error: 'productImage is Required'
    }),
    productPrice: z.number({
      required_error: 'productPrice is Required'
    })
  })
});

const updateProduct = z.object({
  body: z.object({
    productTitle: z.string().optional(),
    productImage: z.string().optional(),
    productPrice: z.number().optional()
  })
});

export const ProductValidation = {
  createProduct,
  updateProduct
};
