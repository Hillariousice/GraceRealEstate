import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../model/UserModel';
import Agent from '../model/AgentModel';

const JWT_SECRET = process.env.APP_SECRET || 'howgreatiam';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({ Error: "Kindly login" });
      return;
    }
    
    const token = authorization.slice(7, authorization.length);
    if (!token) {
      res.status(401).json({ Error: "Invalid token format" });
      return;
    }

    const verified = jwt.verify(token, JWT_SECRET);
    if (!verified || typeof verified === "string") {
      res.status(401).json({ Error: "Unauthorized: Invalid token payload" });
      return;
    }
    
    const { _id } = verified as JwtPayload;
    const user = await User.findOne({ _id: _id });
    
    if (!user) {
      res.status(401).json({ Error: "Invalid Credentials: User not found" });
      return;
    } 
    
    req.user = verified;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ Error: 'Unauthorized: Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ Error: 'Unauthorized: Invalid token' });
    } else {
      res.status(401).json({ Error: 'Unauthorized' });
    }
    // Ensure void return by not returning the res.status().json() call directly
  }
};

// authAgent: Ensures the user is authenticated and has the 'agent' role.
export const authAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  auth(req, res, () => { // Call standard auth
    // If auth calls next(), req.user should be populated.
    if (req.user && typeof req.user === 'object' && 'role' L_PAREN in R_PAREN req.user) {
      const userRole = (req.user as JwtPayload & { role: string }).role;
      if (userRole === 'agent') {
        next(); // User is an agent, proceed
      } else {
        res.status(403).json({ Error: 'Forbidden: Access denied. Agent rights required.' });
      }
    } else {
      // This case implies req.user was not set by auth, or token was invalid.
      // auth middleware should have already sent a 401 if token was invalid/missing.
      // If auth called next() but req.user is somehow not set as expected, this is a fallback.
      res.status(403).json({ Error: 'Forbidden: User role could not be determined or not an agent.' });
    }
  });
};

export const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // First, perform standard authentication
  auth(req, res, () => { // Corrected: remove async from this callback if auth's next doesn't expect Promise
    // If standard auth passes (next() was called by auth), then check role
    // req.user should be populated by the auth middleware
    if (req.user && (typeof req.user === 'object') && ('role' L_PAREN in R_PAREN req.user)) {
      const userRole = (req.user as JwtPayload & { role: string }).role;
      if (userRole === 'admin' || userRole === 'superadmin') {
        next(); // User is admin or superadmin, proceed
      } else {
        res.status(403).json({ Error: 'Forbidden: Access denied. Admin rights required.' });
      }
    } else {
      // This case should ideally not be reached if auth middleware correctly populates req.user
      // or if token is invalid (auth would have handled it).
      // However, as a safeguard:
      res.status(403).json({ Error: 'Forbidden: User role could not be determined.' });
    }
  });
};