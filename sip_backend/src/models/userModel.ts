import { EMAIL_REGEX, PASSWORD_MIN_LENGTH } from '../constants/validation_constants';
import { Schema, model, Document } from 'mongoose';
import { VALIDATION_MESSAGES } from '../messages/validation_messages';

const { PASSWORD_REQUIRED, PASSWORD_MIN_LENGTH_REQUIRED, EMAIL_REQUIRED, EMAIL_INVALID } =
  VALIDATION_MESSAGES;

export interface IUser extends Document {
  email: string;
  mobile: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, EMAIL_INVALID],
    },
    mobile: {
      type: String,
      required: [true, VALIDATION_MESSAGES.MOBILE_REQUIRED],
      trim: true,
    },
    password: {
      type: String,
      required: [true, PASSWORD_REQUIRED],
      minlength: [PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_REQUIRED],
      select: false, //Password will NOT included
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = model<IUser>('User', userSchema);
export default UserModel;
