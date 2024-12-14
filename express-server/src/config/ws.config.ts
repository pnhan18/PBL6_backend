import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { get } from 'lodash';

interface WSConfig {
  port: number;
}

const defaultConfig: WSConfig = {
  port: 8080,
};

// Đảm bảo WebSocketServer chỉ được tạo một lần
let wss: WebSocketServer | null = null;

const getWebSocketServer = (config: WSConfig = defaultConfig): WebSocketServer => {
  if (!wss) {
    // Nếu chưa có WebSocketServer nào, tạo mới một instance
    const server = http.createServer();
    wss = new WebSocketServer({ server });

    // Lắng nghe kết nối từ client
    wss.on("connection", (ws: WebSocket) => {
      console.log("New WebSocket connection");

      ws.on("message", (message: WebSocket.Data) => {
        console.log("Received:", message);
      });

      ws.on("close", () => {
        console.log("Connection closed");
      });
    });

    // Khởi động server và lắng nghe cổng
    server.listen(config.port, () => {
      console.log(`WebSocket server running on ws://localhost:${config.port}`);
    });
  }

  return wss;
};

export default getWebSocketServer();
