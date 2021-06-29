import { Document, Schema, Model, model } from 'mongoose';

import { IRound } from './Round';
import { IStage } from './Stage';

import CompetitionType from '../enums/CompetitionType';
import CompetitionCode from '../enums/CompetitionCode';

export interface ICompetition extends Document {
  name: string;
  year: string;
  code: CompetitionCode;
  type: CompetitionType;
  country: string;
  federation: string;
  rounds: IRound[];
  stages: IStage[];
}

export let CompetitionSchema: Schema = new Schema({
  name: String,
  year: String,
  code: String,
  type: String,
  country: String,
  federation: String,
  rounds: [{ type: Schema.Types.ObjectId, ref: 'Round', required: false }],
  stages: [{ type: Schema.Types.ObjectId, ref: 'Stage', required: false }],
});

export const Competition: Model<ICompetition> = model<ICompetition>('Competition', CompetitionSchema);
