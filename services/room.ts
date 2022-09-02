import axios, { AxiosError } from 'axios';
import { room, RoomType } from '../models/rooms';
export async function createRoom(id: string, name: string, type: RoomType) {
  let newRoom = await new room({ owner: id, name, type });
  newRoom = await newRoom.save();
  return newRoom;
}
export async function getUser(token: string) {
  const { data } = await axios.get(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
  );
  /* .catch((error: AxiosError) => {
      console.log({ axiossss: error.response?.data });
    }); */
  if (data) {
    return { user: data };
  } else {
    return undefined;
  }
}
export async function getRooms(id: string) {
  const list = await room.find({ owner: id });
  return list;
}
