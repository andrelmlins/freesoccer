import { Document, Schema, Model, model } from 'mongoose';

export enum IBookProgressType {
  PAGE,
  PERCENTAGE
}

export interface IBookShelf extends Document {
  book: string;
  user: string;
  shelf: string;
  date: Date;
  progressType: IBookProgressType;
  progress: number;
}

export var BookShelfSchema: Schema = new Schema({
  book: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  shelf: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  progressType: {
    type: Number,
    enum: IBookProgressType,
    required: true,
    default: IBookProgressType.PAGE
  },
  progress: {
    type: String,
    required: true,
    default: 0
  }
});

export const BookShelf: Model<IBookShelf> = model<IBookShelf>('BookShelf', BookShelfSchema);
