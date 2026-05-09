const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3001;
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I,O,0,1
const ROOM_CODE_LENGTH = 4;
const HEARTBEAT_INTERVAL = 15000; // 15s ping
const DISCONNECT_TIMEOUT = 30000; // 30s no response = disconnected

// Room: { id, host: ws, guest: ws, hostRole: 'defender', seed: number, timer: NodeJS.Timeout }
const rooms = new Map();

function generateRoomCode() {
  let code;
  do {
    code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
    }
  } while (rooms.has(code));
  return code;
}

function generateSeed() {
  return Math.floor(Math.random() * 2147483647);
}

function send(ws, data) {
  if (ws && ws.readyState === 1) { // WebSocket.OPEN
    ws.send(JSON.stringify(data));
  }
}

function broadcastRoom(room, message) {
  if (room.host) send(room.host, message);
  if (room.guest) send(room.guest, message);
}

function startHeartbeat(ws) {
  ws.isAlive = true;
  ws._heartbeatTimer = setInterval(() => {
    if (!ws.isAlive) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    send(ws, { type: 'ping' });
  }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat(ws) {
  clearInterval(ws._heartbeatTimer);
}

function cleanupRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  clearInterval(room.timer);
  if (room.host) stopHeartbeat(room.host);
  if (room.guest) stopHeartbeat(room.guest);
  rooms.delete(roomId);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('PvZ Duel Server');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.roomId = null;
  ws.role = null;

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    // Heartbeat response
    if (msg.type === 'pong') {
      ws.isAlive = true;
      return;
    }

    switch (msg.type) {
      case 'create_room': {
        if (ws.roomId) {
          send(ws, { type: 'error', message: '已经在房间中' });
          return;
        }
        const roomId = generateRoomCode();
        const seed = generateSeed();
        const room = { id: roomId, host: ws, guest: null, hostRole: 'defender', seed };
        rooms.set(roomId, room);
        ws.roomId = roomId;
        ws.role = 'defender';
        startHeartbeat(ws);

        send(ws, { type: 'room_created', roomId, seed });

        // Auto-close room after 5 minutes if no one joins
        room.timer = setTimeout(() => {
          if (room && !room.guest) {
            send(room.host, { type: 'room_expired' });
            cleanupRoom(roomId);
          }
        }, 300000);

        console.log(`Room created: ${roomId}`);
        break;
      }

      case 'join_room': {
        const { roomId } = msg;
        if (!roomId || !rooms.has(roomId)) {
          send(ws, { type: 'error', message: '房间不存在或已过期' });
          return;
        }
        const room = rooms.get(roomId);
        if (room.guest) {
          send(ws, { type: 'error', message: '房间已满' });
          return;
        }
        if (ws.roomId) {
          send(ws, { type: 'error', message: '已经在房间中' });
          return;
        }

        room.guest = ws;
        ws.roomId = roomId;
        ws.role = 'attacker';
        startHeartbeat(ws);
        clearTimeout(room.timer);

        // Notify both players
        send(room.guest, { type: 'player_joined', role: 'attacker', seed: room.seed });
        send(room.host, { type: 'player_joined', role: 'defender' });

        console.log(`Player joined room ${roomId}`);
        break;
      }

      case 'start_game': {
        if (!ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || ws !== room.host) return;

        send(room.host, {
          type: 'game_start',
          seed: room.seed,
          duration: 180,
          role: room.hostRole,
        });
        if (room.guest) {
          send(room.guest, {
            type: 'game_start',
            seed: room.seed,
            duration: 180,
            role: room.hostRole === 'defender' ? 'attacker' : 'defender',
          });
        }
        console.log(`Game started in room ${room.id}`);
        break;
      }

      case 'action': {
        // Relay player action to opponent
        if (!ws.roomId || !ws.role) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;

        const opponent = ws === room.host ? room.guest : room.host;
        if (opponent) {
          send(opponent, {
            type: 'opponent_action',
            action: msg.action,
          });
        }
        break;
      }

      case 'game_over': {
        if (!ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;
        console.log(`Game over in room ${room.id}, winner: ${msg.winner}`);
        break;
      }

      default:
        send(ws, { type: 'error', message: `未知消息类型: ${msg.type}` });
    }
  });

  ws.on('close', () => {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const isHost = ws === room.host;

    // Notify the other player
    if (isHost && room.guest) {
      send(room.guest, { type: 'opponent_disconnected' });
      room.host = null;
    } else if (!isHost && room.host) {
      send(room.host, { type: 'opponent_disconnected' });
      room.guest = null;
    } else {
      // Both disconnected, clean up
      cleanupRoom(roomId);
      console.log(`Room ${roomId} closed`);
    }

    stopHeartbeat(ws);
  });

  ws.on('error', () => {
    // handled by close
  });
});

server.listen(PORT, () => {
  console.log(`PvZ Duel Server running on port ${PORT}`);
});
