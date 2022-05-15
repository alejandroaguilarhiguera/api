import { Express } from 'express';
import NodeCache from 'node-cache';
import { Connection } from 'mongoose';
import { Locals } from '../Locals';

declare module 'express' {
  interface Application {
    dbConnection: Connection;
    cache: NodeCache;
  }

  export interface ParamsDictionary {
    [key: string]: string;
  }

  export type ParamsArray = string[];
  export type Params = ParamsDictionary | ParamsArray;

  export interface Request extends Express.Request {
    app: Application;
    readonly locals?: Locals;
    setLocal: (key: keyof Locals, value: unknown) => void;
  }
}
