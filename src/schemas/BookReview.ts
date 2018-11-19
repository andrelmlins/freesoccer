import { Document, Schema, Model, model } from 'mongoose';
import { IBook } from './Book';
import { IUser } from './User';

export interface IBookReview extends Document {
  book: IBook;
  user: IUser;
  text: string;
  date: Date;
  rating: number;
}

export var BookReviewSchema: Schema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  date: Date,
  rating: Number
});

export const BookReview: Model<IBookReview> = model<IBookReview>('BookReview', BookReviewSchema);
