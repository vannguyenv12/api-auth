interface UserPayload {
  name: string;
  email: string;
  role: string;
}

declare namespace Express {
  export interface Request {
    currentUser: UserPayload;
  }
  export interface Response {
    currentUser: UserPayload;
  }
}
