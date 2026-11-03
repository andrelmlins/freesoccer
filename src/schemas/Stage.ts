import { Document, Schema, Model, Types, model } from 'mongoose';

import Match from './Match';

export interface IStage extends Document {
  hash: string;
  name: string;
  goals: number;
  matchs: Match[];
  competition: Types.ObjectId;
}

export const StageSchema: Schema = new Schema({
  hash: String,
  name: String,
  goals: Number,
  matchs: [Object],
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
});

export const Stage: Model<IStage> = model<IStage>('Stage', StageSchema);
