import { Schema } from '@hapi/joi';

export interface CustomJoiObject {
  body: Schema;
  params: Schema;
  headers: Schema;
  query: Schema;
}

export interface CustomSchema {
  post?: Partial<CustomJoiObject>;
  patch?: Partial<CustomJoiObject>;
  get?: Partial<CustomJoiObject>;
}
