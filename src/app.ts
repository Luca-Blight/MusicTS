import express, { Express } from 'express';
import mongoose from 'mongoose';
import routes from './routes';

import cookieParser from 'cookie-parser';
import compression from 'compression';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

require('dotenv').config();

const PORT = process.env.PORT || 3001;
const DB_PASSWORD = process.env.db_password;

const app: Express = express();

// Middleware configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// MongoDB configuration
const MONGO_URL = `mongodb+srv://rythm:${process.env.DB_PASSWORD}@cluster0.mb8znck.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use(express.static('views'));
app.use('/', routes);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('frontend'); // Render frontend.ejs when "/" is accessed
});
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);
  const username = socket.handshake.query.username;

  socket.on('userJoined', ({ sessionId, username }) => {
    // Join the socket to a specific room based on sessionId

    socket.join(sessionId);
    socket
      .to(sessionId)
      .emit('userJoined', `${username} has joined the session`);
  });

  socket.on('leaveLeft', (sessionId) => {
    socket.leave(sessionId);
    socket.to(sessionId).emit('userLeft', `${username} has joined the session`);
  });

  socket.on('message', (data) => {
    console.log(`Received message: ${data}`);
  });
  setTimeout(
    () => socket.broadcast.emit('message', `${username} is connected`),
    200
  );
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, io };
