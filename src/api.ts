import { Router, Handler } from 'express';
import Boom from '@hapi/boom';
import passport from 'passport';
import asyncify from 'express-asyncify';
import emailValidator from 'email-validator';
import { Connection } from 'mongoose';
import 'reflect-metadata';
import ctrls from './controllers';
import handlerWrapper from './middlewares/handlerWrapper';
import controllersToRoutes from './utils/controllersToRoutes';
import MailHandler from './utils/MailHandler';

const router = asyncify<Router>(Router());

export default async function api(
  dbConnection: Connection,
  globalMiddlewares: Handler[] = [],
): Promise<Router> {
  controllersToRoutes(router, globalMiddlewares, dbConnection);

  // WELCOME REQUEST
  router.get(
    '/',
    handlerWrapper(async (req, res) => {
      const dev = process.env.NODE_ENV === 'development';
      const env = dev ? { env: process.env } : {};
      const routesList = router.stack.map((item) => {
        if (item.route === undefined) {
          return undefined;
        }
        return `${item.route.stack[0].method.toUpperCase()} ${item.route.path}`;
      });
      const routes = dev ? { routes: routesList } : {};
      const controllersName = ctrls.map((controller) => controller.name);
      const controllers = dev ? { controllers: controllersName } : {};
      const filesFields: { [key: string]: string[] } = {};

      const user = dev ? { user: req.user } : {};
      res.send({
        version: '3.0',
        message: 'Welcome to API',
        ...user,
        ...controllers,
        filesFields: { ...filesFields },
        ...routes,
        ...env,
        cache: req.app.cache.getStats(),
      });
    }),
  );
  router.use(passport.initialize());

  router.post('/test/email', async (req, res) => {
    const email: string = req.body.email || '';
    if (!emailValidator.validate(email)) {
      throw Boom.badRequest('The email is not valid');
    }

    const mail = new MailHandler({
      email,
      subject: 'test mail',
      test: false,
    });

    const mailSended = await mail.send('testHealthCheck', { force: false });

    if (!mailSended) {
      throw Boom.serverUnavailable(
        'The service of email is not working',
      );
    }
    return res.json({ status: 201 });
  });

  return router;
}
