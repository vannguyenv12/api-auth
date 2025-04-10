interface UserPayload {
  _id: string;
  name: string;
  email: string;
  roles: string;
  jwtId: string;
  isActive: boolean;
}

interface ISendEmailPayload {
  from?: string;
  to: string;
  subject: string;
  html: string;
}

interface IRoutePayload {
  method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
}

declare namespace Express {
  export interface Request {
    currentUser: UserPayload;
  }
  export interface Response {
    currentUser: UserPayload;
  }
}
