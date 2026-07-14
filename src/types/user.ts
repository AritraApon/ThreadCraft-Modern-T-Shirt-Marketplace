import { ObjectId } from "mongodb";

export interface UserSessionData {
  id?: string;
  _id: string | ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}