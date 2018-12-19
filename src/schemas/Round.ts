import { Document, Schema, Model, model } from "mongoose";

import Match from "./Match";
import { ICompetition } from "./Competition";

export interface IRound extends Document {
  hash: string;
  number: string;
  goals: number;
  goalsHome: number;
  goalsGuest: number;
  matchs: Match[];
  competition: ICompetition;
}

export var RoundSchema: Schema = new Schema({
  hash: String,
  number: String,
  goals: Number,
  goalsHome: Number,
  goalsGuest: Number,
  matchs: [Object],
  competition: { type: Schema.Types.ObjectId, ref: "Competition" }
});

export const Round: Model<IRound> = model<IRound>("Round", RoundSchema);
