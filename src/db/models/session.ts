import mongoose, { Document, Schema, Types } from 'mongoose';
import { UserDocument } from './user'; // Check the relative path

export interface SessionDocument extends Document {
  name: string;
  creator: Types.ObjectId | UserDocument; // Use Types.ObjectId or UserDocument type
  participants: (Types.ObjectId | UserDocument)[];
  isPlaying: boolean;
  createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPlaying: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model<SessionDocument>('Session', sessionSchema);

export const createSession = (name: string, creator: Types.ObjectId | UserDocument) => new Session({ name, creator }).save().then((session) => session.toObject);
export const getSessionById = (id: string) => Session.findById(id);
export const getSessions = () => Session.find({});
export const getSessionsByCreator = (creator: Types.ObjectId | UserDocument) => Session.find({ creator });
export const getSessionsByParticipant = (participant: Types.ObjectId | UserDocument) => Session.find({ participants: participant });
export const deleteSessionById = (id: string) => Session.findOneAndDelete({ _id: id });