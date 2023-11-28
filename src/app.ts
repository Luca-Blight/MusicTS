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
    origin: '*',
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
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
  res.render('frontend');
});

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.emit('message', { message: 'Welcome to the Rythm!' });

  socket.on('joinSession', (sessionId, user) => {
    console.log(`User ${user} joined session ${sessionId}`);
    socket.join(sessionId);
    io.in(sessionId).emit('joinSession', `${user} has joined the channel`);
  });

  socket.on('leaveSession', (sessionId, user) => {
    console.log(`User ${user} left session ${sessionId}`);
    io.in(sessionId).emit('leaveSession', `${user} has left the channel`);
    socket.leave(sessionId);
  });

  socket.on('playMusic', (sessionId, playState) => {
    let playStateString = playState
      ? 'The music is playing'
      : 'The music has been paused';
    io.in(sessionId).emit('playMusic', playStateString);
  });

  socket.on('message', (data) => {
    if (data.sessionId && data.user && data.message) {
      io.in(data.sessionId).emit('message', data);
    } else {
      console.log('Message data is missing sessionId or user');
    }
  });
  socket.on('disconnect', () => {
    // create function to determine user val
    console.log(`Socket ${socket.id} disconnected`);
    socket.broadcast.emit('message', 'user disconnected from the channel');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, io };
