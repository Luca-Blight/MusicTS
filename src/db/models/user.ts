// src/models/user.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  session: Schema.Types.ObjectId[]; // Explicitly define the type
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  session: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);

export const getUsers = () => UserModel.find({});
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (userId: string) => UserModel.findById(userId);

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject);
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findOneAndUpdate({ _id: id }, values);
// export const getUsersBySession = (sessionId: string) => UserModel.find({ session: sessionId });

