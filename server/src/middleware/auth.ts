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

export const authAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
      res.status(401).json({ Error:"Unauthorized: Invalid token payload" });
      return;
    }
        
    const { _id } = verified as JwtPayload;
    const agent = await Agent.findOne({ _id: _id });
        
    if (!agent) {
      res.status(401).json({ Error: "Invalid Credentials: Agent not found" });
      return;
    }
        
    req.agent = verified;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ Error: 'Unauthorized: Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ Error: 'Unauthorized: Invalid token' });
    } else {
      res.status(401).json({ Error: 'Unauthorized' });
    }
  }
};