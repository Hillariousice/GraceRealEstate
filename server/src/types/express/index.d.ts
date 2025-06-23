// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: string | JwtPayload; // or a more specific type for your user/agent payload
      agent?: string | JwtPayload;
    }
  }
}

// This empty export makes the file a module, which is necessary for global augmentation.
export {};
