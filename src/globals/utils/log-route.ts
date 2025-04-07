import { Application } from 'express';

export const getAllRoutes = (app: Application): IRoutePayload[] => {
  const routes: { method: string; path: string }[] = [];

  const routerStack = app._router.stack;

  const traverse = (stack: any[], prefix = '') => {
    stack.forEach((layer: any) => {
      if (layer.route) {
        const path = layer.route.path;
        const methods = Object.keys(layer.route.methods)
          .filter((method) => layer.route.methods[method])
          .map((method) => method.toUpperCase());

        methods.forEach((method) => {
          routes.push({ method, path: `${prefix}${path}` });
        });
      } else if (layer.handle && layer.handle.stack) {
        let currentPrefix = prefix;

        if (layer.regexp) {
          const match = layer.regexp.toString().match(/^\/\^\\\/(.*?)\\\/\?/);
          if (match) {
            currentPrefix = `/${match[1].replace(/\\\//g, '/')}`;
          }
        }

        traverse(layer.handle.stack, currentPrefix);
      }
    });
  };

  traverse(routerStack);

  return routes.map((route) => ({
    method: route.method,
    path: route.path.replace('/api/v1/', '').replace(/\/+$/, '')
  })) as IRoutePayload[];
};
