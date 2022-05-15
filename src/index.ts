import dotenv from 'dotenv';
import Server from './Server';

dotenv.config({ path: '../.env' });
const server = new Server();
server.initialize().then(() => {
  server.serve();
});
