
import { Router, Request, Response } from 'express';
import { SessionDocument, getSessions, joinSession,deleteSession, leaveSession } from '../db/models/session';
import { io } from '../app';

const router = Router();


router.post('/sessions', (req: Request, res: Response) => {
    /* 
    
      Create a new session   
      @param {string} name - Name of the session
      @throws {Error} - If the session already exists, check by id
    
    */
    

    res.send('POST /sessions');
  });
  
  router.put('/sessions/:sessionId/join', async (req: Request, res: Response) => {
    try {
        const sessionId = req.params.sessionId;
        const userId = req.body.userId; // assuming userId is passed in body
        await joinSession(sessionId, userId);
        io.to(sessionId).emit('sessionUpdate', { type: 'join', userId });
        res.send('Joined session');
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).send(errorMessage);
    }
});
  
router.put('/sessions/:sessionId/leave', async (req: Request, res: Response) => {
  try {
      const sessionId = req.params.sessionId;
      const userId = req.body.userId; // assuming userId is passed in body
      await leaveSession(sessionId, userId);
      io.to(sessionId).emit('sessionUpdate', { type: 'leave', userId });
      res.send('Left session');
  } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).send(errorMessage);
  }
});
  
router.put('/sessions/:sessionId/playpause', (req: Request, res: Response) => {
    /* 
      Plays or pauses a session based on the current play/pause state of the session
      @param {string} sessionId - ID of the session to join
      @throws {Error} - If the session is already playing or paused
     */
    res.send('PUT /sessions/:sessionId/playpause');
  });
  
router.get('sessions/:sessionId/participants',
    (req: Request, res: Response) => {
      /* 
      Gets a list of participants in a session
      @param {string} sessionId - ID of the session to get details from
      @throws {Error} - If the session is already playing or paused
     */
      res.send('GET /sessions/:sessionId/participants');
    }
  );

export default router;
