import mongoose from 'mongoose';
import { AppError } from '../errors/AppError';
import { HTTP_STATUS } from '../constants/http_constants';
import { ERROR_MESSAGES } from '../messages/error_messages';

const { DB_URI_MISSING } = ERROR_MESSAGES;
const { INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const connectDB = async () => {
  if (!process.env.DB_URI) {
    throw new AppError(INTERNAL_SERVER_ERROR, DB_URI_MISSING);
  }
  const mongoUrl = process.env.DB_URI;
  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    throw new AppError(INTERNAL_SERVER_ERROR, errorObj.message);
  }
};
