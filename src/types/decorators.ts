import { Handler, RouterOptions } from 'express';
import { get, hasIn } from 'lodash';
import 'reflect-metadata';

import camelToKebab from '../utils/camelToKebab';

// Class Decorators
// eslint-disable-next-line no-shadow
export enum ClassKeys {
  BasePath = 'BASE_PATH',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Middleware = 'MIDDLEWARE',
  Options = 'OPTIONS',
}

export type RouterPropertiesType = {
  httpVerb: 'get' | 'post' | 'patch' | 'put' | 'delete';
  routeMiddleware?: Handler | Handler[];
  path: string;
  disableGlobalMiddlewares?: boolean;
  disableControllerMiddlewares?: boolean;
};

const defaultRouterProperties: RouterPropertiesType = {
  httpVerb: 'get',
  path: '',
  disableControllerMiddlewares: false,
  disableGlobalMiddlewares: false,
  routeMiddleware: [],
};

const defaultActionsPath = {
  index: '',
  add: '',
  show: ':id',
  edit: ':id',
  delete: ':id',
  restore: 'restore/:id',
  destroy: 'destroy/:id',
  trashed: 'trashed',
};

function getDefaultActionPath(action: string): string {
  return hasIn(defaultActionsPath, action) ? get(defaultActionsPath, action) : camelToKebab(action);
}

function helperForRoutes(
  httpVerb: RouterPropertiesType['httpVerb'],
  path?: string,
): MethodDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor?: PropertyDescriptor,
  ): PropertyDescriptor | undefined => {
    let routeProperties: Partial<RouterPropertiesType> = Reflect.getOwnMetadata(
      propertyKey,
      target,
    );
    if (!routeProperties) {
      routeProperties = { ...defaultRouterProperties };
    }
    routeProperties = {
      ...routeProperties,
      httpVerb,
      path: path !== undefined ? `/${path}` : `/${getDefaultActionPath(propertyKey as string)}`,
    };
    Reflect.defineMetadata(propertyKey, routeProperties, target);
    return descriptor;
  };
}

export function Get(path?: string): MethodDecorator {
  return helperForRoutes('get', path);
}

export function Post(path?: string): MethodDecorator {
  return helperForRoutes('post', path);
}

export function Put(path?: string): MethodDecorator {
  return helperForRoutes('put', path);
}

export function Patch(path?: string): MethodDecorator {
  return helperForRoutes('patch', path);
}

export function Delete(path?: string): MethodDecorator {
  return helperForRoutes('delete', path);
}

export function Controller(path?: string): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TFunction extends { name: string; prototype: any }>(target: TFunction): TFunction => {
    const controllerPath = `/${path || camelToKebab(target.name.replace('Controller', ''))}`;
    Reflect.defineMetadata(ClassKeys.BasePath, controllerPath, target.prototype);
    return target;
  };
}

export function ControllerMiddleware(middleware: Handler | Handler[]): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TFunction extends { name: string; prototype: any }>(target: TFunction): TFunction => {
    Reflect.defineMetadata(ClassKeys.Middleware, middleware, target.prototype);
    return target;
  };
}

export function ControllerOptions(options: RouterOptions): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TFunction extends { name: string; prototype: any }>(target: TFunction): TFunction => {
    Reflect.defineMetadata(ClassKeys.Options, options, target.prototype);
    return target;
  };
}

export function Middleware(middleware: Handler[]): MethodDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ): PropertyDescriptor | void => {
    let routeProperties = Reflect.getOwnMetadata(propertyKey, target) as RouterPropertiesType;
    if (!routeProperties) {
      routeProperties = { ...defaultRouterProperties };
    }
    routeProperties.routeMiddleware = middleware;
    Reflect.defineMetadata(propertyKey, routeProperties, target);
    // For class methods that are not arrow functions
    if (descriptor) {
      return descriptor;
    }
    return undefined;
  };
}

export function DisableGlobalMiddlewares(): MethodDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,consistent-return
  ): PropertyDescriptor | void => {
    const routeProperties = Reflect.getOwnMetadata(propertyKey, target) || {};
    routeProperties.disableGlobalMiddlewares = true;
    Reflect.defineMetadata(propertyKey, routeProperties, target);

    if (descriptor) {
      return descriptor;
    }
    return undefined;
  };
}

export function DisableControllerMiddlewares(): MethodDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ): PropertyDescriptor | void => {
    const routeProperties = Reflect.getOwnMetadata(propertyKey, target) || {};
    routeProperties.disableControllerMiddlewares = true;
    Reflect.defineMetadata(propertyKey, routeProperties, target);

    if (descriptor) {
      return descriptor;
    }
    return undefined;
  };
}

export function DisableMiddlewares(): MethodDecorator {
  return (
    // eslint-disable-next-line consistent-return,@typescript-eslint/no-explicit-any
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor,
  ): PropertyDescriptor | void => {
    const routeProperties = Reflect.getOwnMetadata(propertyKey, target) || {};
    routeProperties.disableGlobalMiddleware = true;
    routeProperties.disableControllerMiddleware = true;
    Reflect.defineMetadata(propertyKey, routeProperties, target);

    if (descriptor) {
      return descriptor;
    }
    return undefined;
  };
}
