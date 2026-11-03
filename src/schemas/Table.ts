import { Document, Schema, Model, Types, model } from 'mongoose';

import ItemTable from './ItemTable';

export interface ITable extends Document {
  competition: Types.ObjectId;
  itens: Array<ItemTable>;
}

export const TableSchema: Schema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: 'Competition' },
  itens: [Object],
});

export const Table: Model<ITable> = model<ITable>('Table', TableSchema);
