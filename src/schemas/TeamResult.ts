import { Document, Schema, Model, model } from 'mongoose';

export interface ITeamResult extends Document {
    name: string;
    initials: string;
    flag: string;
    goals?: number;
}

export var TeamResultSchema: Schema = new Schema({
    name: String,
    initials: String,
    flag: String,
    goals: Number
});

export const TeamResult: Model<ITeamResult> = model<ITeamResult>('TeamResult', TeamResultSchema);