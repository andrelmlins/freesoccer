import { Document, Schema, Model, Types, model } from 'mongoose';

import Match from './Match';

export interface IRound extends Document {
  hash: string;
  number: string;
  goals: number;
  goalsHome: number;
  goalsGuest: number;
  matchs: Match[];
  competition: Types.ObjectId;
}

export const RoundSchema: Schema = new Schema({
  hash: String,
  number: String,
  goals: Number,
  goalsHome: Number,
  goalsGuest: Number,
  matchs: [Object],
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
});

export const Round: Model<IRound> = model<IRound>('Round', RoundSchema);
