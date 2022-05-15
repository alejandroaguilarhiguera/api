import { Express } from 'express';
import NodeCache from 'node-cache';
import { Connection } from 'mongoose';

declare module 'express-serve-static-core' {
  export interface Application {
    dbConnection: Connection;
    cache: NodeCache;
  }

  export interface Request extends Express.Request {
    app: Application;
    user?: {
      _id: string;
      role: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly locals?: { [key: string]: any };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setLocal: (key: string, value: any) => void;
  }
}
