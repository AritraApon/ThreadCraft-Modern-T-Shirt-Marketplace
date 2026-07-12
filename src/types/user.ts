export interface UserSessionData {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  role: 'seller' | 'buyer' | string;
}