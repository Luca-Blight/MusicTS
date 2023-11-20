
import { Router, Request, Response } from 'express';
import { SessionDocument, getSessions, createSession, joinSession,deleteSession } from '../db/models/session';


const router = Router();


router.post('/sessions', (req: Request, res: Response) => {
    /* 
    
      Create a new session   
      @param {string} name - Name of the session
      @throws {Error} - If the session already exists, check by id
    
    */
    res.send('POST /sessions');
  });
  
router.put('/sessions/:sessionId/join', (req: Request, res: Response) => {
    /* 
    
      Join a session, adds the user to the session, increases the number of participants in the session if the session is not full
      @param {string} sessionId - ID of the session to join
      @throws {Error} - If the session is full
      @throws {Error} - If the session does not exist
    */
    res.send('POST /sessions/:sessionId/join');
  });
  
router.put('/sessions/:sessionId/leave', (req: Request, res: Response) => {
    /* 
      Leaves a session, removes the user from the session, decreases the number of participants in the session
      @param {string} sessionId - ID of the session to join
      @throws {Error} - if the session does not exist
     */
    res.send('POST /sessions/:sessionId/leave');
  });
  
router.put('/sessions/:sessionId/playpause', (req: Request, res: Response) => {
    /* 
      Plays or pauses a session based on the current play/pause state of the session
      @param {string} sessionId - ID of the session to join
      @throws {Error} - If the session is already playing or paused
     */
    res.send('PUT /sessions/:sessionId/playpause');
  });
  
router.get(
    '/sessions/:sessionId/participants',
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
