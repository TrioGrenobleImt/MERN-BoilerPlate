// types/express/index.d.ts
import { Request } from "express";
import { Types } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      userId: Types.ObjectId;
    }
  }
}
