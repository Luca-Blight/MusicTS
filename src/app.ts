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
const DB_PASSWORD = process.env.DB_PASSWORD;

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
const MONGO_URL = `mongodb+srv://rythm:${DB_PASSWORD}@cluster0.mb8znck.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

app.use(express.static('views'));
app.use('/', routes);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('frontend');
});

const server = http.createServer(app);
const io = new Server(server);

let userSessions = new Map<string, { sessionId: string; userName: string }>();

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.emit('message', { message: 'Welcome to the Rythm!' });

  socket.on('joinSession', (sessionId, user) => {
    console.log(`User ${user} joined session ${sessionId}`);
    socket.join(sessionId);
    io.in(sessionId).emit('message', {
      sessionId,
      user,
      message: `${user} has joined the channel`,
    });
    userSessions.set(socket.id, { sessionId, userName: user });
  });

  socket.on('leaveSession', (sessionId, user) => {
    console.log(`User ${user} has left the session ${sessionId}`);
    io.in(sessionId).emit('message', {
      sessionId,
      user,
      message: `${user} has left the channel`,
    });
  });

  socket.on('playMusic', (sessionId, playState) => {
    let playStateString = playState
      ? 'The music is playing'
      : 'The music has been paused';

    io.in(sessionId).emit('message', {
      sessionId: sessionId,
      message: playStateString,
    });
  });

  socket.on('message', (data) => {
    if (data.sessionId && data.user && data.message) {
      io.in(data.sessionId).emit('message', data);
    } else {
      console.log('Message data is missing sessionId or user');
    }
  });
  socket.on('disconnect', () => {
    let userInfo = userSessions.get(socket.id);
    if (userInfo) {
      io.in(userInfo.sessionId).emit('message', {
        sessionId: userInfo.sessionId,
        message: `${userInfo.userName} has left the channel`,
      });
      userSessions.delete(socket.id);
      socket.leave(userInfo.sessionId);
    }
    console.log(`Socket ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, io };
