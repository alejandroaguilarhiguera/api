import Joi from '@hapi/joi';
import { CustomSchema } from '../types/Schemas'


const appointmentsSchema: CustomSchema = {
  post: {
    body: Joi.object().keys({
      name: Joi.string().required().max(200),
      email: Joi.string().email().required(),
      date: Joi.string().isoDate().required(),
    }),
  },
  patch: {
    body: Joi.object().keys({
      name: Joi.string().optional().max(200),
      email: Joi.string().email().optional(),
      date: Joi.string().isoDate().optional(),
    }),
  },
};

export default appointmentsSchema;
