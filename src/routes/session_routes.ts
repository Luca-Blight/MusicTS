import { Router, Request, Response } from 'express';
import {
  SessionDocument,
  getAllSessions,
  joinSession,
  leaveSession,
  playMusic,
} from '../db/models/session';
import { io } from '../app';

const router = Router();

router.post('/createSession', async (req: Request, res: Response) => {
  const hostName = req.body.host;
  const sessionName = req.body.name;

  console.log(`sessionName: ${sessionName}, hostName: ${hostName}`);
  try {
    const session = new SessionDocument({ name: sessionName, host: hostName });
    const savedSession = await session.save();
    console.log(`savedSession: ${JSON.stringify(savedSession)}`);
    res.status(201).send(savedSession);
    io.to(savedSession._id).emit('joinSession', savedSession._id);
  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(500).send(errorMessage);
  }
});

router.put('/:sessionId/join', async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.body.userId;
    const userName = req.body.userName;

    await joinSession(sessionId, userId);
    io.to(sessionId).emit('joinSession', { sessionId, userName });
    res.send('Joined session');
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).send(errorMessage);
  }
});

router.put('/:sessionId/leave', async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.body.userId;
    const userName = req.body.userName;

    await leaveSession(sessionId, userId);
    io.to(sessionId).emit('leaveSession', { sessionId, userName });
    res.send('Left session');
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).send(errorMessage);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const sessions = await getAllSessions();
    res.status(200).send(sessions);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).send(errorMessage);
  }
});

router.put('/:sessionId/playMusic', async (req: Request, res: Response) => {
  /* 
      Plays or pauses a session based on the current play/pause state of the session
      @param {string} sessionId - ID of the session to join
      @throws {Error} - If the session is already playing or paused
     */
  const sessionId = req.params.sessionId;
  const playState = req.body.playState;
  try {
    await playMusic(sessionId, playState);
    io.to(sessionId).emit('playMusic', playState);
  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(500).send(errorMessage);
  }
});

export default router;
