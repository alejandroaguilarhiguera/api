import { Connection } from 'mongoose';
// eslint-disable-next-line import/prefer-default-export
export class BaseController {
  public dbConnection: Connection;
  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }
}