import { fastify } from '../index';
import mongoose from 'mongoose';
export interface IRoom {
  owner: string;
  refrence: string;
  type: RoomType;
}

export enum RoomType {
  fibonachi = 'Fibonachi',
  regular = 'Regular',
}
const Schema = mongoose.Schema;
const roomSchema = new Schema({
  owner: { type: String, required: true },
  refrence: { type: String, required: false },
  type: {
    type: String,
    enum: RoomType,
    required: true,
    default: RoomType.fibonachi,
  },
  name: { type: String, required: true },
});
roomSchema.pre('save', function (next) {
  this.refrence = `${fastify.config.FRONTEND_URL}/${this._id}`;
  next();
});

export const room = mongoose.model('room', roomSchema);
