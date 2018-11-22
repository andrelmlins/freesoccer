import { Document, Schema, Model, model } from 'mongoose';

import { ICompetition } from './Competition';
import ItemTable from './ItemTable';

export interface ITable extends Document {
    competition: ICompetition;
    itens:Array<ItemTable>;
}

export var TableSchema: Schema = new Schema({
    competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
    itens:[Object]
});

export const Table: Model<ITable> = model<ITable>('Table', TableSchema);