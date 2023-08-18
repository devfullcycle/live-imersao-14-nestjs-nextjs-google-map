import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
export class RoutesGateway {
  @SubscribeMessage('new-points')
  async handleMessage(
    client: Socket,
    payload: { route_id: string; lat: number; lng: number },
  ) {
    console.log('handleMessage');
    client.broadcast.emit(`admin-new-point`, payload);
    client.broadcast.emit(`new-point/${payload.route_id}`, payload);
  }
}
