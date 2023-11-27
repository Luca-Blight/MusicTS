import { Router, Request, Response } from 'express';
import {
  SessionDocument,
  getAllSessions,
  joinSession,
  leaveSession,
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

    console.log(`sessionId: ${sessionId}, userId: ${userId}`);
    await joinSession(sessionId, userId);
    io.to(sessionId).emit('sessionJoin', { sessionId, userName });
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
    io.to(sessionId).emit('sessionLeave', { sessionId, userName });
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

router.put('/:sessionId/playpause', (req: Request, res: Response) => {
  /* 
      Plays or pauses a session based on the current play/pause state of the session
      @param {string} sessionId - ID of the session to join
      @throws {Error} - If the session is already playing or paused
     */
  res.send('PUT /:sessionId/playpause');
});

export default router;
