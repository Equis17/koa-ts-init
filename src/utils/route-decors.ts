import * as glob from 'glob';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as  Parameter from 'parameter';

type HTTPMethod = 'get' | 'put' | 'del' | 'post' | 'patch'

type LoadOptions = {
  extname?: string
}

type RouteOptions = {
  prefix?: string;
  middleWares?: Array<Koa.Middleware>
}

const router = new KoaRouter();

const decorate = (method: HTTPMethod, path: string, options: RouteOptions = {}, router: KoaRouter) => {
  return (target, property: string) => {
    process.nextTick(() => {

      const middleWares = [];
      if (options.middleWares) {
        middleWares.push(...options.middleWares);
      }

      if (target.middlewares) {
        middleWares.push(...target.middlewares);
      }

      middleWares.push(target[property]);
      const url = options.prefix ? options.prefix + path : path;
      // router[method](url, target[property])
      router[method](url, ...middleWares);
    });

  };
};

const method = method => (path: string, options?: RouteOptions) => decorate(method, path, options, router);

export const get = method('get');
export const post = method('post');
export const put = method('put');
export const del = method('del');

export const load = (folder: string, options: LoadOptions = {}): KoaRouter => {
  const extname = options.extname || '.{js,ts}';
  glob.sync(require('path').join(folder, `./**/*${extname}`)).forEach((item) => require(item));
  return router;
};

export const middleWares = (middleWares: Koa.Middleware[]) => {
  return function (target) {
    target.prototype.middlewares = middleWares;
  };
};

const validateRule = paramPart => rule => {
  return function (target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function () {
      const ctx = arguments[0];
      const p = new Parameter();
      const data = ctx[paramPart];
      const errors = p.validate(rule, data);
      console.log('error', errors);
      if (errors) throw new Error(JSON.stringify(errors));
      return oldValue.apply(null, arguments);
    };
    return descriptor;
  };
};

export const querystring = validateRule('query');
export const body = validateRule('body');
