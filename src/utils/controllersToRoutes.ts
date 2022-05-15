import { compose } from 'compose-middleware';
import { Handler, Router } from 'express';
import { Connection } from 'mongoose';
import { ClassKeys, RouterPropertiesType } from '../types/decorators';
import handlerWrapper from '../middlewares/handlerWrapper';
import controllers from '../controllers';

export default function controllersToRoutes(
  router: Router,
  globalMiddlewares: Handler[],
  dbConnection: Connection,
): Router {
  controllers.forEach((Ctrl) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controller: InstanceType<any> = new Ctrl(dbConnection);
    const prototype = Object.getPrototypeOf(controller);

    const basePath = Reflect.getOwnMetadata(ClassKeys.BasePath, prototype);

    const controllerMiddleware = Reflect.getOwnMetadata(ClassKeys.Middleware, prototype) || [];

    let members = Object.getOwnPropertyNames(controller);
    members = members.concat(Object.getOwnPropertyNames(prototype));
    members.forEach((member) => {
      const action = controller[member];
      const routeProperties: RouterPropertiesType = Reflect.getOwnMetadata(member, prototype);

      if (action && Reflect.getOwnMetadata(member, prototype)) {
        const {
          routeMiddleware,
          httpVerb,
          path,
          disableGlobalMiddlewares,
          disableControllerMiddlewares,
        } = routeProperties;

        const middlewares = [
          ...(Array.isArray(globalMiddlewares) && !disableGlobalMiddlewares
            ? globalMiddlewares
            : []),
          ...(Array.isArray(controllerMiddleware) && !disableControllerMiddlewares
            ? controllerMiddleware
            : []),
          ...(Array.isArray(routeMiddleware) ? routeMiddleware : []),
        ];
        router[httpVerb](
          `${basePath}${path}`,
          compose(middlewares.map((middleware) => handlerWrapper(middleware))),
          handlerWrapper(action),
        );
      }
    });
  });
  return router;
}
