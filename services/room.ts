import axios, { AxiosError } from 'axios';
import { room, RoomType } from '../models/rooms';
export async function create(
  id: string,
  data: { name: string; type: RoomType }
) {
  let newRoom = await new room({ owner: id, ...data });
  newRoom = await newRoom.save();
  return newRoom;
}

export async function getRooms(id: string) {
  const list = await room.find({ owner: id });
  return list;
}
export async function findById(id: string) {
  const newRoom = await room.findById(id);
  return newRoom;
}
