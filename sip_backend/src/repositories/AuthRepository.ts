import UserModel, { IUser } from '../models/userModel';
import { User } from '../types/user';
import { IAuthRepository } from './AuthRepositoryInterface';

export class AuthRepository implements IAuthRepository {
  async createUser(payload: Partial<IUser>): Promise<void> {
    await UserModel.create(payload);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      mobile: user.mobile,
      password: user.password,
    };
  }

  async updatePassword(userId: string, password: string): Promise<boolean> {
    const updated = await UserModel.findByIdAndUpdate(userId, { password });
    return updated ? true : false;
  }
}
