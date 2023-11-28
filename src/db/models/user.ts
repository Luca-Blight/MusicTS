import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  userName: string;
  email: string;
  createdAt: Date;
}

const userSchema = new Schema<User>({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },

});

export const UserDocument = mongoose.model<User>('User', userSchema, 'users');

export const getUsers = () => UserDocument.find({});
export const getUser = (email: string) => UserDocument.findOne({ email });
export const deleteUser = (id: string) => UserDocument.findOneAndDelete({ _id: id });
export const updateUser = (id: string, values: Record<string, any>) => UserDocument.findOneAndUpdate({ _id: id }, values);

