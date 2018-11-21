import { Document, Schema, Model, model } from 'mongoose';

import { IRound } from './Round';

import CompetitionsCbf from '../enum/CompetitionsCbf';
import CompetitionType from '../enum/CompetitionType';

export interface ICompetition extends Document {
    name: string;
    year: string;
    code: CompetitionsCbf;
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