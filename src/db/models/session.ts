import mongoose, { Document, Schema, Types } from 'mongoose';
import { User } from './user'; // Check the relative path

export interface Session extends Document {
  name: string;
  host: Types.ObjectId | User; // Use Types.ObjectId or UserDocument type
  participants: (Types.ObjectId | User)[];
  isPlaying: boolean;
  playlist: Types.ObjectId[];
  createdAt: Date;
}

const sessionSchema = new Schema<Session>({
  name: { type: String, required: true },
  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPlaying: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const SessionDocument = mongoose.model<Session>('Session', sessionSchema);
export const createSession = (name: string, creator: Types.ObjectId | User) => new SessionDocument({ name, creator }).save().then((session) => session.toObject);

export const joinSession = (sessionId: string, userId: string) => SessionDocument.findOneAndUpdate({ _id: sessionId }, { $addToSet: { participants: userId } });
export const getSessions = () => SessionDocument.find({});
export const deleteSession = (id: string) => SessionDocument.findOneAndDelete({ _id: id });
export const updateSession = (id: string, values: Record<string, any>) => SessionDocument.findOneAndUpdate({ _id: id }, values)