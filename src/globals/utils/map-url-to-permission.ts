export const mapUrlToPermission = (route: IRoutePayload) => {
  const actionMaps = {
    GET: 'VIEW',
    POST: 'CREATE',
    PATCH: 'UPDATE',
    PUT: 'UPDATE',
    DELETE: 'DELETE'
  };

  let result = actionMaps[route.method];
  const routeSegments = route.path.split('/');
  for (const segment of routeSegments) {
    const segmentUpperCase = segment.toUpperCase().replace(':', '').replace('-', '_');

    result += `_${segmentUpperCase}`;
  }

  return result;
};
