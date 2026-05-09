// Client-side WebSocket network layer
// Dependencies: rng.js

const SERVER_URL = 'ws://localhost:3001'; // Change for production
// const SERVER_URL = 'wss://your-app.onrender.com';

const Network = {
  ws: null,
  connected: false,
  roomId: null,
  role: null, // 'defender' | 'attacker'
  reconnectAttempts: 0,
  maxReconnectAttempts: 3,
  callbacks: {},

  // Connect to server
  connect(serverUrl = SERVER_URL) {
    return new Promise((resolve, reject) => {
      if (this.ws && this.connected) {
        resolve();
        return;
      }

      try {
        this.ws = new WebSocket(serverUrl);
      } catch (e) {
        reject(e);
        return;
      }

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('Network: connected');
        resolve();
      };

      this.ws.onmessage = (e) => {
        let msg;
        try {
          msg = JSON.parse(e.data);
        } catch {
          return;
        }
        this._handleMessage(msg);
      };

      this.ws.onclose = () => {
        this.connected = false;
        console.log('Network: disconnected');
        if (this.callbacks.onDisconnect) {
          this.callbacks.onDisconnect();
        }
        this._tryReconnect(serverUrl);
      };

      this.ws.onerror = (err) => {
        console.error('Network: error', err);
        reject(err);
      };
    });
  },

  _tryReconnect(serverUrl) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    console.log(`Network: reconnect attempt ${this.reconnectAttempts}`);
    setTimeout(() => {
      this.connect(serverUrl).catch(() => {});
    }, 2000 * this.reconnectAttempts);
  },

  _handleMessage(msg) {
    switch (msg.type) {
      case 'ping':
        this._send({ type: 'pong' });
        break;

      case 'room_created':
        this.roomId = msg.roomId;
        this.role = 'defender';
        if (this.callbacks.onRoomCreated) this.callbacks.onRoomCreated(msg.roomId);
        break;

      case 'player_joined':
        this.role = msg.role || this.role;
        if (msg.seed) {
          RNG = createRNG(msg.seed);
        }
        if (this.callbacks.onPlayerJoined) this.callbacks.onPlayerJoined(this.role);
        break;

      case 'game_start':
        RNG = createRNG(msg.seed);
        if (this.callbacks.onGameStart) {
          this.callbacks.onGameStart({
            role: msg.defender === 'host' ? 'defender' : 'attacker',
            duration: msg.duration,
            seed: msg.seed,
          });
        }
        break;

      case 'opponent_action':
        if (this.callbacks.onOpponentAction) {
          this.callbacks.onOpponentAction(msg.action);
        }
        break;

      case 'opponent_disconnected':
        if (this.callbacks.onOpponentDisconnected) this.callbacks.onOpponentDisconnected();
        break;

      case 'room_expired':
        if (this.callbacks.onRoomExpired) this.callbacks.onRoomExpired();
        break;

      case 'error':
        console.error('Network error:', msg.message);
        if (this.callbacks.onError) this.callbacks.onError(msg.message);
        break;
    }
  },

  _send(data) {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(data));
    }
  },

  // Public API
  createRoom() {
    this._send({ type: 'create_room' });
  },

  joinRoom(roomId) {
    this._send({ type: 'join_room', roomId: roomId.toUpperCase() });
  },

  startGame() {
    this._send({ type: 'start_game' });
  },

  sendAction(action) {
    this._send({ type: 'action', action });
  },

  gameOver(winner) {
    this._send({ type: 'game_over', winner });
  },

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts; // prevent reconnect
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.roomId = null;
    this.role = null;
  },

  on(event, callback) {
    this.callbacks[event] = callback;
  },
};
