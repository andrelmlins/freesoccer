import { Document, Schema, Model, model } from 'mongoose';

import { IRound } from './Round';

import CompetitionType from '../enums/CompetitionType';
import CompetitionCode from '../enums/CompetitionCode';

export interface ICompetition extends Document {
    name: string;
    year: string;
    code: CompetitionCode;
    type: CompetitionType;
    country: string;
    rounds: IRound[];
}

export var CompetitionSchema: Schema = new Schema({
    name: String,
    year: String,
    code: String,
    type: String,
    country: String,
    rounds: [{ type: Schema.Types.ObjectId, ref: 'Round' }]
});

export const Competition: Model<ICompetition> = model<ICompetition>('Competition', CompetitionSchema);