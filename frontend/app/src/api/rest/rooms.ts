import client from './../axios';

export type Room = {
  id: string;
  name: string;
};

export type RoomResponse = {
  data: Room;
};

export type RoomListResponse = {
  data: Room[];
};

export const createSingleRoom = async (name: string) => {
  return client.post('/api/rooms', {
    room: { name },
  });
};

export const getSingleRoom = async (id: string): Promise<RoomResponse> => {
  const response = await client.get(`/api/rooms/${id}`);
  return response.data;
};

export const getRoomList = async (): Promise<RoomListResponse> => {
  const response = await client.get(`/api/rooms`);
  return response.data;
};
