import { IUser } from '../models/userModel';
import { User } from '../types/user';

export interface IAuthRepository {
  createUser(payload: Partial<IUser>): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(userId: string, password: string): Promise<boolean>;
}
