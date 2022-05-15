/* eslint-disable max-classes-per-file, no-global-assign */
import express, { Request, Router } from 'express';
import apicache from 'apicache';
import { Connection } from 'mongoose';
import httpContext from 'express-http-context';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import NodeCache from 'node-cache';
import chalk from 'chalk';
import asyncify from 'express-asyncify';
import api from './api';
import mongooseConnection from './utils/mongooseConnection';
import errorHandler from './middlewares/errorHandler';
import errorRateLimit from './middlewares/errorRateLimit';
import notFoundHandler from './middlewares/notFoundHandler';
 

export default class Server {
  protected app: express.Application;
  protected startDate: number;

  constructor() {
    this.startDate = Date.now();
    this.app = asyncify(express());
    this.config();
  }

  /**
   * Pone las configuraciones de express y sus middlewares por default
   */
  private config(): void {
    const { NODE_ENV, MAX_LIMIT_REQUESTS, API_STATICS_PATH, API_UPLOADS_PATH } = process.env;
    this.app.use(compression());
    this.app.use(cors());


    // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
    process.env.NODE_ENV === 'production' && this.app.enable('trust proxy')
    
    
    // This...
    // this.app.use(helmet());

    // ...is equivalent to this:
    this.app.use(helmet.contentSecurityPolicy());
    this.app.use(helmet.dnsPrefetchControl());
    this.app.use(helmet.expectCt());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.hsts());
    this.app.use(helmet.ieNoOpen());
    this.app.use(helmet.noSniff());
    this.app.use(helmet.permittedCrossDomainPolicies());
    this.app.use(helmet.referrerPolicy());
    this.app.use(helmet.xssFilter());
    this.app.use(express.json());
    // Directorios de archivos estáticos
    this.app.use('/statics', express.static(path.resolve(API_STATICS_PATH)));
    this.app.use('/uploads', express.static(path.resolve(API_UPLOADS_PATH)));
    this.app.use(httpContext.middleware);
    this.app.use(
      slowDown({
        windowMs: 60 * 1000,
        delayAfter: 25,
        delayMs: 500,
      }),
    );
    this.app.use(
      rateLimit({
        windowMs: 60 * 1000, // 1 minuto
        max: NODE_ENV !== 'test' ? Number(MAX_LIMIT_REQUESTS || 40) : null, // Solo 15 solicitudes por minuto
        headers: true,
        handler: errorRateLimit,
      }),
    );
    // Agrega un log en cada petición
    this.app.use((req, res, next) => {
      if (NODE_ENV !== 'test') {
        console.info('');
        console.info(
          chalk.yellow.bgBlack(
            `${req.method} - ${req.originalUrl}`,
          ),
        );
        console.info('');
      }
      next();
    });
    this.app.use(
      apicache
        .options({
          appendKey: (req: Request) => `${req.method} ${req.path} ${req.headers.authorization}`,
          statusCodes: {
            include: [
              401,
              // 403,
              // 404, // Hay problemas cuando eliminar y restauras de inmediato
            ],
          },
        })
        .middleware('5 minutes'),
    );
    // Middleware que se encarga de inicializar req.locals y req.setLocal
    this.app.use((req, res, next) => {
      if (typeof req.locals === 'undefined') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.locals = {};
      }
      req.setLocal = function setLocal(key: string, value: unknown): void {
        req.locals[key] = value;
      };
      next();
    });

    // Agrega el hook a todos los modelos que se encarga de asignar los campos createdBy y updatedBy
  }

  /**
   * Pone las rutas del API
   * @param sequelize
   */
  private async routes(dbConnection: Connection): Promise<void> {
    const router: Router = await api(dbConnection, []);
    this.app.use(process.env.API_PREFIX, router);
    // Error handlers
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }

  /**
   * Inicia el server http de express
   */
  public serve(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.info(
        chalk.black.bgCyanBright(` >> API ready on http://localhost:${port} `),
        `in ${(Date.now() - this.startDate) / 1000} seconds`,
      );
    });
  }

  /**
   * Se ejecuta cuando un error fatal ocurre
   * @param err
   */
  private handleFatalError(err: Error): void {
    console.error(chalk.redBright(`>> Fatal error: ${err.message}`));
    console.error(err.stack);
    if (this.app && this.app.dbConnection) {
      this.app.dbConnection.close();
    }

    process.exit(1);
  }

  /**
   * Se ejecuta cuando se lanza una excepción y esta no fue manejada
   * @param reason
   * @param promise
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handleRejection(reason: any, promise: Promise<void>): void {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
  }

  /**
   * Se encarga de inicializar la aplicación
   */
  public async initialize(): Promise<express.Application> {
    process.on('uncaughtException', this.handleFatalError);
    process.on('unhandledRejection', Server.handleRejection);
    try {
      // Validar que las variables de entorno se encuentren instaladas
      // const { error } = envSchema.validate(process.env);
      // if (error) {
      //   throw Error('Hay problemas con las variables de entorno', error);
      // }

      const dbConnection = await mongooseConnection();
      this.app.dbConnection = dbConnection;
      this.app.cache = new NodeCache();
      await this.routes(dbConnection);
      return this.app;
    } catch (error) {
      this.handleFatalError(error);
      return null;
    }
  }
}
