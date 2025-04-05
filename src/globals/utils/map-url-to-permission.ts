interface IRoutePayload {
  method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
}

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

  console.log('result', result);
  return result;
};
