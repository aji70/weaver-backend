import { Document, Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  address: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = User & Document;

export interface JwtPayload {
  sub: string;
  address: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}
