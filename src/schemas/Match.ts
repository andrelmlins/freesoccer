import { Document, Schema, Model, model } from 'mongoose';

import { TeamResult, ITeamResult, TeamResultSchema } from './TeamResult';

export interface IMatch extends Document {
    name: string;
    date: string;
    stadium: string;
    location: string;
    teamHome: ITeamResult;
    teamGuest: ITeamResult;
}

export var MatchSchema: Schema = new Schema({
    name: String,
    date: String,
    stadium: String,
    location: String,
    teamHome: Object,
    teamGuest: Object
});

export const Match: Model<IMatch> = model<IMatch>('Match', MatchSchema);