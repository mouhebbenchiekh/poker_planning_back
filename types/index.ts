export interface IUser {
  id: string;
  family_name: string;
  given_name: string;
  email: string;
}

export interface ISocketUser {
  id: string;
  username: string;
  room: string;
  value?: string;
  userId: string;
}
