import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
  }
  return socket;
}