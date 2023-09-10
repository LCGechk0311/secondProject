import { Document, Types } from 'mongoose';
import { ILike } from 'likes';
import { IUser } from 'user';

interface IReview extends Document {
  title?: string;
  content?: string;
  userName?: string;
  location?: string;
  author?: string;
  uploadFile?: string[];
  comments?: Types.ObjectId[];
  commentCount? : number;
  likeCount?: number;
  isLike?: 'yes' | 'no';
  Likes?: ILike[];
  updatedUser? : IUser;
}

export { IReview };




