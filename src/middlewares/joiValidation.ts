import { Schema, ValidationOptions } from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { intersection } from 'lodash';
import Boom from '@hapi/boom';
import { CustomJoiObject } from '../types/Schemas';
import joiMessage from '../config/spanish-joi-messages.json';

/**
 * Helper function to validate an object against the provided schema,
 * and throw a custom error if object is not valid.
 *
 * @param {Object} data The object to be validated.
 * @param {String} label The label to use in the error message.
 * @param {JoiSchema} schema The Joi schema to validate the object against.
 */
function validateObject(
  data: { [key: string]: string | number },
  label: string,
  schema: Schema,
  options?: ValidationOptions,
): void {
  // Skip validation if no schema is provided
  if (schema) {
    // Validate the object against the provided schema
    const { error } = schema.messages(joiMessage).validate(data, options);
    if (error) {
      // Throw error with custom message if validation failed
      const { details } = error;
      const validationsErrors = details.map((detail) => ({
        message: detail.message,
        field: detail.context.label,
        value: detail.context.value,
      }));
      throw Boom.badData(`Invalid request ${label}`, validationsErrors);
    }
  }
}

/**
 * Generate a middleware function to validate a request using
 * the provided validation objects.
 *
 * @param {Object} schema
 * Example:
 * const schema = { POST: {
 *    headers: {Joi.object.keys({....})} // The request headers schema
 *    params: {Joi.object.keys({....})} //The request params schema
 *    query: {Joi.object.keys({....})} // The request query schema
 *    body: {Joi.object.keys({....})} // The request body schema
 *  }
 * }
 */
const joiValidation = (selectedSchema: Partial<CustomJoiObject>) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!selectedSchema) {
    // If schema was not found we continue
    return next();
  }
  const defaultValidateKeys = ['body', 'query', 'params', 'headers'];
  const needValidateKeys = intersection(defaultValidateKeys, Object.keys(selectedSchema));
  if (needValidateKeys.length < 1) {
    throw new Error(`Invalid schema - ${req.url}`);
  }

  // Validate each request data object in the req object
  validateObject(
    req.headers as { [key: string]: string | number },
    'Headers',
    selectedSchema.headers,
    { allowUnknown: true },
  );

  // Abort Early doesn't stop joi validate at first error, so it returns all failed validations
  const options: ValidationOptions = { abortEarly: false };

  validateObject(req.params, 'URL Parameters', selectedSchema.params);
  validateObject(
    req.query as { [key: string]: string | number },
    'URL Query',
    selectedSchema.query,
  );
  validateObject(req.body, 'Body', selectedSchema.body, options);

  return next();
};

export default joiValidation;
