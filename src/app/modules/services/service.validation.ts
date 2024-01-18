import { z } from 'zod';
import { ZodServiceStatus } from './service.constants';

const createService = z.object({
  body: z.object({
    serviceName: z.string({
      required_error: 'Service Name is Required'
    }),
    description: z.string({
      required_error: 'Description is Required'
    }),
    location: z.string({
      required_error: 'Location is Required'
    }),
    categoryId: z.string({
      required_error: 'categoryId is Required'
    }),
    serviceImage: z.string({
      required_error: 'serviceImage is Required'
    }),
    servicePrice: z.number({
      required_error: 'Service Price is Required'
    }),
    serviceStatus: z.enum([...ZodServiceStatus] as [string, ...string[]], {
      required_error: 'Service Status is Required'
    })
  })
});
//
const updateService = z.object({
  body: z.object({
    serviceName: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    categoryId: z.string().optional(),
    serviceImage: z.string().optional(),
    servicePrice: z.number().optional(),
    serviceStatus: z
      .enum([...ZodServiceStatus] as [string, ...string[]])
      .optional()
  })
});
export const ServicesValidation = {
  createService,
  updateService
};
